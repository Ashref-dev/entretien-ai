"use client";
import { createContext, useContext, useState } from "react";
import { InterviewStep, InterviewData } from "@/types";

type InterviewContextType = {
  currentStep: InterviewStep;
  setCurrentStep: (step: InterviewStep) => void;
  interviewData: InterviewData | null;
  setInterviewData: (data: InterviewData | null) => void;
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<InterviewStep>("initial");
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  return (
    <InterviewContext.Provider
      value={{ currentStep, setCurrentStep, interviewData, setInterviewData }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}