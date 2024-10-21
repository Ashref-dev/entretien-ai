"use client";;
import { useState } from "react";

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
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateInterview({ jobTitle, jobDescription, resume });
    onOpenChange(false);
    // Reset form fields
    setJobTitle("");
    setJobDescription("");
    setResume(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create New Interview</DialogTitle>
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
              <Label htmlFor="resume hidden">Upload Resume</Label>
              <div className="min-h-[300px] w-full rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Create Interview
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
