import Together from "together-ai";

import { env } from "@/env.mjs";

const key = env.AI_API_KEY;
const together = new Together({ apiKey: key });

export async function callAIWithPrompt(prompt: string): Promise<any> {
  if (!key) {
    throw new Error("Together API key is not configured");
  }

  try {
    // Send the prompt to Together AI and get the response
    const response = await together.chat.completions.create({
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      // model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      // model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      // model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
    });

    // Extract the AI response content
    const aiResponseContent = response.choices[0]?.message?.content;
    if (!aiResponseContent) {
      throw new Error("Invalid response from Together AI");
    }

    // Parse the AI response as JSON
    return aiResponseContent;
  } catch (error) {
    console.error("Error calling Together AI:", error);
    throw new Error("Failed to get a valid response from Together AI");
  }
}
