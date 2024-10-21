"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useInterview } from "./interview-context";

type InterviewQuestion = {
  id: string;
  interviewId: string;
  aiQuestion: string;
  aiAnswer: string;
  userAnswer: string;
};

export default function ResultsView() {
  const { interviewData } = useInterview();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (!interviewData?.apiResponse?.interviewData) {
    return null;
  }

  const questions: InterviewQuestion[] =
    interviewData.apiResponse.interviewData;
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Interview Questions</h2>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-xl">
            Question {currentQuestionIndex + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-primary">Question:</h3>
              <p className="text-lg">{currentQuestion.aiQuestion}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-primary">
                Sample Answer:
              </h3>
              <p className="rounded-lg bg-muted/50 p-4 text-sm">
                {currentQuestion.aiAnswer}
              </p>
            </div>

            {currentQuestion.userAnswer && (
              <div>
                <h3 className="mb-2 font-semibold text-primary">
                  Your Answer:
                </h3>
                <p className="rounded-lg bg-muted/50 p-4 text-sm">
                  {currentQuestion.userAnswer}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between space-x-4">
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
          disabled={currentQuestionIndex === questions.length - 1}
          className="w-[100px]"
        >
          Next
          <ChevronRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
