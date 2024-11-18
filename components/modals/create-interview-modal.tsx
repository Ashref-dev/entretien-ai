"use client";

import { useState } from "react";
import { InterviewDifficulty } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Info, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { InterviewDifficultyEnum } from "@/lib/validations/interview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FileUpload } from "../ui/file-upload";

// Define the form schema
const formSchema = z.object({
  jobTitle: z.string().min(4, "Job title is required"),
  jobDescription: z.string().min(4, "Job description is required"),
  difficulty: InterviewDifficultyEnum,
  yearsOfExperience: z.string().min(1, "Experience level is required"),
  targetCompany: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateInterviewModalProps {
  onCreateInterview: (data: {
    jobTitle: string;
    jobDescription: string;
    resume: File | null;
    difficulty: InterviewDifficulty;
    yearsOfExperience: string;
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
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      difficulty: "JUNIOR",
      yearsOfExperience: "",
      targetCompany: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!resume) {
      toast.error("Please upload a resume");
      return;
    }

    setIsLoading(true);

    toast.promise(
      (async () => {
        try {
          const formData = new FormData();
          formData.append("pdf", resume);
          formData.append("jobTitle", values.jobTitle);
          formData.append("jobDescription", values.jobDescription);
          formData.append("difficulty", values.difficulty);
          formData.append(
            "yearsOfExperience",
            values.yearsOfExperience.toString(),
          );
          if (values.targetCompany)
            formData.append("targetCompany", values.targetCompany);

          const response = await fetch("/api/interview", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Failed to generate interview questions",
            );
          }

          const result = await response.json();

          if (!result.success) {
            throw new Error(
              result.error || "Failed to generate interview questions",
            );
          }

          onCreateInterview({
            ...values,
            resume,
            skillsAssessed: [],
            interviewData: result.data.interviewData,
          });

          form.reset();
        } catch (error) {
          console.error("Error creating interview:", error);
          setIsLoading(false);
          throw error;
        }
      })(),
      {
        loading: "Creating your interview...",
        success: "Interview created successfully!",
        error: "Failed to create interview",
      },
    );
  };

  const handleFileUpload = async (files: File[]) => {
    const file = files[0] || null;
    if (file) {
      if (!file.type.includes("pdf")) {
        toast.error("Please upload a PDF file");
        return;
      }

      const fourMB = 4.5 * 1024 * 1024;
      if (file.size > fourMB) {
        toast.error("File size must be less than 4MB");
        return;
      }

      try {
        // First check for validity

        setResume(file);
      } catch (error) {
        console.error("Error validating PDF:", error);
        toast.error("Unable to read the PDF file. The file might be corrupted");
        return;
      }
    } else {
      setResume(null);
    }
  };

  return (
    <TooltipProvider>
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
              Using your resume and the job description, we&apos;ll create a
              mock interview to help you practice.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left Column - Main Information */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Frontend Developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Company Name{" "}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="inline size-3.5 cursor-help text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="w-44 text-xs">
                                  We&apos;ll try to tailor questions to the
                                  company if data is available.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Google, Meta, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Seniority Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select seniority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="JUNIOR">Junior</SelectItem>
                                <SelectItem value="MID_LEVEL">
                                  Mid Level
                                </SelectItem>
                                <SelectItem value="SENIOR">Senior</SelectItem>
                                <SelectItem value="LEAD">Lead</SelectItem>
                                <SelectItem value="PRINCIPAL">
                                  Principal
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="yearsOfExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Required Job Experience</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0_1">0-1 year</SelectItem>
                                <SelectItem value="1_3">1-3 years</SelectItem>
                                <SelectItem value="3_5">3-5 years</SelectItem>
                                <SelectItem value="5_7">5-7 years</SelectItem>
                                <SelectItem value="7_plus">7+ years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="jobDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the job description here..."
                              className="min-h-[170px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                {/* Right Column - Resume Upload */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Label className="text-sm font-medium">Upload Resume</Label>
                  <div className="group mt-2 h-[20em] rounded-md border border-dashed lg:h-[calc(100%-2rem)]">
                    <FileUpload onChange={handleFileUpload} />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
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
          </Form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
