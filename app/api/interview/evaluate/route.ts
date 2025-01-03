import { NextResponse } from "next/server";
import { InterviewDifficulty } from "@/types";

import { prisma } from "@/lib/db";
import { callLLM } from "@/lib/llm";
import {
  evaluateInterviewPrompt,
  extractTechnologiesPrompt,
  generateOverallFeedbackPrompt,
} from "@/lib/prompts";
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

interface LearningResource {
  title: string;
  url: string;
  type: "documentation" | "article" | "tutorial" | "video";
  description: string;
}

interface QuestionEvaluation {
  score: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  feedback: string;
  learningResources: LearningResource[];
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
  language: string = "en",
  maxRetries = 3,
  signal?: AbortSignal,
): Promise<BatchEvaluationResult> {
  // Early return for empty questions
  if (!questions.length) return { evaluations: [] };

  let attempts = 0;

  // prompt is in config
  const prompt = evaluateInterviewPrompt({
    difficulty,
    yearsOfExperience,
    questions,
    language,
  });

  while (attempts < maxRetries) {
    try {
      const response = await callLLM(prompt, { signal });
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
          learningResources: evaluation.learningResources || [],
        })),
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
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
            learningResources: [],
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
  signal?: AbortSignal,
): Promise<string[]> {
  // prompt in config
  const prompt = extractTechnologiesPrompt(questions);

  try {
    const response = await callLLM(prompt, { signal });

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
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
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
  language: string = "en",
  signal?: AbortSignal,
): Promise<string> {
  // prompt in config again
  const prompt = generateOverallFeedbackPrompt(processedData, language);

  try {
    return await callLLM(prompt, { signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    console.error("Error generating overall feedback:", error);
    return "Unable to generate overall feedback.";
  }
}

async function processInterview(data: InterviewRequestBody) {
  const controller = new AbortController();

  try {
    const {
      interviewId,
      interviewData,
      difficulty,
      yearsOfExperience,
      duration,
    } = data;

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

    // core processing logic
    const { evaluations } = await evaluateAnswers(
      interviewData,
      difficulty,
      parseInt(yearsOfExperience),
      existingInterview.language,
      3,
      controller.signal,
    );

    // Combine original data with evaluations
    const processedData = interviewData.map((item, index) => ({
      ...item,
      ...evaluations[index],
    }));

    // Calculate average scores
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

    // Extract technologies with signal
    const assessedTechnologies = await extractTechnologies(
      processedData.map((item) => ({
        aiQuestion: item.aiQuestion,
        aiAnswer: item.aiAnswer,
      })),
      controller.signal,
    );

    // Generate overall feedback with signal
    const overallFeedback = await generateOverallFeedback(
      processedData,
      existingInterview.language,
      controller.signal,
    );

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
            learningResources: {
              create:
                item.learningResources?.map((resource) => ({
                  title: resource.title,
                  url: resource.url,
                  type: resource.type,
                  description: resource.description,
                })) || [],
            },
          })),
        },
      },
      include: {
        interviewData: {
          include: {
            learningResources: true,
          },
        },
      },
    });

    return updatedInterview;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const isTimeout = errorMessage.includes("timed out");

    await prisma.interview.update({
      where: { id: data.interviewId },
      data: {
        status: "ERROR",
        errorMessage: isTimeout
          ? "Interview evaluation timed out. Please try again."
          : errorMessage,
      },
    });

    controller.abort(); // Ensure all pending operations are cancelled
    throw error;
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

    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: "PROCESSING" },
    });

    // Process interview with error handling
    processInterview(data).catch((error) => {
      console.error("Error processing interview:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const isTimeout = errorMessage.includes("timed out");

      return prisma.interview.update({
        where: { id: interviewId },
        data: {
          status: "ERROR",
          errorMessage: isTimeout
            ? "Interview evaluation timed out. Please try again."
            : "Failed to process interview",
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
