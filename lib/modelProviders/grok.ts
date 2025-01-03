import OpenAI from "openai";

const key = process.env.GROK_API_KEY;
const baseURL = "https://api.x.ai/v1";
const GROK_MODEL = process.env.GROK_MODEL || "grok-beta";
const grokai = new OpenAI({ apiKey: key, baseURL });

export async function callAIWithPrompt(
  prompt: string,
  options?: { signal?: AbortSignal },
): Promise<any> {
  if (!key) {
    throw new Error("API key is not configured");
  }
  console.log("🚀 ~ callAIWithPrompt for grok ~ prompt:", prompt);

  try {
    // Send the prompt to Together AI and get the response
    const response = await grokai.chat.completions.create(
      {
        messages: [{ role: "user", content: prompt }],
        model: GROK_MODEL,
      },
      { signal: options?.signal },
    );

    // Extract the AI response content
    const aiResponseContent = response.choices[0]?.message?.content;
    if (!aiResponseContent) {
      throw new Error("Invalid response from Grok AI");
    }

    // Parse the AI response as JSON
    return aiResponseContent;
  } catch (error) {
    console.error("Error calling Grok AI:", error);
    throw new Error("Failed to get a valid response from AI");
  }
}
