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
  const targetCompany = formData.get("targetCompany");

  const skillsAssessedRaw = formData.get("skillsAssessed");
  const skillsAssessed = skillsAssessedRaw
    ? JSON.parse(skillsAssessedRaw as string).join(", ")
    : "";

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
    - Skills to assess: ${skillsAssessed}
    ${targetCompany ? `- Target company: ${targetCompany}` : ""}

    Generate 5 relevant common interview questions focusing specifically on the listed skills to assess.
    Adjust the complexity and depth of questions based on the difficulty level and years of experience.

    Candidate Resume content:
    ${texts.join(" ")}.

    IMPORTANT FORMATTING RULES:
    1. Code examples should be on a single line with spaces instead of newlines
    2. Use only simple quotes or escaped quotes in code examples
    3. Avoid special characters or control characters
    4. All text content should be on a single line

    Respond with a JSON object in this exact format:
    {
      "interviewData": [
        {
          "id": "unique-id-1",
          "aiQuestion": "detailed technical question focusing on one of the skills to assess",
          "aiAnswer": "detailed expected answer showing mastery of the skill,preferably without code unless the question requires it, then a little code is enough, also make sure the the answer takes into account the user's resume info.",
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

    const aiResponseContent = await callAIWithPrompt(prompt);
    console.log("🚀 ~ POST ~ aiResponseContent:", aiResponseContent);

    try {
      // Clean and format the response
      const cleanedResponse = aiResponseContent
        .replace(/\n\s*/g, " ") // Replace newlines and following spaces with a single space
        .replace(/`{3}[\w]*\n?|\n?`{3}/g, "") // Remove code block markers
        .replace(/\\n/g, " ") // Replace literal \n with space
        .replace(/\\"/g, '"') // Replace escaped quotes
        .replace(/\\/g, "\\\\") // Escape backslashes
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters

      // Extract only the JSON content between curly braces
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : "{}";

      // Parse the cleaned JSON
      let aiResponse: { interviewData: any[] };
      try {
        aiResponse = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error("Error parsing cleaned JSON:", parseError);
        throw new Error("Invalid JSON format in AI response");
      }

      // Validate and format the data
      if (
        !aiResponse.interviewData ||
        !Array.isArray(aiResponse.interviewData)
      ) {
        throw new Error("AI response does not contain interview data array");
      }

      // Format the data
      const formattedData = {
        interviewData: aiResponse.interviewData
          .slice(0, 5)
          .map((item, index) => ({
            id: item.id || `q${index + 1}-${uuidv4()}`,
            interviewId: interviewId,
            aiQuestion:
              item.aiQuestion?.replace(/\n\s*/g, " ") ||
              `Question ${index + 1}`,
            aiAnswer:
              item.aiAnswer?.replace(/\n\s*/g, " ") ||
              "Expected answer not provided",
            userAnswer: "",
            questionFeedback:
              item.questionFeedback?.replace(/\n\s*/g, " ") ||
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
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
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
