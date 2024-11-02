"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function saveInterviewData(interviewData: any) {
  const user = await getCurrentUser();
  try {
    const savedInterview = await prisma.interview.create({
      data: {
        resume: interviewData.resume.name,
        jobTitle: interviewData.jobTitle,
        jobDescription: interviewData.jobDescription,
        difficulty: interviewData.difficulty,
        yearsOfExperience: interviewData.yearsOfExperience,
        skillsAssessed: interviewData.skillsAssessed,
        targetCompany: interviewData.targetCompany || null,
        interviewScore: interviewData.interviewScore || 0,
        technicalScore: 0,
        communicationScore: 0,
        problemSolvingScore: 0,
        questionsAnswered: interviewData.interviewData.length,
        duration: interviewData.duration,
        overAllFeedback: "",

        user: {
          connect: {
            id: user?.id
          }
        },
        interviewData: {
          create: interviewData.interviewData.map((item: any) => ({
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
    return { success: false, error: "Failed to save interview data" };
  }
}
