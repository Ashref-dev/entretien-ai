"use client";
import { useInterview } from "./interview-context";
import CreateInterview from "./create-interview";
import ProcessingView from "./processing-view";
import ResultsView from "./results-view";

export function InterviewContainer() {
  const { currentStep } = useInterview();

  return (
    <div className="rounded-lg border border-dashed p-8 shadow-sm animate-in fade-in-50">
      {currentStep === "initial" && <CreateInterview />}
      {currentStep === "processing" && <ProcessingView />}
      {currentStep === "results" && <ResultsView />}
    </div>
  );
}