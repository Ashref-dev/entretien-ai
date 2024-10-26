"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { useInterview } from "./interview-context";

export default function ProcessingView() {
  const { interviewData, setCurrentStep, setInterviewData } = useInterview();

  useEffect(() => {
    const processInterview = async () => {
      if (!interviewData) return;

      try {
        const formData = new FormData();
        if (interviewData.resume) {
          formData.append("pdf", interviewData.resume);
        }
        formData.append("jobTitle", interviewData.jobTitle);
        formData.append("jobDescription", interviewData.jobDescription);

        const response = await fetch("/api/ai", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const aiGeneratedDataArray = await response.json();
        console.log(
          "🚀 ~ processInterview ~ aiGeneratedDataArray:",
          aiGeneratedDataArray,
        );

        setInterviewData({
          ...interviewData,
          interviewData: aiGeneratedDataArray.interviewData,
        });

        setCurrentStep("results");
      } catch (error) {
        console.error("Error processing interview:", error);
      }
    };

    processInterview();
  }, [interviewData, setCurrentStep, setInterviewData]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center">
      <Loader2 className="mb-4 size-12 animate-spin" />
      <h2 className="text-2xl font-bold">Creating Your Interview...</h2>
      <p className="mt-2 text-muted-foreground">
        Please wait while we process your information
      </p>
    </div>
  );
}
