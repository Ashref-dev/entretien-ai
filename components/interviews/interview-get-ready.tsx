"use client";

import { useEffect, useRef, useState } from "react";
import { CameraIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Icons } from "../shared/icons";

interface InterviewGetReadyProps {
  onStart: () => void;
  mediaStream: MediaStream | null;
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

export function InterviewGetReady({ onStart, mediaStream }: InterviewGetReadyProps) {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const initializeDevices = async () => {
      try {
        if (!mediaStream) {
          return;
        }

        const videoTracks = mediaStream.getVideoTracks();
        const audioTracks = mediaStream.getAudioTracks();

        setIsCameraReady(videoTracks.length > 0);
        setIsAudioReady(audioTracks.length > 0);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Only set error if we actually have no tracks after initialization
        if (videoTracks.length === 0 || audioTracks.length === 0) {
          setError("Unable to access camera or microphone. Please ensure you have granted the necessary permissions.");
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Error setting up devices:", err);
        setError("An error occurred while setting up your devices.");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDevices();
  }, [mediaStream]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
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

        setTranscript((prev) => prev.trim() + " " + finalTranscript.trim());
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Let&apos;s Get Ready for Your Interview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isInitializing ? (
          <div className="text-center text-muted-foreground">
            <p>Initializing camera and microphone...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-4">
              <div className="text-center text-muted-foreground">
                <p>
                  Please test your camera and microphone before starting the
                  interview.
                </p>
                <p>Make sure you&apos;re in a quiet, well-lit environment.</p>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <CameraIcon
                    className={
                      isCameraReady ? "text-green-500" : "text-red-500"
                    }
                  />
                  <span>
                    {isCameraReady ? "Camera Ready" : "Camera Not Connected"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.mic
                    className={isAudioReady ? "text-green-500" : "text-red-500"}
                  />
                  <span>
                    {isAudioReady
                      ? "Microphone Ready"
                      : "Microphone Not Connected"}
                  </span>
                </div>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Test Your Microphone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="min-h-[100px] rounded-lg bg-muted/20 p-3 text-sm">
                    {transcript || "Your speech will appear here as you speak..."}
                  </div>
                  <Button
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "default"}
                    className="w-full"
                    disabled={!isAudioReady}
                  >
                    {isRecording ? "Stop Recording" : "Test Microphone"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          size="lg"
          onClick={onStart}
          disabled={!isCameraReady || !isAudioReady || !!error || isInitializing}
        >
          Start Interview
        </Button>
      </CardFooter>
    </Card>
  );
}
