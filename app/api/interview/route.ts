import { NextRequest } from "next/server";
import { InterviewDifficulty } from "@/types";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@/lib/db";
import { callLLM } from "@/lib/llm";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const interviewId = uuidv4();

    // Create initial interview record
    const interview = await prisma.interview.create({
      data: {
        id: interviewId,
        status: "PROCESSING",
        jobTitle: formData.get("jobTitle") as string,
        jobDescription: formData.get("jobDescription") as string,
        difficulty: formData.get("difficulty") as InterviewDifficulty,
        yearsOfExperience: formData.get("yearsOfExperience") as string,
        targetCompany: (formData.get("targetCompany") as string) || "",
        resume: (formData.get("pdf") as File).name,
        userId: user.id!,
      },
    });

    // Start background processing
    processInterview(interview.id, formData).catch((error) => {
      console.error("Error in background processing:", error);
      prisma.interview
        .update({
          where: { id: interview.id },
          data: {
            status: "ERROR",
            errorMessage: error.message,
          },
        })
        .catch(console.error);
    });

    return new Response(
      JSON.stringify({
        success: true,
        interviewId: interview.id,
        status: "PROCESSING",
      }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create interview",
      }),
      { status: 500 },
    );
  }
}

async function processInterview(interviewId: string, formData: FormData) {
  console.log(`[${interviewId}] Starting interview processing`);

  // Create an AbortController for the timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log(
      `[${interviewId}] Interview processing timed out after 120 seconds`,
    );
    controller.abort();
  }, 120000); // 120 seconds timeout

  try {
    console.log(`[${interviewId}] Extracting form data`);
    const pdf = formData.get("pdf") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const difficulty = formData.get("difficulty") as InterviewDifficulty;
    const yearsOfExperience = formData.get("yearsOfExperience") as string;
    const targetCompany = formData.get("targetCompany") as string;

    if (!pdf) {
      console.error(`[${interviewId}] PDF file is missing`);
      throw new Error("Invalid PDF file");
    }

    console.log(`[${interviewId}] Loading PDF file: ${pdf.name}`);
    const pdfLoader = new PDFLoader(pdf, {
      parsedItemSeparator: " ",
    });

    console.log(`[${interviewId}] Starting PDF parsing`);
    const docs = await pdfLoader.load();
    console.log(
      `[${interviewId}] PDF parsed successfully, pages: ${docs.length}`,
    );

    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined,
    );
    console.log(
      `[${interviewId}] Filtered documents: ${selectedDocuments.length}`,
    );

    const texts = selectedDocuments.map((doc) => doc.pageContent);
    console.log(
      `[${interviewId}] Preparing to call LLM with resume content length: ${texts.join(" ").length}`,
    );

    const prompt = `
      Respond ONLY with a valid JSON object. Do not include any additional text or explanations.
      You are an expert technical interviewer. Based on the following:
      - Resume content
      - Job title: "${jobTitle}"
      - Job description: "${jobDescription}"
      - Difficulty level: "${difficulty}"
      - Required years of experience: ${yearsOfExperience}
      ${targetCompany ? `- Target company: ${targetCompany}` : ""}
  
      Generate 4 relevant common technical interview questions, and 1 common non-technical interview question focusing specifically on the listed skills to assess.
      Adjust the complexity and depth of questions based on the difficulty level and years of experience.
  
      Candidate Resume content:
      ${texts.join(" ")}.
  
      IMPORTANT FORMATTING RULES:
      1. Code examples should be on a single line with spaces instead of newlines
      2. Use only simple quotes or escaped quotes in code examples
      3. Avoid special characters or control characters, answer in simple text only, DO NOT USE MARKDOWN
      4. All text content should be on a single line
      5. All the 5 questions should be phrased like a question, with a question mark at the end.
  
      Respond with a JSON object in this exact format:
      {
        "interviewData": [
          {
            "id": "unique-id-1",
            "aiQuestion": "detailed technical question focusing on one of the skills to assess",
            "aiAnswer": "detailed expected answer showing mastery of the skill,preferably without code unless the question requires it,the answer must be natural and brief (max 6 lines) like a real interview answer and DO NOT USE MARKDOWN, answer in plain text only, then a little code is enough, also make sure the the answer takes into account the user's resume info.",
            "userAnswer": "",
            "questionFeedback": "Detailed feedback criteria for evaluating the answer"
          }
        ]
      }
  
      Requirements:
      1. Generate exactly 5 questions
      2. Each question should focus on one or more of the skills to assess
      3. Each answer should demonstrate mastery of the relevant skill(s)
      4. Match question difficulty to the specified level (${difficulty})
      5. Consider the candidate's years of experience (${yearsOfExperience} years)
      6. Strictly follow the JSON format above
      7. Include ONLY JSON in your response
      8. All code examples must be on a single line
      `;

    console.log(
      `[${interviewId}] Calling LLM with prompt length: ${prompt.length}`,
    );
    const aiResponseContent = (await Promise.race([
      callLLM(prompt),
      new Promise((_, reject) => {
        controller.signal.addEventListener("abort", () => {
          reject(new Error("Interview generation timed out after 120 seconds"));
        });
      }),
    ])) as string;
    
    console.log(
      `[${interviewId}] Received LLM response, length: ${aiResponseContent.length}`,
    );

    // Clean and format the response
    console.log(`[${interviewId}] Cleaning and formatting LLM response`);
    const cleanedResponse = aiResponseContent
      .replace(/\n\s*/g, " ")
      .replace(/`{3}[\w]*\n?|\n?`{3}/g, "")
      .replace(/\\n/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\\/g, "\\\\")
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? jsonMatch[0] : "{}";
    console.log(
      `[${interviewId}] Extracted JSON content length: ${jsonContent.length}`,
    );

    let aiResponse: { interviewData: any[] };
    try {
      aiResponse = JSON.parse(jsonContent);
      console.log(`[${interviewId}] Successfully parsed JSON response`);
    } catch (parseError) {
      console.error(
        `[${interviewId}] Failed to parse JSON response:`,
        parseError,
      );
      console.error(`[${interviewId}] Raw JSON content:`, jsonContent);
      throw new Error("Invalid JSON format in AI response");
    }

    if (!aiResponse.interviewData || !Array.isArray(aiResponse.interviewData)) {
      console.error(`[${interviewId}] Invalid response structure:`, aiResponse);
      throw new Error("AI response does not contain interview data array");
    }

    console.log(
      `[${interviewId}] Formatting interview data, questions count: ${aiResponse.interviewData.length}`,
    );
    const formattedData = {
      interviewData: aiResponse.interviewData
        .slice(0, 5)
        .map((item, index) => ({
          id: item.id || `q${index + 1}-${uuidv4()}`,
          interviewId: interviewId,
          aiQuestion:
            item.aiQuestion?.replace(/\n\s*/g, " ") || `Question ${index + 1}`,
          aiAnswer:
            item.aiAnswer?.replace(/\n\s*/g, " ") ||
            "Expected answer not provided",
          userAnswer: "",
          questionFeedback:
            item.questionFeedback?.replace(/\n\s*/g, " ") ||
            "Detailed feedback for the answer not provided",
        })),
    };

    console.log(`[${interviewId}] Updating interview in database`);
    // Update existing interview with generated data
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: "COMPLETED",
        interviewData: {
          create: formattedData.interviewData.map((item) => ({
            aiQuestion: item.aiQuestion,
            aiAnswer: item.aiAnswer,
            userAnswer: item.userAnswer,
            questionFeedback: item.questionFeedback,
          })),
        },
      },
    });
    console.log(`[${interviewId}] Interview processing completed successfully`);
  } catch (error) {
    console.error(`[${interviewId}] Error in processInterview:`, error);
    console.error(
      `[${interviewId}] Error stack:`,
      error instanceof Error ? error.stack : "No stack trace",
    );
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: "ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });
    throw error; // Re-throw to be caught by the caller
  } finally {
    console.log(`[${interviewId}] Cleaning up resources`);
    clearTimeout(timeoutId);
  }
}

// Add status check endpoint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const interviewId = await searchParams.get("id");

  if (!interviewId) {
    return new Response(
      JSON.stringify({ success: false, error: "Interview ID required" }),
      { status: 400 },
    );
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { interviewData: true },
  });

  if (!interview) {
    return new Response(
      JSON.stringify({ success: false, error: "Interview not found" }),
      { status: 404 },
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      status: interview.status,
      data: interview.status === "COMPLETED" ? interview : null,
      error: interview.status === "ERROR" ? interview.errorMessage : null,
    }),
  );
}
