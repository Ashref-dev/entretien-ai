import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { v4 as uuidv4 } from "uuid";

import { callAIWithPrompt } from "@/lib/llm";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const document = formData.get("pdf");
  const jobTitle = formData.get("jobTitle");
  const jobDescription = formData.get("jobDescription");

  if (!document || !(document instanceof Blob)) {
    return NextResponse.json({ error: "Invalid PDF file" }, { status: 400 });
  }

  try {
    const pdfLoader = new PDFLoader(document, {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();
    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined,
    );
    const texts = selectedDocuments.map((doc) => doc.pageContent);
    const interviewId = uuidv4();

    const prompt = `
  You are an expert technical interviewer. Based on the following resume content, job title "${jobTitle}", and job description:
   "${jobDescription}".

   Generate 5 relevant technical interview questions along with their expected answers.
  Resume content:
  ${texts.join("\n")}

Respond ONLY with a JSON object in this exact format, without any additional text:
{
  "interviewData": [
    {
      "id": "unique-id-1",
      "interviewId": "${interviewId}",
      "aiQuestion": "detailed technical question 1",
      "aiAnswer": "detailed expected answer 1",
      "userAnswer": ""
    },
    {
      "id": "unique-id-2",
      "interviewId": "${interviewId}",
      "aiQuestion": "detailed technical question 2",
      "aiAnswer": "detailed expected answer 2",
      "userAnswer": ""
    },
    {
      "id": "unique-id-3",
      "interviewId": "${interviewId}",
      "aiQuestion": "detailed technical question 3",
      "aiAnswer": "detailed expected answer 3",
      "userAnswer": ""
    },
    {
      "id": "unique-id-4",
      "interviewId": "${interviewId}",
      "aiQuestion": "detailed technical question 4",
      "aiAnswer": "detailed expected answer 4",
      "userAnswer": ""
    },
    {
      "id": "unique-id-5",
      "interviewId": "${interviewId}",
      "aiQuestion": "detailed technical question 5",
      "aiAnswer": "detailed expected answer 5",
      "userAnswer": ""
    }
  ]
}

Requirements:
1. Generate exactly 5 questions.
2. Each question should be detailed and technical.
3. Each answer should be comprehensive.
4. Focus on technical skills mentioned in the resume.
5. Strictly follow the JSON format above.
6. Include ONLY JSON in your response.`;

    // Use the utility function to call Together AI with the prompt
    const aiResponse = await callAIWithPrompt(prompt);

    // Ensure exactly 5 questions are returned
    const formattedData = {
      interviewData: aiResponse.interviewData
        .slice(0, 5)
        .map((item, index) => ({
          id: item.id || `q${index + 1}-${uuidv4()}`,
          interviewId: interviewId,
          aiQuestion: item.aiQuestion || `Question ${index + 1}`,
          aiAnswer: item.aiAnswer || "Expected answer not provided",
          userAnswer: "",
        })),
    };

    // Fill in any missing questions
    while (formattedData.interviewData.length < 5) {
      formattedData.interviewData.push({
        id: `q${formattedData.interviewData.length + 1}-${uuidv4()}`,
        interviewId: interviewId,
        aiQuestion: `Additional Question ${formattedData.interviewData.length + 1}`,
        aiAnswer: "Expected answer not provided",
        userAnswer: "",
      });
    }

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
