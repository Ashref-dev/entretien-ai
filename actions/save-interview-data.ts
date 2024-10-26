"use server";

import { prisma } from "@/lib/db";

export async function saveInterviewData(interviewData: any) {
  try {
    const savedInterview = await prisma.interview.create({
      data: {
        jobTitle: interviewData.jobTitle,
        jobDescription: interviewData.jobDescription,
        interviewScore: interviewData.interviewScore,
        interviewData: {
          create: interviewData.interviewData.map((item: any) => ({
            aiQuestion: item.aiQuestion,
            aiAnswer: item.aiAnswer,
            userAnswer: item.userAnswer,
          })),
        },
      },
    });

    return { success: true, id: savedInterview.id };
  } catch (error) {
    console.error("Error saving interview data:", error);
    return { success: false, error: "Failed to save interview data" };
  }
}
