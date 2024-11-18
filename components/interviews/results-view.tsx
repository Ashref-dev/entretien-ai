"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveInterviewData } from "@/actions/save-interview-data";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useInterview } from "./interview-context";

export default function ResultsView() {
  const { interviewData } = useInterview();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    handleSaveInterviewData();
  }, []);

  const handleSaveInterviewData = async () => {
    setError(null);
    if (!interviewData) {
      setError("No interview data available");
      return;
    }
    if (!interviewData.difficulty) {
      setError("Interview difficulty is required");
      return;
    }

    try {
      const result = await saveInterviewData(interviewData);

      if (result.success) {
        toast.success("Interview data saved successfully");
        router.push(`/interviews/${result.id}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Error saving interview data:", error);
      setError(errorMessage);
      toast.error("Failed to save interview data. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 p-4 text-center">
        <p className="text-lg text-destructive">
          An error has occurred, please try again. If the error persists, please
          contact support.
        </p>
        <Button onClick={() => router.push("/interviews")}>
          Return to Interviews
        </Button>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="p-4 text-center text-gray-500">
        No interview data available. Please start a new interview.
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Skeleton className="mx-auto mb-6 h-9 w-[250px]" /> {/* Title */}
      {/* Header with controls */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-[200px]" /> {/* Question counter */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="size-9" /> /* Control buttons */
          ))}
        </div>
      </div>
      {/* Question Card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-[60px] w-full" />
          </CardContent>
        </Card>

        {/* Webcam Card */}
        <Card className="col-span-1">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-6 w-[100px]" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <Skeleton className="size-full" />
            </div>
          </CardContent>
        </Card>

        {/* Answer Card */}
        <Card className="col-span-1">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-6 w-[120px]" />
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
      {/* Navigation Controls */}
      <div className="mt-6 flex justify-between space-x-4">
        <Skeleton className="h-10 w-[100px]" /> {/* Previous button */}
        <div className="flex items-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="size-8"
            /> /* Question number buttons */
          ))}
        </div>
        <Skeleton className="h-10 w-[100px]" /> {/* Next button */}
      </div>
    </div>
  );
}
