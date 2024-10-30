"use client";

import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { FileUpload } from "../ui/file-upload";

interface CreateInterviewModalProps {
  onCreateInterview: (data: {
    jobTitle: string;
    jobDescription: string;
    resume: File | null;
  }) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInterviewModal({
  onCreateInterview,
  open,
  onOpenChange,
}: CreateInterviewModalProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setResume(files[0]);
    } else {
      setResume(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!resume) {
      alert("Please upload a resume before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("pdf", resume);
      formData.append("jobTitle", jobTitle);
      formData.append("jobDescription", jobDescription);

      // Make API call
      const response = await fetch("/api/ai", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("OpenAI Generated Interview Data:", data);

      // Call the original onCreateInterview callback
      onCreateInterview({ jobTitle, jobDescription, resume });

      // Reset form
      setJobTitle("");
      setJobDescription("");
      setResume(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create New Interview</DialogTitle>
          <DialogDescription className="text-pretty text-xs opacity-70">
            Using your resume and job description, we&apos;ll craft the perfect
            interview answers for the most popular questions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Enter the job description here..."
                  required
                  className="h-[200px]"
                />
              </div>
            </div>
            <div className="mt-4 flex-1 space-y-2 md:mt-0">
              <Label htmlFor="resume" className="hidden">
                Upload Resume
              </Label>
              <div className="min-h-[300px] w-full rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Interview..." : "Create Interview"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
