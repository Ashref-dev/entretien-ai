"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveInterviewData } from "@/actions/save-interview-data";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useInterview } from "./interview-context";

export default function ResultsView() {
  const { interviewData } = useInterview();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSaveInterviewData = async () => {
    if (!interviewData) return;

    setIsLoading(true);
    try {
      const result = await saveInterviewData(interviewData);

      if (result.success) {
        toast.success("Interview data saved successfully");
        router.push(`/interviews/${result.id}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving interview data:", error);
      toast.error("Failed to save interview data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!interviewData) {
    return <div>No interview data available.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Interview Results</h2>
      <div>
        <h3 className="text-xl font-semibold">Job Title</h3>
        <p>{interviewData.jobTitle}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Job Description</h3>
        <p>{interviewData.jobDescription}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Interview Score</h3>
        <p>{interviewData.interviewScore || "Not available"}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">
          Interview Questions and Answers
        </h3>
        {interviewData.interviewData.map((item, index) => (
          <div key={index} className="mb-4">
            <p>
              <strong>Question:</strong> {item.aiQuestion}
            </p>
            <p>
              <strong>Your Answer:</strong> {item.userAnswer}
            </p>
            <p>
              <strong>AI Answer:</strong> {item.aiAnswer}
            </p>
          </div>
        ))}
      </div>
      <Button onClick={handleSaveInterviewData} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Interview Data"}
      </Button>
    </div>
  );
}
