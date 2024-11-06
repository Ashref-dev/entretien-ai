"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { evaluateInterview } from "@/actions/ai-interview-evaluate";
import { Interview } from "@/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function InterviewProcess({
  interview,
}: {
  interview: Interview;
}) {
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [hasRecorded, setHasRecorded] = useState<boolean[]>([]);
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const [loading, setLoading] = useState(false);
  const questions = interview.interviewData;
  const currentQuestion = questions[currentQuestionIndex];

  const loadingStates = [
    {
      text: "🔍 Analyzing your responses...",
    },
    {
      text: "🗣️ Asking Balti for feedback...",
    },
    {
      text: "⚙️ Checking technical accuracy...",
    },
    {
      text: "🧩 Assessing problem-solving approach...",
    },
    {
      text: "💻 Reviewing coding best practices...",
    },
    {
      text: "📊 Calculating performance metrics...",
    },
    {
      text: "📝 Generating detailed feedback...",
    },
    {
      text: "🎯 Preparing your interview results...",
    },
  ];

  useEffect(() => {
    setIsLastQuestion(currentQuestionIndex === questions.length - 1);
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    setHasRecorded(new Array(questions.length).fill(false));
  }, [questions.length]);

  useEffect(() => {
    if (videoRef.current && isVideoOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ""; // Store only finalized text here
        let interimTranscript = ""; // Clear interim text each cycle

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Only update state once per result, adding a space before appending finalTranscript
        setTranscripts((prev) => {
          const newTranscripts = [...prev];
          newTranscripts[currentQuestionIndex] =
            (newTranscripts[currentQuestionIndex] || "").trim() +
            " " +
            finalTranscript.trim(); // Add a space before the new final text
          return newTranscripts;
        });

        // Optionally: Set interimTranscript to state if you need a real-time view
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isVideoOn, currentQuestionIndex]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      if (isRecording) {
        toggleRecording();
      }
    } else {
      finishInterview();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      if (isRecording) {
        toggleRecording();
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setHasRecorded((prev) => {
        const newHasRecorded = [...prev];
        newHasRecorded[currentQuestionIndex] = true;
        return newHasRecorded;
      });
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (recognitionRef.current) {
      if (isMicOn) {
        recognitionRef.current.stop();
      } else if (isRecording) {
        recognitionRef.current.start();
      }
    }
  };

  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  const finishInterview = async () => {
    if (isRecording) {
      toggleRecording();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const updatedInterviewData = questions.map((question, index) => ({
      ...question,
      userAnswer: transcripts[index] || "",
    }));

    setLoading(true);

    toast.promise(
      (async () => {
        const result = await evaluateInterview({
          interviewId: interview.id,
          interviewData: updatedInterviewData,
          difficulty: interview.difficulty || "MID_LEVEL",
          yearsOfExperience: interview.yearsOfExperience,
          duration: elapsedTime,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        router.push(`/interviews/${interview.id}/results`);
        return result;
      })(),
      {
        loading: "Evaluating Interview...",
        success: "Interview evaluated successfully!",
        error: "Failed to evaluate interview",
      },
    );
  };

  const isAnswerValid = (index: number) => {
    return hasRecorded[index] && transcripts[index]?.trim().length > 0;
  };

  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
      <div className="container mx-auto space-y-4 p-2 sm:space-y-6 sm:p-4">
        <h1 className="mb-4 text-center text-2xl font-bold sm:mb-6 sm:text-3xl">
          Interview Session
        </h1>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}{" "}
            <span className="font-mono">
              ({formatTime(elapsedTime)} elapsed)
            </span>
          </div>
          <div className="flex justify-end">
            <ToggleGroup type="multiple" variant="outline">
              <ToggleGroupItem
                value="mic"
                aria-label="Toggle microphone"
                onClick={toggleMic}
              >
                {isMicOn ? (
                  <Mic className="size-4" />
                ) : (
                  <MicOff className="size-4" />
                )}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="video"
                aria-label="Toggle video"
                onClick={toggleVideo}
              >
                {isVideoOn ? (
                  <Video className="size-4" />
                ) : (
                  <VideoOff className="size-4" />
                )}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-lg sm:text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <p className="text-base sm:text-lg">
                {currentQuestion?.aiQuestion}
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-base sm:text-lg">Webcam</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="aspect-video overflow-hidden rounded-lg bg-black">
                {isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-white">
                    Camera Off
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 flex h-full flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
              <CardTitle className="text-base sm:text-lg">
                Your Answer
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isTypingMode}
                  onCheckedChange={setIsTypingMode}
                  aria-label="Toggle typing mode"
                />
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Typing Mode
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 sm:p-6">
              <div className="flex h-full flex-col space-y-3 sm:space-y-4">
                {isTypingMode ? (
                  <Textarea
                    placeholder="Type your answer here..."
                    className="min-h-40 flex-1 resize-none"
                    value={transcripts[currentQuestionIndex] || ""}
                    onChange={(e) => {
                      const newTranscripts = [...transcripts];
                      newTranscripts[currentQuestionIndex] = e.target.value;
                      setTranscripts(newTranscripts);
                      setHasRecorded((prev) => {
                        const newHasRecorded = [...prev];
                        newHasRecorded[currentQuestionIndex] = true;
                        return newHasRecorded;
                      });
                    }}
                  />
                ) : (
                  <div className="min-h-0 flex-1 overflow-y-auto rounded-lg bg-muted/20 p-3 text-sm sm:p-4 sm:text-base">
                    {transcripts[currentQuestionIndex] ||
                      "Your speech will appear here as you speak..."}
                  </div>
                )}
                {!isTypingMode && (
                  <Button
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-center sm:space-x-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-[100px]"
          >
            <ChevronLeft className="mr-2 size-4" />
            Previous
          </Button>

          <div className="relative order-first flex-1 px-4 sm:order-none">
            <div className="absolute inset-0 flex items-center">
              <div className="h-1 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="relative flex justify-between">
              {questions.map((_, index) => {
                const isCompleted = index < currentQuestionIndex;
                const isCurrent = index === currentQuestionIndex;
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md p-0 transition-all sm:size-8",
                      {
                        "shadow-[0_0_15px_2px] shadow-primary": isCurrent,
                        "bg-primary": isCompleted || isCurrent,
                        "bg-muted hover:bg-muted/80":
                          !isCompleted && !isCurrent,
                      },
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-3 sm:size-4" />
                    ) : (
                      <span className="text-[10px] sm:text-xs">
                        {index + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button
          
            variant="outline"
            onClick={handleNext}
            className="w-full sm:w-[100px]"
            disabled={!isAnswerValid(currentQuestionIndex)}
          >
            {isLastQuestion ? (
              <>
                Finish
                <Check className="ml-2 size-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
