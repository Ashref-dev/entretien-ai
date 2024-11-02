import { NextRequest, NextResponse } from "next/server";

import { InterviewDifficulty } from "@/types/interview";
import { prisma } from "@/lib/db";
import { callAIWithPrompt } from "@/lib/llm";
import { getCurrentUser } from "@/lib/session";

type InterviewRequestBody = {
  interviewData: Array<{
    aiQuestion: string;
    aiAnswer: string;
    userAnswer: string;
  }>;
  difficulty: InterviewDifficulty;
  yearsOfExperience: number;
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
    You are an expert technical interviewer evaluating a ${difficulty} level candidate with ${yearsOfExperience} years of experience.
    Analyze the following technical interview response and provide scores and feedback.
    Consider three aspects:
    1. Technical Knowledge: Understanding of concepts, accuracy, and depth of knowledge
    2. Communication: Clarity, structure, and effectiveness of explanation
    3. Problem Solving: Approach, methodology, and critical thinking

    If the user's answer is exactly the same or close as the expected answer, give a score of 100.
    If the user just repeats the question as his answer, give a score of 0.
    Otherwise, give a score based on the user's answer.

    Don't be too lenient, if the user's answer is not perfect, give a score in the middle.

    Question: ${question}
    Expected Answer: ${aiAnswer}
    User's Answer: ${userAnswer}

    Provide your response judging the user's answer in the following JSON format only:
    {
      "score": <number between 0 and 100>,
      "technicalScore": <number between 0 and 100>,
      "communicationScore": <number between 0 and 100>,
      "problemSolvingScore": <number between 0 and 100>,
      "feedback": "Your feedback text here without any special characters or line breaks"
    }

    IMPORTANT: 
    1. Use only double quotes (")
    2. Do not use line breaks in the feedback text
    3. Avoid special characters in the feedback text
    4. All scores must be numbers without quotes
    5. Return only the JSON object, no additional text or formatting

    Answer only with JSON.
  `;

  const response = await callAIWithPrompt(prompt);
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
    const response = await callAIWithPrompt(prompt);
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
    return await callAIWithPrompt(prompt);
  } catch (error) {
    console.error("Error generating overall feedback:", error);
    return "Unable to generate overall feedback.";
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

    const { interviewId } = await params;
    const {
      interviewData,
      difficulty,
      yearsOfExperience,
    }: InterviewRequestBody = await req.json();

    if (!interviewData || !Array.isArray(interviewData)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
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
      return NextResponse.json(
        { error: "Invalid difficulty level" },
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
          difficulty,
          yearsOfExperience,
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
        overAllFeedback: overallFeedback,
        // updatedAt: new Date(),
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

    return NextResponse.json(updatedInterview);
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
