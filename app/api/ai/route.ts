import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { v4 as uuidv4 } from "uuid";

import { callAIWithPrompt } from "@/lib/llm";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const document = formData.get("pdf");
  const jobTitle = formData.get("jobTitle");
  const jobDescription = formData.get("jobDescription");
  const difficulty = formData.get("difficulty");
  const yearsOfExperience = formData.get("yearsOfExperience");

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
    Respond ONLY with a valid JSON object. Do not include any additional text or explanations.
    You are an expert technical interviewer. Based on the following:
    - Resume content
    - Job title: "${jobTitle}"
    - Job description: "${jobDescription}"
    - Difficulty level: "${difficulty}"
    - Required years of experience: ${yearsOfExperience}

    Generate 5 relevant technical interview questions along with their expected answers.
    Adjust the complexity and depth of questions based on the difficulty level and years of experience.
    
    Resume content:
    ${texts.join("\n")}

    Respond ONLY with a JSON object in this exact format:
  {
  "interviewData": [
    {
      "id": "unique-id-1",
      "aiQuestion": "detailed technical question 1",
      "aiAnswer": "detailed expected answer 1",
      "userAnswer": "",
      "questionFeedback": "Detailed feedback for the answer 1"
    },
    {
      "id": "unique-id-2",
      "aiQuestion": "detailed technical question 2",
      "aiAnswer": "detailed expected answer 2",
      "userAnswer": "",
      "questionFeedback": "Detailed feedback for the answer 2"
    },
    {
      "id": "unique-id-3",
      "aiQuestion": "detailed technical question 3",
      "aiAnswer": "detailed expected answer 3",
      "userAnswer": "",
      "questionFeedback": "Detailed feedback for the answer 3"
    },
    {
      "id": "unique-id-4",
      "aiQuestion": "detailed technical question 4",
      "aiAnswer": "detailed expected answer 4",
      "userAnswer": "",
      "questionFeedback": "Detailed feedback for the answer 4"
    },
    {
      "id": "unique-id-5",
      "aiQuestion": "detailed technical question 5",
      "aiAnswer": "detailed expected answer 5",
      "userAnswer": "",
      "questionFeedback": "Detailed feedback for the answer 5"
    }
  ]
}

   Requirements:
   1. Generate exactly 5 questions.
   2. Each question should be detailed and technical.
   3. Each answer should be comprehensive.
   4. Focus on technical skills mentioned in the resume.
   5. Strictly follow the JSON format above.
   6. Include ONLY JSON in your response.
   
   respond in json format.`;

    const aiResponseContent = await callAIWithPrompt(prompt);
    console.log("🚀 ~ POST ~ aiResponseContent:", aiResponseContent);

    // Extract only the JSON content between curly braces
    const jsonMatch = aiResponseContent.match(/\{[\s\S]*\}/);
    const cleanedResponse = jsonMatch ? jsonMatch[0] : "{}";

    let aiResponse: { interviewData: any[] };

    try {
      aiResponse = JSON.parse(cleanedResponse);

      // Ensure exactly 5 questions are returned
      if (
        !aiResponse.interviewData ||
        !Array.isArray(aiResponse.interviewData) ||
        aiResponse.interviewData.length < 5
      ) {
        throw new Error("AI response does not contain at least 5 questions.");
      }

      // Format the data
      const formattedData = {
        interviewData: aiResponse.interviewData
          .slice(0, 5)
          .map((item, index) => ({
            id: item.id || `q${index + 1}-${uuidv4()}`,
            interviewId: interviewId,
            aiQuestion: item.aiQuestion || `Question ${index + 1}`,
            aiAnswer: item.aiAnswer || "Expected answer not provided",
            userAnswer: "",
            questionFeedback:
              item.questionFeedback ||
              "Detailed feedback for the answer not provided",
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
          questionFeedback: "Detailed feedback for the answer not provided",
        });
      }

      return NextResponse.json(formattedData, { status: 200 });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json(
        { error: "AI returned invalid JSON." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
