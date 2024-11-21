"use client";

import { useState } from "react";
import { Interview, InterviewDifficulty } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Info, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { InterviewDifficultyEnum } from "@/lib/validations/interview";
import { Button } from "@/components/ui/button";
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

interface InterviewResponse {
  success: boolean;
  data: {
    interviewData: Interview["interviewData"];
  };
  error?: string;
}

type FormValues = z.infer<typeof formSchema>;

interface CreateInterviewFormProps {
  onSubmitInterview: (data: {
    jobTitle: string;
    jobDescription: string;
    resume: File | null;
    difficulty: InterviewDifficulty;
    yearsOfExperience: string;
    skillsAssessed: string[];
    targetCompany?: string;
    interviewData: Interview["interviewData"];
  }) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function CreateInterviewForm({
  onSubmitInterview,
  isLoading,
  setIsLoading,
}: CreateInterviewFormProps) {
  const [resume, setResume] = useState<File | null>(null);

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

    try {
      const formData = new FormData();
      formData.append("pdf", resume);
      formData.append("jobTitle", values.jobTitle);
      formData.append("jobDescription", values.jobDescription);
      formData.append("difficulty", values.difficulty);
      formData.append("yearsOfExperience", values.yearsOfExperience.toString());
      if (values.targetCompany)
        formData.append("targetCompany", values.targetCompany);

      const response = await fetch("/api/interview", {
        method: "POST",
        body: formData,
      });

      const initialResult = await response.json();

      if (!initialResult.success) {
        throw new Error(initialResult.error || "Failed to create interview");
      }

      // Start polling for status
      const pollInterval = 2000; // 2 seconds
      const pollTimeout = 180000; // 3 minutes
      const startTime = Date.now();

      const checkStatus = async (): Promise<any> => {
        const statusResponse = await fetch(
          `/api/interview?id=${initialResult.interviewId}`,
        );
        const result = await statusResponse.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to check interview status");
        }

        switch (result.status) {
          case "COMPLETED":
            return result.data;
          case "ERROR":
            throw new Error(result.error || "Interview processing failed");
          case "PROCESSING":
            if (Date.now() - startTime > pollTimeout) {
              throw new Error("Interview processing timed out");
            }
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            return checkStatus();
          default:
            throw new Error("Unknown interview status");
        }
      };

      const finalResult = await checkStatus();

      onSubmitInterview({
        ...values,
        resume,
        skillsAssessed: [],
        interviewData: finalResult.interviewData,
      });

      form.reset();
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create interview",
      );
      setIsLoading(false);
    }
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

      setResume(file);
    } else {
      setResume(null);
    }
  };

  return (
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
                      <Input placeholder="e.g. Frontend Developer" {...field} />
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
                            We&apos;ll try to tailor questions to the company if
                            data is available.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google, Meta, etc." {...field} />
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
                          <SelectItem value="MID_LEVEL">Mid Level</SelectItem>
                          <SelectItem value="SENIOR">Senior</SelectItem>
                          <SelectItem value="LEAD">Lead</SelectItem>
                          <SelectItem value="PRINCIPAL">Principal</SelectItem>
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
  );
}
