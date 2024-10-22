"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Mic, MicOff, Video, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInterview } from "./interview-context"

type InterviewQuestion = {
  id: string
  interviewId: string
  aiQuestion: string
  aiAnswer: string
  userAnswer: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: (event: SpeechRecognitionEvent) => void
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function InterviewPage() {
  const { interviewData } = useInterview()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [transcripts, setTranscripts] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const questions: InterviewQuestion[] = interviewData?.apiResponse?.interviewData || []
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (videoRef.current && isVideoOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch(err => console.error("Error accessing webcam:", err))
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' '
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        setTranscripts(prev => {
          const newTranscripts = [...prev]
          newTranscripts[currentQuestionIndex] = (newTranscripts[currentQuestionIndex] || '') + finalTranscript + interimTranscript
          return newTranscripts
        })
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isVideoOn, currentQuestionIndex])

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      if (isRecording) {
        toggleRecording()
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      if (isRecording) {
        toggleRecording()
      }
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
    if (recognitionRef.current) {
      if (isMicOn) {
        recognitionRef.current.stop()
      } else if (isRecording) {
        recognitionRef.current.start()
      }
    }
  }

  const toggleVideo = () => setIsVideoOn(!isVideoOn)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Interview Session</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={toggleMic}>
            {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={toggleVideo}>
            {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
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
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {isVideoOn ? (
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
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
          <CardContent className="p-6 space-y-4">
            <div className="h-[150px] overflow-y-auto bg-muted/20 p-4 rounded-lg">
              {transcripts[currentQuestionIndex] || "Your speech will appear here as you speak..."}
            </div>
            <Button 
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "default"}
              className="w-full"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="w-[100px]"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center space-x-2">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          className="w-[100px]"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}