import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { callAIWithPrompt } from "@/lib/llm";
import { getCurrentUser } from "@/lib/session";

async function scoreMe(
  question: string,
  aiAnswer: string,
  userAnswer: string,
): Promise<number> {
  console.log("question", question);
  console.log("aiAnswer", aiAnswer);
  console.log("userAnswer", userAnswer);

  if (!userAnswer) {
    return 0;
  }

  const prompt = `
    You are an expert technical interviewer.
    You are given a question, the expected answer, and the user's answer.
    Score the user's answer based on how well it matches the expected answer.
    If there is no user answer, return the score as 0.
    Question: ${question}
    Expected Answer: ${aiAnswer}
    User's Answer: ${userAnswer}

    Return only one number between 0 and 100.
    DON'T ANSWER WITH ANYTHING BUT THAT ONE NUMBER.
  `;
  const response = await callAIWithPrompt(prompt);
  console.log("ai response", response);

  return parseInt(response) || 0;
}

async function generateFeedback(
  question: string,
  aiAnswer: string,
  userAnswer: string,
): Promise<string> {
  if (!userAnswer) {
    return "No answer provided to give feedback on.";
  }

  const prompt = `
    You are an expert technical interviewer.
    Analyze the following technical interview response and provide constructive feedback.
    
    Question: ${question}
    Expected Answer: ${aiAnswer}
    User's Answer: ${userAnswer}

    Provide concise, constructive feedback that:
    1. Highlights what was done well
    2. Points out any missing key points
    3. Suggests areas for improvement
    
    Return only the feedback text, no additional formatting or labels.
  `;

  const response = await callAIWithPrompt(prompt);
  return response.toString();
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
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Calculate scores and generate feedback for each question
    const processedData = await Promise.all(
      interviewData.map(async (item) => {
        const score = await scoreMe(
          item.aiQuestion,
          item.aiAnswer,
          item.userAnswer,
        );
        const feedback = await generateFeedback(
          item.aiQuestion,
          item.aiAnswer,
          item.userAnswer,
        );
        return {
          ...item,
          score,
          feedback,
        };
      }),
    );

    // Calculate overall interview score
    const interviewScore =
      processedData.reduce((acc, curr) => acc + curr.score, 0) / processedData.length;

    // Update the interview and its data
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        interviewScore,
        interviewData: {
          deleteMany: {}, // Delete existing interview data
          create: processedData.map((item) => ({
            aiQuestion: item.aiQuestion,
            aiAnswer: item.aiAnswer,
            userAnswer: item.userAnswer,
            questionFeedback: item.feedback,
            questionsScore: item.score,
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
