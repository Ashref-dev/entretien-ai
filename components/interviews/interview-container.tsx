"use client";

import { Skeleton } from "@/components/ui/skeleton";

import CreateInterview from "./create/create-interview";
import { useInterview } from "./interview-context";
import ProcessingView from "./process/processing-view";

export function InterviewContainer() {
  const { currentStep } = useInterview();

  // Loading state
  if (!currentStep) {
    return (
      <div className="rounded-lg border border-dashed p-8 shadow-sm animate-in fade-in-50">
        <Skeleton className="mb-4 h-10 w-full" />
        <Skeleton className="mb-4 h-6 w-3/4" />
        <Skeleton className="mb-4 h-6 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed p-8 shadow-sm animate-in fade-in-50">
      {currentStep === "initial" && <CreateInterview />}
      {currentStep === "processing" && <ProcessingView />}
    </div>
  );
}
