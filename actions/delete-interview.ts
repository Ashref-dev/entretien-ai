"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function deleteInterview(interviewId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { error: "Unauthorized" };
    }

    // Verify the interview belongs to the user
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      select: { userId: true }
    });

    if (!interview || interview.userId !== user.id) {
      return { error: "Interview not found or unauthorized" };
    }

    // Delete the interview and all related data
    await prisma.interview.delete({
      where: { id: interviewId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting interview:", error);
    return { error: "Failed to delete interview" };
  }
} 