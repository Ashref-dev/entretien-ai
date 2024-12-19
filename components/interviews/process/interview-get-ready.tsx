"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  arrow,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { ChevronRight, Mic, MicOff, Video, VideoOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface InterviewGetReadyProps {
  interviewId: string;
}

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

interface TourStep {
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
}

const tourSteps = [
  {
    title: "Welcome! 👋",
    content: "Let's quickly check your setup before starting the interview.",
    placement: "bottom",
  },
  {
    title: "Camera & Microphone",
    content:
      "Toggle your camera and microphone here. Ensure you're well-lit and your audio is working.",
    placement: "left",
  },
  {
    title: "Test Your Audio",
    content: (
      <span>
        You can toggle the button and speak into the mic to convert your speech
        into text, or type instead.
        <br />
        <span className="text-red-500">
          This feature only works on Google Chrome, Edge or Opera.
        </span>
      </span>
    ),
    placement: "top",
  },
  {
    title: "Ready to Begin",
    content:
      "All set? Click the Start Interview button when you're ready to begin!",
    placement: "top",
  },
];

// Add a helper function to get arrow positioning
function getArrowPosition(placement: string | undefined) {
  switch (placement) {
    case "top":
      return {
        bottom: "-8px",
        left: "50%",
        transform: "translateX(-50%) rotate(45deg)",
      };
    case "bottom":
      return {
        top: "-8px",
        left: "50%",
        transform: "translateX(-50%) rotate(45deg)",
      };
    case "left":
      return {
        right: "-8px",
        top: "50%",
        transform: "translateY(-50%) rotate(45deg)",
      };
    case "right":
      return {
        left: "-8px",
        top: "50%",
        transform: "translateY(-50%) rotate(45deg)",
      };
    default:
      return {
        bottom: "-8px",
        left: "50%",
        transform: "translateX(-50%) rotate(45deg)",
      };
  }
}

// Add a function to get highlight styles for tour targets
function getHighlightStyle(isTarget: boolean) {
  return isTarget
    ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary transition-all duration-200"
    : "";
}

