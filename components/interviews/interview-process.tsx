"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Interview } from "@/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Type,
  Video,
  VideoOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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

  const questions = interview.interviewData;
  const currentQuestion = questions[currentQuestionIndex];

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
    console.log("Setting up timer"); // Debug log
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => {
        console.log("Current elapsed time:", prev + 1); // Debug log
        return prev + 1;
      });
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

    console.log("Current elapsed time:", elapsedTime);

    const updatedInterviewData = questions.map((question, index) => ({
      ...question,
      userAnswer: transcripts[index] || "",
    }));

    try {
      const payload = {
        interviewData: updatedInterviewData,
        difficulty: interview.difficulty,
        yearsOfExperience: interview.yearsOfExperience,
        duration: elapsedTime,
      };

      console.log("Sending payload:", payload);

      const response = await fetch(`/api/interviews/${interview.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (!response.ok) {
        throw new Error("Failed to save interview data");
      }

      router.push(`/interviews/${interview.id}/results`);
    } catch (error) {
      console.error("Error saving interview data:", error);
    }
  };

  const isAnswerValid = (index: number) => {
    return hasRecorded[index] && transcripts[index]?.trim().length > 0;
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Interview Session</h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}{" "}
          <span className="font-mono">({formatTime(elapsedTime)} elapsed)</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsTypingMode(!isTypingMode)}
            title={isTypingMode ? "Switch to speech" : "Switch to typing"}
          >
            <Type className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleMic}>
            {isMicOn ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={toggleVideo}>
            {isVideoOn ? (
              <Video className="size-4" />
            ) : (
              <VideoOff className="size-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-xl">
              Question {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg">{currentQuestion?.aiQuestion}</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg">Webcam</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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

        <Card className="col-span-1">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg">Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {isTypingMode ? (
              <Textarea
                placeholder="Type your answer here..."
                className="min-h-[150px] resize-none"
                value={transcripts[currentQuestionIndex] || ""}
                onChange={(e) => {
                  const newTranscripts = [...transcripts];
                  newTranscripts[currentQuestionIndex] = e.target.value;
                  setTranscripts(newTranscripts);
                  // Mark as recorded when typing
                  setHasRecorded((prev) => {
                    const newHasRecorded = [...prev];
                    newHasRecorded[currentQuestionIndex] = true;
                    return newHasRecorded;
                  });
                }}
              />
            ) : (
              <div className="h-[150px] overflow-y-auto rounded-lg bg-muted/20 p-4">
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
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-between space-x-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="w-[100px]"
        >
          <ChevronLeft className="mr-2 size-4" />
          Previous
        </Button>
        <div className="flex items-center space-x-2">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? "default" : "outline"}
              className="size-8 p-0"
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={handleNext}
          className="w-[100px]"
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
  );
}
