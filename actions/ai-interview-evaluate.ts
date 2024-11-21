"use server";

import { InterviewDifficulty } from "@/types";

import { prisma } from "@/lib/db";
import { callLLM } from "@/lib/llm";
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

async function evaluateAnswer(
  question: string,
  aiAnswer: string,
  userAnswer: string,
  difficulty: string,
  yearsOfExperience: number,
): Promise<{
  score: number;
  feedback: string;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
}> {
  if (!userAnswer) {
    return {
      score: 0,
      feedback: "No answer provided to give feedback on.",
      technicalScore: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
    };
  }

  const prompt = `
  You are an expert technical interviewer evaluating a candidate with a difficulty level of ${difficulty} and ${yearsOfExperience} years of experience.
  Analyze the following technical interview response and provide detailed scores and feedback.

  Consider the following evaluation criteria:
  1. Technical Knowledge: Assess the depth, accuracy, and relevance of the concepts covered.
  2. Communication: Evaluate clarity, structure, and effectiveness in conveying ideas.
  3. Problem Solving: Rate the candidate's approach, critical thinking, and methodology.

  Scoring Rules:
  - If the user's answer matches the expected answer exactly or very closely, assign a score of 100.
  - If the user simply repeats the question as the answer, always assign a score of 0.
  - For answers that are informative but not perfect, assign a moderate score.

  Question: ${question}
  Expected Answer: ${aiAnswer}
  User's Answer: ${userAnswer}

  Provide your response in the following JSON format only:
  {
    "score": <number between 0 and 100>,
    "technicalScore": <number between 0 and 100>,
    "communicationScore": <number between 0 and 100>,
    "problemSolvingScore": <number between 0 and 100>,
    "feedback": "Provide constructive feedback covering strengths and areas for improvement. Avoid special characters and line breaks, and don't use markdown, speak in first person (you are the interview reviewer)."
  }
  }

  IMPORTANT:
  1. Use only double quotes (")
  2. Ensure feedback is not Markdown,i t must be plain text is a single line without special characters or line breaks.
  3. All scores must be numbers without quotes.
  4. Return only the JSON object with no additional text or formatting.
  5. If the user's answer is a simple repetition of the question or almost a repetition of the question, or a simple yes or no, always assign a score of 0. 

  Respond only with JSON.
`;

  const response = await callLLM(prompt);
  try {
    // First attempt to parse the response directly
    try {
      const result = JSON.parse(response);
      return {
        score: result.score || 0,
        feedback: result.feedback || "Error processing feedback.",
        technicalScore: result.technicalScore || 0,
        communicationScore: result.communicationScore || 0,
        problemSolvingScore: result.problemSolvingScore || 0,
      };
    } catch {
      // If direct parsing fails, try to clean the response
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

      console.log("Cleaned AI Response:", cleanedResponse);

      const result = JSON.parse(cleanedResponse);
      return {
        score: result.score || 0,
        feedback: result.feedback || "Error processing feedback.",
        technicalScore: result.technicalScore || 0,
        communicationScore: result.communicationScore || 0,
        problemSolvingScore: result.problemSolvingScore || 0,
      };
    }
  } catch (error) {
    console.error("Original AI response:", response);
    console.error("Error parsing AI response:", error);
    return {
      score: 0,
      feedback: "Error processing response.",
      technicalScore: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
    };
  }
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
  `;

  try {
    const response = await callLLM(prompt);
    const technologies = JSON.parse(response);

    if (Array.isArray(technologies) && technologies.length === 5) {
      return technologies;
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

    Return only a concise paragraph of feedback, no additional formatting.
  `;

  try {
    return await callLLM(prompt);
  } catch (error) {
    console.error("Error generating overall feedback:", error);
    return "Unable to generate overall feedback.";
  }
}

export async function evaluateInterview(data: InterviewRequestBody) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const {
      interviewId,
      interviewData,
      difficulty,
      yearsOfExperience,
      duration,
    } = data;

    if (!interviewData || !Array.isArray(interviewData)) {
      return { success: false, error: "Invalid data" };
    }

    // Validate difficulty enum
    const validDifficulties = [
      "JUNIOR",
      "MID_LEVEL",
      "SENIOR",
      "LEAD",
      "PRINCIPAL",
    ];
    if (!validDifficulties.includes(difficulty)) {
      return { success: false, error: "Invalid difficulty level" };
    }

    // Fetch the existing interview
    const existingInterview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { interviewData: true },
    });

    if (!existingInterview) {
      return { success: false, error: "Interview not found" };
    }

    // Calculate scores and generate feedback for each question
    const processedData = await Promise.all(
      interviewData.map(async (item) => {
        const evaluation = await evaluateAnswer(
          item.aiQuestion,
          item.aiAnswer,
          item.userAnswer,
          difficulty,
          parseInt(yearsOfExperience),
        );
        return {
          ...item,
          score: evaluation.score,
          feedback: evaluation.feedback,
          technicalScore: evaluation.technicalScore,
          communicationScore: evaluation.communicationScore,
          problemSolvingScore: evaluation.problemSolvingScore,
        };
      }),
    );

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

    return { success: true, data: updatedInterview };
  } catch (error) {
    console.error("Error evaluating interview:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to evaluate interview",
    };
  }
}
