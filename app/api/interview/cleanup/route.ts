import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get("id");

    if (!interviewId) {
      return NextResponse.json(
        { success: false, error: "Interview ID required" },
        { status: 400 },
      );
    }

    // Find and delete the interview
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      return NextResponse.json(
        { success: false, error: "Interview not found" },
        { status: 404 },
      );
    }

    // Verify the user owns this interview
    if (interview.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    // Delete the interview and all related data
    await prisma.interview.delete({
      where: { id: interviewId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cleaning up interview:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to cleanup interview",
      },
      { status: 500 },
    );
  }
}
