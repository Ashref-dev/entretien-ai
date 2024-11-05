import { z } from "zod";

export const InterviewDifficultyEnum = z.enum([
  "JUNIOR",
  "MID_LEVEL",
  "SENIOR",
  "LEAD",
  "PRINCIPAL",
]);

const InterviewDataSchema = z.object({
  aiQuestion: z.string().trim().min(1, "Question is required"),
  aiAnswer: z.string().trim().min(1, "Answer is required"),
  userAnswer: z.string().trim().default(""),
  questionFeedback: z.string().trim().optional(),
  questionsScore: z.number().optional(),
});

export const SaveInterviewSchema = z.object({
  resume: z.object({
    name: z.string(),
  }),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  jobDescription: z.string().trim().min(1, "Job description is required"),
  difficulty: InterviewDifficultyEnum,
  yearsOfExperience: z.number().min(0),
  skillsAssessed: z.array(z.string().trim()),
  targetCompany: z.string().nullable(),
  interviewScore: z.number().optional(),
  duration: z.number().optional(),
  interviewData: z.array(InterviewDataSchema),
});

export type SaveInterviewInput = z.infer<typeof SaveInterviewSchema>;
