"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
export async function saveInterviewData(interviewData: any) {
  const user = await getCurrentUser();
  try {
    const savedInterview = await prisma.interview.create({

      data: {
        jobTitle: interviewData.jobTitle,
        jobDescription: interviewData.jobDescription,
        interviewScore: interviewData.interviewScore || 0,
        user: {
          connect: {
            id: user?.id
          }
        },
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
