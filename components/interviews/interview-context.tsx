"use client";
import { createContext, useContext, useState } from "react";
import { InterviewStep, Interview } from "@/types";

type InterviewContextType = {
  currentStep: InterviewStep;
  setCurrentStep: (step: InterviewStep) => void;
  interviewData: Interview | null;
  setInterviewData: (data: Interview | null) => void;
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<InterviewStep>("initial");
  const [interviewData, setInterviewData] = useState<Interview | null>(null);

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