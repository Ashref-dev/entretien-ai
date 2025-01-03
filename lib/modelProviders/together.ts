import Together from "together-ai";

const TOGETHER_MODEL =
  process.env.TOGETHER_MODEL || "meta-llama/Llama-3.2-3B-Instruct-Turbo";
const key = process.env.AI_API_KEY;
const together = new Together({ apiKey: key });

export async function callAIWithPrompt(
  prompt: string,
  options?: { signal?: AbortSignal },
): Promise<any> {
  if (!key) {
    throw new Error("API key is not configured");
  }
  console.log("🚀 ~ callAIWithPrompt for together ~ prompt:", prompt);

  try {
    // Send the prompt to Together AI and get the response
    const response = await together.chat.completions.create(
      {
        messages: [{ role: "user", content: prompt }],
        model: TOGETHER_MODEL,
      },
      { signal: options?.signal },
    );

    // Extract the AI response content
    const aiResponseContent = response.choices[0]?.message?.content;
    if (!aiResponseContent) {
      throw new Error("Invalid response from Together AI");
    }

    // Parse the AI response as JSON
    return aiResponseContent;
  } catch (error) {
    console.error("Error calling Together AI:", error);
    throw new Error("Failed to get a valid response from AI");
  }
}
