interface Question {
  aiQuestion: string;
  aiAnswer: string;
  userAnswer: string;
}

interface EvaluationPromptParams {
  difficulty: string;
  yearsOfExperience: number;
  questions: Question[];
}

export function evaluateInterviewPrompt({
  difficulty,
  yearsOfExperience,
  questions,
}: EvaluationPromptParams): string {
  return `
  You are an expert technical interviewer evaluating a candidate with a difficulty level of ${difficulty} and ${yearsOfExperience} years of experience.
  Analyze the following technical interview responses and provide detailed scores and feedback for each answer.

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
        "feedback": "Constructive feedback with details about the improvements that should be made, mention the areas that need to be studied if applicable, and speak in first person like you're directly talking to the candidate, and make it concise but with detailed explanations (atleast 4 sentences)."
      },
      // ... one object for each question
    ]
  }

  IMPORTANT:
  1. Use double quotes only
  2. Feedback must be plain text, single line, no special characters, and in first person, talking to the candidate.
  3. All scores must be numbers without quotes
  4. Return only the JSON object
  5. Zero score for question repetition or yes/no answers
  `;
}
