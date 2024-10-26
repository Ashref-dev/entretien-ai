"use client";

import { useState } from "react";
import { Interview } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface InterviewResultsProps {
  interview: Interview & { interviewData: any[] };
}

export default function InterviewResults({ interview }: InterviewResultsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const score = interview.interviewScore || 0;

  const handleNext = () => {
    if (currentQuestionIndex < interview.interviewData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h1 className="text-center text-3xl font-bold">Interview Results</h1>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardTitle className="text-2xl">
            {interview.jobTitle} Interview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-lg font-semibold">Overall Score</div>
            <div className="flex items-center">
              <Progress value={score} className="mr-4 w-64" />
              <span className="text-2xl font-bold">{score.toFixed(1)}%</span>
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of{" "}
            {interview.interviewData.length}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Question</CardTitle>
                </CardHeader>
                <CardContent>
                  {interview.interviewData[currentQuestionIndex].aiQuestion}
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      Your Answer <X className="ml-2 text-red-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {interview.interviewData[currentQuestionIndex].userAnswer ||
                      "No answer provided"}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      AI Answer <Check className="ml-2 text-green-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {interview.interviewData[currentQuestionIndex].aiAnswer}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                currentQuestionIndex === interview.interviewData.length - 1
              }
              variant="outline"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
