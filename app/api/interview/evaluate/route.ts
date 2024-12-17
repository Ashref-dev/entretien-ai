import { NextResponse } from "next/server";
import { InterviewDifficulty } from "@/types";

import { prisma } from "@/lib/db";
import { callLLM } from "@/lib/llm";
import { evaluateInterviewPrompt } from "@/lib/prompts";
import { getCurrentUser } from "@/lib/session";

type InterviewRequestBody = {
  interviewData: Array<{
    aiQuestion: string;
    aiAnswer: string;
    userAnswer: string;
  }>;
  difficulty: InterviewDifficulty;
  yearsOfExperience: string;
  duration: number;
  interviewId: string;
};

// First, let's define a clear interface for our evaluation results
interface QuestionEvaluation {
  score: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  feedback: string;
}

interface BatchEvaluationResult {
  evaluations: QuestionEvaluation[];
}

async function evaluateAnswers(
  questions: Array<{
    aiQuestion: string;
    aiAnswer: string;
    userAnswer: string;
  }>,
  difficulty: string,
  yearsOfExperience: number,
  maxRetries = 3,
): Promise<BatchEvaluationResult> {
  // Early return for empty questions
  if (!questions.length) return { evaluations: [] };

  let attempts = 0;

  // prompt is geenratedf fro ma specific template in project config
  const prompt = evaluateInterviewPrompt({
    difficulty,
    yearsOfExperience,
    questions,
  });

  while (attempts < maxRetries) {
    try {
      const response = await callLLM(prompt);
      const cleanedResponse = response
        .trim()
        .replace(/```json\s*|\s*```/g, "")
        .replace(/^[^{]*({.*})[^}]*$/, "$1")
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        .replace(/"(\d+)"/g, "$1");

      const result = JSON.parse(cleanedResponse) as BatchEvaluationResult;

      // Validate result structure
      if (!result.evaluations?.length) {
        throw new Error("Invalid evaluation structure");
      }

      // Validate and sanitize results
      return {
        evaluations: result.evaluations.map((evaluation) => ({
          score: evaluation.score || 0,
          technicalScore: evaluation.technicalScore || 0,
          communicationScore: evaluation.communicationScore || 0,
          problemSolvingScore: evaluation.problemSolvingScore || 0,
          feedback: evaluation.feedback || "Error processing feedback.",
        })),
      };
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error);

      // If we've exhausted all retries, return default evaluations
      if (attempts === maxRetries) {
        console.error("All retry attempts failed for evaluation");

        return {
          evaluations: questions.map(() => ({
            score: 0,
            technicalScore: 0,
            communicationScore: 0,
            problemSolvingScore: 0,
            feedback: "Failed to process response after multiple attempts.",
          })),
        };
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempts) * 1000),
      );
    }
  }

  // TypeScript requires this, but it should never be reached
  return { evaluations: [] };
}

async function extractTechnologies(
  questions: Array<{ aiQuestion: string; aiAnswer: string }>,
): Promise<string[]> {
  const prompt = `
    You are a technical interviewer analyzing interview questions and answers.
    Based on the following interview questions and their expected answers, identify the 5 main technologies or technical skills being assessed.
    
    Questions and Answers:
    ${questions
      .map(
        (q, i) => `
      Question ${i + 1}: ${q.aiQuestion}
      Expected Answer: ${q.aiAnswer}
    `,
      )
      .join("\n")}

    Return ONLY a JSON array of 5 technology/skill names, no additional text.
    Example: ["React", "TypeScript", "System Design", "REST APIs", "State Management"]

    Respond in JSON Only.
  `;

  try {
    const response = await callLLM(prompt);

    const cleanedResponse = response
      .trim()
      // Remove any potential markdown code block markers
      .replace(/```json\s*|\s*```/g, "")
      // Ensure the response starts with { and ends with }
      .replace(/^[^{]*({.*})[^}]*$/, "$1")
      // Fix common JSON formatting issues
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      // Remove any extra quotes around numbers
      .replace(/"(\d+)"/g, "$1");

    const technologies = JSON.parse(cleanedResponse);

    if (Array.isArray(technologies)) {
      const uniqueTechnologies = Array.from(new Set(technologies));

      return uniqueTechnologies;
    }
    return ["General Programming"]; // Fallback
  } catch (error) {
    console.error("Error extracting technologies:", error);
    return ["General Programming"]; // Fallback
  }
}

