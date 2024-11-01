"use client";

import { useState } from "react";
import { InterviewDifficulty } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "../ui/file-upload";
import { toast } from "sonner";

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
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("MID_LEVEL");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [skillInput, setSkillInput] = useState("");
  const [skillsAssessed, setSkillsAssessed] = useState<string[]>([]);
  const [targetCompany, setTargetCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => {
    if (skillInput.trim()) {
      if (!skillsAssessed.includes(skillInput.trim())) {
        setSkillsAssessed([...skillsAssessed, skillInput.trim()]);
      }
      setSkillInput(""); // Clear input after adding
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      addSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsAssessed(skillsAssessed.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!resume) {
      toast.error("Please upload a resume");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("pdf", resume);
      formData.append("jobTitle", jobTitle);
      formData.append("jobDescription", jobDescription);
      formData.append("difficulty", difficulty);
      formData.append("yearsOfExperience", yearsOfExperience.toString());
      formData.append("skillsAssessed", JSON.stringify(skillsAssessed || []));
      if (targetCompany) formData.append("targetCompany", targetCompany);

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
        skillsAssessed: skillsAssessed || [],
        targetCompany,
        interviewData: data.interviewData,
      });

      // Close modal
      onOpenChange(false);
      
      toast.success("Interview questions generated successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to generate interview questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File | null) => {
    if (file) {
      // Validate file type
      if (!file.type.includes('pdf')) {
        toast.error('Please upload a PDF file');
        return;
      }
      
      // Validate file size (5MB)
      const fiveMB = 5 * 1024 * 1024;
      if (file.size > fiveMB) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setResume(file);
    } else {
      setResume(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create New Interview</DialogTitle>
          <DialogDescription>
            Using your resume and job description, we'll craft the perfect
            interview answers.
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
                <Label htmlFor="targetCompany">Target Company (Optional)</Label>
                <Input
                  id="targetCompany"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, Meta, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={difficulty}
                    onValueChange={(value: InterviewDifficulty) =>
                      setDifficulty(value)
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    max="30"
                    value={yearsOfExperience}
                    onChange={(e) =>
                      setYearsOfExperience(parseInt(e.target.value))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillsAssessed">Skills to Assess</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="skillsAssessed"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="Type a skill and press Enter or Add"
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      onClick={addSkill}
                      variant="secondary"
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsAssessed.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 rounded-full hover:bg-muted"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {skillsAssessed.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add skills using Enter key or Add button
                    </p>
                  )}
                </div>
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
              <Label htmlFor="resume">Upload Resume</Label>
              <div className="min-h-[300px] w-full rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
                <FileUpload 
                  onChange={handleFileUpload} 
                  value={resume}
                />
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
