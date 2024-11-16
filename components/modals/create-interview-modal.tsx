"use client";

import { useState } from "react";
import { generateInterviewQuestions } from "@/actions/ai-interview-generate";
import { InterviewDifficulty } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
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

import { FileUpload } from "../ui/file-upload";

// Define the form schema
const formSchema = z.object({
  jobTitle: z.string().min(4, "Job title is required"),
  jobDescription: z.string().min(4, "Job description is required"),
  difficulty: InterviewDifficultyEnum,
  yearsOfExperience: z.number().min(0).max(30),
  targetCompany: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      difficulty: "MID_LEVEL",
      yearsOfExperience: 1,
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
          const result = await generateInterviewQuestions({
            pdf: resume,
            ...values,
            skillsAssessed: [],
          });

          if (!result.success) {
            throw new Error(result.error);
          }

          onCreateInterview({
            ...values,
            resume,
            skillsAssessed: [],
            interviewData: result.data!.interviewData,
          });

          onOpenChange(false);
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
            Using your resume and job description, we&apos;ll craft the perfect
            interview answers.
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
                        <FormLabel>Target Company (Optional)</FormLabel>
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
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
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
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="30"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
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
                            className="min-h-[200px]"
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
                <div className="group h-[20em] rounded-md border border-dashed lg:h-[calc(100%-2rem)]">
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
  );
}
