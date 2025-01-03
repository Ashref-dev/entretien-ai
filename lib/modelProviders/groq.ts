import Groq from "groq-sdk";

const key = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: key });
const GROQ_MODEL = process.env.GROQ_MODEL || "llama3-8b-8192";
export async function callAIWithPrompt(
  prompt: string,
  options?: { signal?: AbortSignal },
): Promise<any> {
  if (!key) {
    throw new Error("API key is not configured");
  }
  console.log("🚀 ~ callAIWithPrompt for grop ~ prompt:", prompt);

  try {
    // Send the prompt to Together AI and get the response
    const response = await groq.chat.completions.create(
      {
        // temperature: 0.4,

        messages: [{ role: "user", content: prompt }],
        model: GROQ_MODEL,
      },
      { signal: options?.signal },
    );

    // Extract the AI response content
    const aiResponseContent = response.choices[0]?.message?.content;
    if (!aiResponseContent) {
      throw new Error("Invalid response from Groq AI");
    }

    // Parse the AI response as JSON
    return aiResponseContent;
  } catch (error) {
    console.error("Error calling Groq AI:", error);
    throw new Error("Failed to get a valid response from AI");
  }
}