async function generateOverallFeedback(
  processedData: Array<{
    score: number;
    feedback: string;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
  }>,
): Promise<string> {
  const prompt = `
    Analyze these interview question results and provide a brief overall feedback summary for the candidate's interview answers,
    focusing on their strengths and areas for improvement:
    ${processedData
      .map(
        (item, i) => `
    Question ${i + 1}:
    Score: ${item.score}
    Feedback: ${item.feedback}
    `,
      )
      .join("\n")}

    Return only a concise paragraph of feedback, no additional formatting, and speak in first person like you're directly talking to the candidate.
  `;

  try {
    return await callLLM(prompt);
  } catch (error) {
    console.error("Error generating overall feedback:", error);
    return "Unable to generate overall feedback.";
  }
}

async function processInterview(data: InterviewRequestBody) {
  const {
    interviewId,
    interviewData,
    difficulty,
    yearsOfExperience,
    duration,
  } = data;

  try {
    // Validate difficulty enum
    const validDifficulties = [
      "JUNIOR",
      "MID_LEVEL",
      "SENIOR",
      "LEAD",
      "PRINCIPAL",
    ];

    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: "Invalid difficulty level" },
        { status: 400 },
      );
    }

    // Fetch the existing interview
    const existingInterview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { interviewData: true },
    });

    if (!existingInterview) {
      return NextResponse.json(
        { success: false, error: "Interview not found" },
        { status: 404 },
      );
    }

    // Batch evaluate all answers
    const { evaluations } = await evaluateAnswers(
      interviewData,
      difficulty,
      parseInt(yearsOfExperience),
    );

    // Combine original data with evaluations
    const processedData = interviewData.map((item, index) => ({
      ...item,
      ...evaluations[index],
    }));

    // Calculate average scores across all questions
    const interviewScore =
      processedData.reduce((acc, curr) => acc + curr.score, 0) /
      processedData.length;
    const technicalScore =
      processedData.reduce((acc, curr) => acc + curr.technicalScore, 0) /
      processedData.length;
    const communicationScore =
      processedData.reduce((acc, curr) => acc + curr.communicationScore, 0) /
      processedData.length;
    const problemSolvingScore =
      processedData.reduce((acc, curr) => acc + curr.problemSolvingScore, 0) /
      processedData.length;

    // Extract technologies being assessed
    const assessedTechnologies = await extractTechnologies(
      processedData.map((item) => ({
        aiQuestion: item.aiQuestion,
        aiAnswer: item.aiAnswer,
      })),
    );

    // Generate overall feedback
    const overallFeedback = await generateOverallFeedback(processedData);

    // Update the interview with all scores
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: "COMPLETED",
        interviewScore,
        technicalScore,
        communicationScore,
        problemSolvingScore,
        skillsAssessed: assessedTechnologies,
        questionsAnswered: processedData.length,
        difficulty,
        yearsOfExperience,
        duration: duration || 0,
        overAllFeedback: overallFeedback,
        interviewData: {
          deleteMany: {},
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

    return NextResponse.json({ success: true, data: updatedInterview });
  } catch (error) {
    console.error("Error processing interview:", error);
    prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: "ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const data = (await request.json()) as InterviewRequestBody;
    const { interviewId } = data;

    // Update interview status to processing
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: "PROCESSING" },
    });

    // Start background processing
    processInterview(data).catch((error) => {
      console.error("Error processing interview:", error);
      prisma.interview.update({
        where: { id: interviewId },
        data: {
          status: "ERROR",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
      });
    });

    return NextResponse.json({ success: true, status: "PROCESSING" });
  } catch (error) {
    console.error("Error initiating interview evaluation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process interview" },
      { status: 500 },
    );
  }
}
