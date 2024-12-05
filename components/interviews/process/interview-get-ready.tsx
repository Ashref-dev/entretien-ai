"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { ChevronRight, Mic, MicOff, Video, VideoOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface InterviewGetReadyProps {
  onReady: () => void;
  initialStream: MediaStream | null;
  videoRef: RefObject<HTMLVideoElement>;
  isVideoOn: boolean;
  setIsVideoOn: (value: boolean) => void;
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

export default function InterviewGetReady({
  onReady,
  initialStream,
  videoRef,
  isVideoOn,
  setIsVideoOn,
  setStream,
}: InterviewGetReadyProps & {
  setStream: (stream: MediaStream | null) => void;
}) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript((prev) => prev + finalTranscript);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (recognitionRef.current) {
      if (isMicOn) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  const toggleRecording = () => {
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
    const container = document.getElementById("get-ready-container");
    if (container) {
      container.classList.remove("opacity-100");
      container.classList.add("opacity-0");
    }
    setTimeout(onReady, 600);
  };

  return (
    <div
      id="get-ready-container"
      className="duration-600 container relative mx-auto space-y-8 p-6 opacity-100 transition-opacity"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-[80px]" />
      </div>

      <div className="animate-fade-up space-y-3 text-center opacity-0 [animation-delay:100ms]">
        <h1 className="text-4xl font-bold tracking-tight">Get Ready</h1>
        <p className="text-lg text-muted-foreground">
          Let&apos;s make sure everything works perfectly for your interview
        </p>
      </div>

      <div className="flex animate-fade-up justify-end opacity-0 [animation-delay:200ms]">
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
              <div
                className={cn(
                  "size-2.5 rounded-full transition-all duration-300",
                  isMicOn
                    ? "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.2)]"
                    : "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.2)]",
                )}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "default"}
              className="w-full"
              disabled={!isMicOn}
            >
              {isRecording ? "Stop Test Recording" : "Start Test Recording"}
            </Button>
            <div className="min-h-[150px] rounded-xl border bg-black/5 p-4 text-sm backdrop-blur-sm">
              {transcript || "Your test recording will appear here..."}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-up border-2 bg-card/50 opacity-0 backdrop-blur-sm [animation-delay:700ms]">
        <CardContent className="py-8">
          <div className="flex flex-col items-center space-y-6 text-center">
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
    </div>
  );
}