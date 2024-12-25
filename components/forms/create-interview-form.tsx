"use client";

import { useState } from "react";
import { Interview, InterviewDifficulty } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Info, Languages, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SUPPORTED_LANGUAGES } from "@/config/site";
import { cn } from "@/lib/utils";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  language: z.enum(["EN", "FR", "ES", "DE", "AR"] as const).default("EN"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateInterviewFormProps {
  onSubmitInterview: (data: {
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
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function CreateInterviewForm({
  onSubmitInterview,
  isLoading,
  setIsLoading,
}: CreateInterviewFormProps) {
  const [resume, setResume] = useState<File | null>(null);
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      difficulty: "JUNIOR",
      yearsOfExperience: "",
      targetCompany: "",
      language: "EN",
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
      formData.append("language", values.language);

      const response = await fetch("/api/interview", {
        method: "POST",
        body: formData,
      });

      const initialResult = await response.json();

      if (!initialResult.success) {
        throw new Error(initialResult.error || "Failed to create interview");
      }

      // Start polling for status
      const pollInterval = 1000; // 1 second
      const pollTimeout = 120000; // 120 seconds

      const checkStatus = async (): Promise<Interview> => {
        const pollStartTime = Date.now();

        const poll = async (): Promise<Interview> => {
          try {
            const statusResponse = await fetch(
              `/api/interview?id=${initialResult.interviewId}`,
            );
            const result = await statusResponse.json();

            if (!result.success) {
              throw new Error(
                result.error || "Failed to check interview status",
              );
            }

            switch (result.status) {
              case "COMPLETED":
                return result.data;
              case "ERROR":
                console.error(
                  "[Poll] Interview processing failed:",
                  result.error,
                );
                throw new Error(result.error || "Interview processing failed");
              case "PROCESSING":
                if (Date.now() - pollStartTime > pollTimeout) {
                  console.error("[Poll] Interview processing timed out");
                  await fetch(
                    `/api/interview/cleanup?id=${initialResult.interviewId}`,
                    {
                      method: "DELETE",
                    },
                  );
                  throw new Error("Interview processing timed out");
                }
                await new Promise((resolve) =>
                  setTimeout(resolve, pollInterval),
                );
                return poll();
              default:
                throw new Error("Unknown interview status");
            }
          } catch (error) {
            console.error("[Poll] Error during status check:", error);
            throw error;
          }
        };

        return poll();
      };

      const finalResult: Interview = await checkStatus();

      onSubmitInterview({
        ...values,
        resume,
        skillsAssessed: [],
        interviewData: finalResult.interviewData,
        id: finalResult.id,
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
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                  name="language"
                  render={({ field }) => (
                    <FormItem className="ml-2 flex flex-col gap-[0.6em]">
                      <FormLabel>Language</FormLabel>
                      <Sheet
                        open={isLanguageSheetOpen}
                        onOpenChange={setIsLanguageSheetOpen}
                      >
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-[120px] gap-2"
                          >
                            <Languages className="size-4" />
                            <span className="text-lg">
                              {
                                SUPPORTED_LANGUAGES[
                                  field.value as keyof typeof SUPPORTED_LANGUAGES
                                ].flag
                              }
                            </span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="">
                          <SheetHeader>
                            <SheetTitle>Select Interview Language</SheetTitle>
                            <SheetDescription>
                              Choose the language for your interview questions,
                              responses and feedback.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                            {Object.entries(SUPPORTED_LANGUAGES).map(
                              ([code, { name, flag, greeting }]) => (
                                <div
                                  key={code}
                                  onClick={() => {
                                    field.onChange(code);
                                    setIsLanguageSheetOpen(false);
                                  }}
                                  className={cn(
                                    "relative cursor-pointer rounded-lg border p-4 transition-all hover:bg-accent",
                                    "flex flex-col items-center justify-center gap-2",
                                    field.value === code &&
                                      "border-primary bg-primary/5",
                                    "group hover:shadow-sm",
                                  )}
                                >
                                  <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-3xl transition-transform group-hover:scale-110">
                                      {flag}
                                    </span>
                                    <span className="font-medium tracking-tight">
                                      {name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {greeting}
                                    </span>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </FormItem>
                  )}
                />
              </div>

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
                      <FormLabel>Required Experience</FormLabel>
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
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Upload Resume</Label>
            </div>
            <div className="group mt-[0.65em] h-[20em] rounded-md border border-dashed lg:h-[calc(100%-2rem)]">
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
