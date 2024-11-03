"use client";

import { useState } from "react";
import { InterviewDifficulty } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { FileUpload } from "../ui/file-upload";

interface CreateInterviewModalProps {
  onCreateInterview: (data: {
    jobTitle: string;
    jobDescription: string;
    resume: File | null;
    difficulty: InterviewDifficulty;
    yearsOfExperience: number;
    skillsAssessed: string[];
    targetCompany?: string;
    interviewData: any;
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
  const [difficulty, setDifficulty] =
    useState<InterviewDifficulty>("MID_LEVEL");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [targetCompany, setTargetCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!resume) {
      toast.error("Please upload a resume");
      setIsLoading(false);
      return;
    }

    // Create a promise that wraps our existing logic
    toast.promise(
      (async () => {
        try {
          const formData = new FormData();
          formData.append("pdf", resume);
          formData.append("jobTitle", jobTitle);
          formData.append("jobDescription", jobDescription);
          formData.append("difficulty", difficulty);
          formData.append("yearsOfExperience", yearsOfExperience.toString());

          const response = await fetch("/api/ai", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Set interview data and move to next step
          onCreateInterview({
            jobTitle,
            jobDescription,
            resume,
            difficulty,
            yearsOfExperience,
            skillsAssessed: [],
            targetCompany,
            interviewData: data.interviewData,
          });

          // Close modal
          onOpenChange(false);
        } catch (error) {
          console.error("Error creating interview:", error);
          setIsLoading(false);
          throw error; // Re-throw to let toast handle the error state
        }
      })(),
      {
        loading: "Creating your interview...",
        success: "Interview created successfully!",
        error: "Failed to create interview",
      },
    );
  };

  const handleFileUpload = (files: File[]) => {
    const file = files[0] || null;
    if (file) {
      if (!file.type.includes("pdf")) {
        toast.error("Please upload a PDF file");
        return;
      }

      const fiveMB = 5 * 1024 * 1024;
      if (file.size > fiveMB) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setResume(file);
    } else {
      setResume(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        isGlowing={!isLoading}
        className="fade-up max-h-[90vh] overflow-y-auto duration-300 animate-in fade-in-0 sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px]"
      >
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Create New Interview
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Using your resume and job description, we&apos;ll craft the perfect
            interview answers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column - Main Information */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-sm font-medium">
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="targetCompany"
                    className="text-sm font-medium"
                  >
                    Target Company (Optional)
                  </Label>
                  <Input
                    id="targetCompany"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. Google, Meta, etc."
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-sm font-medium">
                      Difficulty Level
                    </Label>
                    <Select
                      value={difficulty}
                      onValueChange={(value: InterviewDifficulty) =>
                        setDifficulty(value)
                      }
                    >
                      <SelectTrigger className="transition-all duration-200 focus:ring-2">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JUNIOR">Junior</SelectItem>
                        <SelectItem value="MID_LEVEL">Mid Level</SelectItem>
                        <SelectItem value="SENIOR">Senior</SelectItem>
                        <SelectItem value="LEAD">Lead</SelectItem>
                        <SelectItem value="PRINCIPAL">Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="yearsOfExperience"
                      className="text-sm font-medium"
                    >
                      Years of Experience
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      max="30"
                      value={yearsOfExperience}
                      onChange={(e) =>
                        setYearsOfExperience(parseInt(e.target.value))
                      }
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="jobDescription"
                    className="text-sm font-medium"
                  >
                    Job Description
                  </Label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Enter the job description here..."
                    className="min-h-[200px] resize-none transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Column - Resume Upload */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label htmlFor="resume" className="text-sm font-medium">
                Upload Resume
              </Label>
              <div className="group h-[calc(100%-2rem)] rounded-md border border-dashed border-neutral-200 bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:border-neutral-800 dark:bg-black">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className=""
          >
            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-[1.01]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader className="size-4 animate-spin" />
                  <span>Creating Interview...</span>
                </div>
              ) : (
                "Create Interview"
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
