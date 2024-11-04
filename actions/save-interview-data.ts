"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import {
  SaveInterviewInput,
  SaveInterviewSchema,
} from "@/lib/validations/interview";

export async function saveInterviewData(interviewData: SaveInterviewInput) {
  const user = await getCurrentUser();

  try {
    // Validate the input data
    const validatedData = SaveInterviewSchema.parse(interviewData);

    const savedInterview = await prisma.interview.create({
      data: {
        resume: validatedData.resume.name,
        jobTitle: validatedData.jobTitle,
        jobDescription: validatedData.jobDescription,
        difficulty: validatedData.difficulty,
        yearsOfExperience: validatedData.yearsOfExperience,
        skillsAssessed: validatedData.skillsAssessed,
        targetCompany: validatedData.targetCompany,
        interviewScore: validatedData.interviewScore,
        technicalScore: 0,
        communicationScore: 0,
        problemSolvingScore: 0,
        questionsAnswered: validatedData.interviewData.length,
        duration: validatedData.duration,
        overAllFeedback: "",

        user: {
          connect: {
            id: user?.id,
          },
        },
        interviewData: {
          create: validatedData.interviewData.map((item) => ({
            aiQuestion: item.aiQuestion,
            aiAnswer: item.aiAnswer,
            userAnswer: item.userAnswer || "",
            questionFeedback: item.questionFeedback || "",
            questionsScore: item.questionsScore || 0,
          })),
        },
      },
      include: {
        interviewData: true,
      },
    });

    return { success: true, id: savedInterview.id };
  } catch (error) {
    console.error("Error saving interview data:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save interview data",
    };
  }
}
