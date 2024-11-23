"use client";

import { useState } from "react";
import { Interview, InterviewDifficulty } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CreateInterviewForm } from "../forms/create-interview-form";

interface CreateInterviewModalProps {
  onCreateInterview: (data: {
    id: string;
    jobTitle: string;
    jobDescription: string;
    resume: File | null;
    difficulty: InterviewDifficulty;
    yearsOfExperience: string;
    skillsAssessed: string[];
    targetCompany?: string;
    interviewData: Interview["interviewData"];
  }) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInterviewModal({
  onCreateInterview,
  open,
  onOpenChange,
}: CreateInterviewModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        isGlowing={isLoading}
        className="fade-up max-h-[90vh] overflow-y-auto rounded-lg duration-300 animate-in fade-in-0 sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px]"
      >
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Create New Interview
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Using your resume and the job description, we&apos;ll create a mock
            interview to help you practice.
          </DialogDescription>
        </DialogHeader>

        <CreateInterviewForm
          onSubmitInterview={onCreateInterview}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
