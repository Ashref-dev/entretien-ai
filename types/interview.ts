export type InterviewDifficulty = "JUNIOR" | "MID_LEVEL" | "SENIOR" | "LEAD" | "PRINCIPAL";

export interface InterviewRequestBody {
  interviewData: Array<{
    aiQuestion: string;
    aiAnswer: string;
    userAnswer: string;
  }>;
  difficulty: InterviewDifficulty;
  yearsOfExperience: number;
} 