import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { callAIWithPrompt } from "@/lib/llm";
import { getCurrentUser } from "@/lib/session";

async function evaluateAnswer(
  question: string,
  aiAnswer: string,
  userAnswer: string,
): Promise<{ score: number; feedback: string }> {
  if (!userAnswer) {
    return { score: 0, feedback: "No answer provided to give feedback on." };
  }

  const prompt = `
    You are an expert technical interviewer.
    Analyze the following technical interview response and provide both a score and feedback.
    If the user's answer is exactly the same or close as the expected answer, give a score of 100.
    If the user just repeats the question as an answer, give a score of 0.
    
    Question: ${question}
    Expected Answer: ${aiAnswer}
    User's Answer: ${userAnswer}

    Provide your response in the following JSON format only:
    {
      "score": <number between 0 and 100>,
      "feedback": "<constructive feedback that highlights what was done well, points out missing key points, and suggests improvements>"
    }

    Return only the JSON object, no additional text or formatting.
  `;

  const response = await callAIWithPrompt(prompt);
  try {
    const result = JSON.parse(response);
    return {
      score: result.score || 0,
      feedback: result.feedback || "Error processing feedback.",
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { score: 0, feedback: "Error processing response." };
  }
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

    // Calculate scores and generate feedback for each question
    const processedData = await Promise.all(
      interviewData.map(async (item) => {
        const evaluation = await evaluateAnswer(
          item.aiQuestion,
          item.aiAnswer,
          item.userAnswer,
        );
        return {
          ...item,
          score: evaluation.score,
          feedback: evaluation.feedback,
        };
      }),
    );

    // Calculate overall interview score
    const interviewScore =
      processedData.reduce((acc, curr) => acc + curr.score, 0) /
      processedData.length;

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