export default function InterviewGetReady({
  interviewId,
}: InterviewGetReadyProps) {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [transcript, setTranscript] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(
    null,
  ) as RefObject<HTMLVideoElement>;
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(true);
  const arrowRef = useRef(null);
  const [isTypingMode, setIsTypingMode] = useState(false);

  // Refs for tour targets
  const welcomeRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLButtonElement>(null);
  const recordTestRef = useRef<HTMLButtonElement>(null);
  const startButtonRef = useRef<HTMLDivElement>(null);

  const currentTargetRef = () => {
    switch (currentTourStep) {
      case 0:
        return welcomeRef;
      case 1:
        return controlsRef;
      case 2:
        return recordTestRef;
      case 3:
        return startButtonRef;
      default:
        return welcomeRef;
    }
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isTourActive,
    onOpenChange: setIsTourActive,
    placement: tourSteps[currentTourStep]?.placement as Placement,
    middleware: [
      offset(16),
      flip({
        fallbackPlacements: ["top", "bottom", "left", "right"],
      }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
    elements: {
      reference: currentTargetRef().current,
    },
  });

  // Update floating element when step changes
  useEffect(() => {
    if (isTourActive) {
      refs.setReference(currentTargetRef().current);
    }
  }, [currentTourStep, isTourActive, refs]);

  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([role]);

  const handleNextStep = () => {
    if (currentTourStep === tourSteps.length - 1) {
      setIsTourActive(false);
    } else {
      setCurrentTourStep(currentTourStep + 1);
    }
  };

  const handleSkipTour = () => {
    setIsTourActive(false);
  };

  // Initialize video stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    if (isVideoOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          currentStream = mediaStream;
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    }

    // Cleanup function
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        const tracks = videoRef.current.srcObject as MediaStream;
        tracks?.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setStream(null);
    };
  }, [isVideoOn]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Disable continuous mode on mobile
      recognitionRef.current.continuous = !isMobile;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        if (isMobile) {
          const result = event.results[0];
          if (result.isFinal) {
            setTranscript((prev) => prev + result[0].transcript + " ");
            // Restart recognition on mobile after each final result
            if (recognitionRef.current && isRecording) {
              recognitionRef.current.stop();
              setTimeout(() => {
                recognitionRef.current?.start();
              }, 100);
            }
          }
        } else {
          // Desktop behavior remains the same
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          if (finalTranscript) {
            setTranscript((prev) => prev + finalTranscript);
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (recognitionRef.current) {
      if (isMicOn) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  const toggleVideo = () => {
    // Stop existing streams before toggling
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject as MediaStream;
      tracks?.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsVideoOn(!isVideoOn);
  };

  const toggleRecording = () => {
    if (!isMicOn) return;

    setIsRecording(!isRecording);
    if (!isRecording) {
      setTranscript("");
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleStart = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    router.push(`/interviews/${interviewId}`);
  };

  const getRecordButtonText = () => {
    if (!isMicOn) return "Enable microphone first";
    return isRecording ? "Stop Test Recording" : "Start Test Recording";
  };

  return (
    <div className="container relative mx-auto space-y-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-[80px]" />
      </div>

      <div
        ref={welcomeRef}
        className={cn(
          "mx-auto w-fit animate-fade-up space-y-1 rounded-md px-2 py-1 text-center opacity-0 [animation-delay:100ms]",
          getHighlightStyle(currentTourStep === 0 && isTourActive),
        )}
      >
        <h1
          className={cn(
            "mx-auto w-fit rounded-md text-4xl font-bold tracking-tight",
          )}
        >
          Get Ready
        </h1>
        <p className="text-lg text-muted-foreground">
          Let&apos;s make sure everything works perfectly for your interview
        </p>
      </div>

      <div className="flex animate-fade-up justify-end opacity-0 [animation-delay:200ms]">
        <ToggleGroup type="multiple" variant="outline">
          <ToggleGroupItem
            ref={controlsRef}
            value="controls"
            aria-label="Toggle controls"
            onClick={toggleMic}
            className={cn(
              "relative",
              getHighlightStyle(currentTourStep === 1 && isTourActive),
            )}
          >
            {isMicOn ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </ToggleGroupItem>
          <ToggleGroupItem
            value="controls"
            aria-label="Toggle controls"
            onClick={toggleVideo}
            className="relative"
          >
            {isVideoOn ? (
              <Video className="size-4" />
            ) : (
              <VideoOff className="size-4" />
            )}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="animate-fade-up overflow-hidden border-2 bg-card/50 opacity-0 backdrop-blur-sm [animation-delay:400ms]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Camera Preview
              <div
                className={cn(
                  "size-2.5 rounded-full transition-all duration-700",
                  isVideoOn
                    ? "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.2)]"
                    : "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.2)]",
                )}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-xl bg-black/90">
              {isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-white/70">
                  Camera Off
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-up border-2 bg-card/50 opacity-0 backdrop-blur-sm [animation-delay:500ms]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Microphone Test
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isTypingMode}
                  onCheckedChange={setIsTypingMode}
                  aria-label="Toggle typing mode"
                />
                <span className="text-xs text-muted-foreground">
                  Typing Mode
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isTypingMode && (
              <Button
                ref={recordTestRef}
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "default"}
                className={cn(
                  "w-full",
                  getHighlightStyle(currentTourStep === 2 && isTourActive),
                )}
                disabled={!isMicOn}
              >
                {getRecordButtonText()}
              </Button>
            )}

            {isTypingMode ? (
              <Textarea
                placeholder="Type your test response here..."
                className="min-h-[150px] resize-none bg-white/5 backdrop-blur-sm"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            ) : (
              <div className="min-h-[150px] rounded-xl border bg-black/5 p-4 text-sm backdrop-blur-sm">
                {transcript || "Your test recording will appear here..."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-up border-2 bg-card/50 opacity-0 backdrop-blur-sm [animation-delay:700ms]">
        <CardContent className="py-8">
          <div
            ref={startButtonRef}
            className={cn(
              "flex flex-col items-center space-y-6 text-center",
              getHighlightStyle(currentTourStep === 3 && isTourActive),
            )}
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to begin your interview?
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Make sure your camera and microphone are working properly. The
              interview will begin immediately after clicking Start.
            </p>
            <MovingBorderButton
              borderRadius="1rem"
              className="border-neutral-200 bg-white font-medium text-black dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              onClick={handleStart}
            >
              Start Interview
              <ChevronRight className="ml-2 size-5" />
            </MovingBorderButton>
          </div>
        </CardContent>
      </Card>

      {isTourActive && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-50 w-80 rounded-lg border bg-card p-4 shadow-lg"
            >
              <div className="space-y-2">
                <h3 className="font-semibold">
                  {tourSteps[currentTourStep].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tourSteps[currentTourStep].content}
                </p>
                <div className="flex justify-between pt-4">
                  <Button variant="ghost" size="sm" onClick={handleSkipTour}>
                    Skip Tour
                  </Button>
                  <Button size="sm" onClick={handleNextStep}>
                    {currentTourStep === 2 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
              <div
                ref={arrowRef}
                className="absolute size-4 bg-border"
                style={{
                  position: "absolute",
                  ...getArrowPosition(tourSteps[currentTourStep]?.placement),
                }}
              />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
