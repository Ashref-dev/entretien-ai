"use server";

import { Interview } from "@/types";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function saveInterviewData(interviewData: Interview) {
  const user = await getCurrentUser();

  try {
    // TODO: Validate the input data
    // const validatedData = SaveInterviewSchema.parse(interviewData);
    const validatedData = interviewData;

    const savedInterview = await prisma.interview.update({
      where: {
        id: validatedData.id,
      },
      data: {
        resume: validatedData.resume ? (validatedData.resume as File).name : "",
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
