import { SUPPORTED_LANGUAGES } from "@/config/site";

interface Question {
  aiQuestion: string;
  aiAnswer: string;
  userAnswer?: string;
}

interface EvaluationPromptParams {
  difficulty: string;
  yearsOfExperience: number;
  questions: Question[];
  language: string;
}

export function generateInterviewPrompt(
  jobTitle: string,
  jobDescription: string,
  difficulty: string,
  yearsOfExperience: string,
  targetCompany: string,
  language: string = "en",
  resumeContent: string[],
): string {
  const prompt = `
      Respond ONLY with a valid JSON object. Do not include any additional text or explanations.
      You are an expert technical interviewer. Based on the following:
      - Resume content
      - Job title: "${jobTitle}"
      - Job description: "${jobDescription}"
      - Difficulty level: "${difficulty}"
      - Required years of experience: ${yearsOfExperience} years
      - Interview language: "${language}"
      ${targetCompany ? `- Target company: ${targetCompany}` : ""}
  
      Generate 4 relevant common technical interview questions, and 1 common non-technical interview question focusing specifically on the listed skills to assess.
      Adjust the complexity and depth of questions based on the difficulty level and years of experience.
      All questions and answers should be in ${SUPPORTED_LANGUAGES[language].name} language.
  
      Candidate Resume content:
      ${resumeContent.join(" ")}.
  
      IMPORTANT FORMATTING RULES:
      1. Code examples should be on a single line with spaces instead of newlines
      2. Use only simple quotes or escaped quotes in code examples
      3. Avoid special characters or control characters, answer in simple text only, DO NOT USE MARKDOWN
      4. All text content should be on a single line
      5. All the 5 questions should be phrased like a question, with a question mark at the end.
      6. All questions and answers must be in ${SUPPORTED_LANGUAGES[language].name} language.
  
      Respond with a JSON object in this exact format:
      {
        "interviewData": [
          {
            "id": "unique-id-1",
            "aiQuestion": "detailed technical question focusing on one of the skills to assess",
            "aiAnswer": "detailed expected answer showing mastery of the skill,preferably without code unless the question requires it,the answer must be natural and brief (max 6 lines) like a real interview answer and DO NOT USE MARKDOWN, answer in plain text only, then a little code is enough, also make sure the the answer takes into account the user's resume info.",
            "userAnswer": "",
            "questionFeedback": ""
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

  return prompt;
}

export function evaluateInterviewPrompt({
  difficulty,
  yearsOfExperience,
  questions,
  language = "en",
}: EvaluationPromptParams): string {
  return `
  You are an expert technical interviewer evaluating a candidate with a difficulty level of ${difficulty} and ${yearsOfExperience} years of experience.
  Analyze the following technical interview responses and provide detailed scores and feedback for each answer.
  All evaluations should be in ${SUPPORTED_LANGUAGES[language].name} language.


  Consider these evaluation criteria for each answer:
  1. Technical Knowledge: Assess depth, accuracy, and relevance of concepts
  2. Communication: Evaluate clarity, structure, and effectiveness
  3. Problem Solving: Rate approach, critical thinking, and methodology

  Scoring Rules:
  - Exact/close match to expected answer: score 100
  - Question repetition or minimal response: score 0
  - Informative but imperfect answers: moderate score

  Questions and Answers to Evaluate:
  ${questions
    .map(
      (q, i) => `
    Question ${i + 1}: ${q.aiQuestion}
    Expected Answer: ${q.aiAnswer}
    User's Answer: ${q.userAnswer}
  `,
    )
    .join("\n")}

  Provide your response in the following JSON format only:
  {
    "evaluations": [
      {
        "score": <number 0-100>,
        "technicalScore": <number 0-100>,
        "communicationScore": <number 0-100>,
        "problemSolvingScore": <number 0-100>,
        "feedback": "Constructive feedback with details about the improvements that should be made, mention the areas that need to be studied if applicable, and speak in first person like you're directly talking to the candidate, and make it concise but with detailed explanations (atleast 4 sentences).",
        "learningResources": [
          {
            "title": "Resource title",
            "url": "Resource URL",
            "type": "documentation|article|tutorial|video",
            "description": "Brief description of what this resource covers"
          }
        ]
      },
      // ... one object for each question
    ]
  }

  IMPORTANT:
  1. Use double quotes only
  2. Feedback must be plain text, single line, no special characters, and in first person, talking to the candidate.
  3. All scores must be numbers without quotes
  4. Return only the JSON object
  5. 5 score for question repetition or yes/no answers
  6. All feedback and resource descriptions should be in ${SUPPORTED_LANGUAGES[language].name} language.
  7. For learningResources:
     - Provide 1-5 high-quality resources per question
     - Focus on recent docs, articles and interview related resources
     - Ensure resources are directly relevant to the question topic
     - Avoid paywalled content
     - Include links to site that are reliable like official docs, dont include youtube videos, gamasutra articles or fullstackreact.com.
  `;
}

export function extractTechnologiesPrompt(questions: Question[]): string {
  const prompt = `
    You are a technical interviewer analyzing interview questions and answers.
    Based on the following interview questions and their expected answers, identify the 5 main technologies or technical skills being tested.
    
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

  return prompt;
}

export function generateOverallFeedbackPrompt(
  processedData: Array<{
    score: number;
    feedback: string;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
  }>,
  language: string = "en",
): string {
  const prompt = `
    Analyze these interview question results and provide a brief overall feedback summary for the candidate's interview answers,
    focusing on their strengths and areas for improvement.
    Provide the feedback in ${SUPPORTED_LANGUAGES[language.toUpperCase()].name} language.

    Question Results:
    ${processedData
      .map(
        (item, i) => `
    Question ${i + 1}:
    Score: ${item.score}
    Feedback: ${item.feedback}
    `,
      )
      .join("\n")}

    Return only a concise paragraph of feedback in ${SUPPORTED_LANGUAGES[language.toUpperCase()].name}, no additional formatting, and speak in first person like you're directly talking to the candidate.
  `;

  return prompt;
}
