import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { callAIWithPrompt } from "@/lib/llm";
import { getCurrentUser } from "@/lib/session";

async function scoreMe(question: string, aiAnswer: string, userAnswer: string) {
  const prompt = `
    You are an expert technical interviewer.
    You are given a question, the expected answer, and the user's answer.
    Score the user's answer based on how well it matches the expected answer.
    Question: ${question}
    Expected Answer: ${aiAnswer}
    User's Answer: ${userAnswer}

    Return only one number between 0 and 100.
    DON'T ANSWER WITH ANYTHING BUT THAT ONE NUMBER.
  `;
  const response = await callAIWithPrompt(prompt);
  console.log("ai response", response);

  return response;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { interviewId: string } },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interviewId } = params;
    const { interviewData } = await req.json();

    if (!interviewData || !Array.isArray(interviewData)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Fetch the existing interview
    const existingInterview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { interviewData: true },
    });

    if (!existingInterview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    // Calculate the interview score
    const totalQuestions = interviewData.length;

    const scores = await Promise.all(
      interviewData.map(async (item) => {
        const score = await scoreMe(
          item.aiQuestion,
          item.aiAnswer,
          item.userAnswer,
        );
        return score;
      }),
    );

    const interviewScore =
      scores.reduce((acc, curr) => acc + curr, 0) / scores.length;

    // Update the interview and its data
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        interviewScore,
        interviewData: {
          deleteMany: {}, // Delete existing interview data
          create: interviewData.map((item: any) => ({
            aiQuestion: item.aiQuestion,
            aiAnswer: item.aiAnswer,
            userAnswer: item.userAnswer,
          })),
        },
      },
      include: { interviewData: true },
    });

    return NextResponse.json(updatedInterview);
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
