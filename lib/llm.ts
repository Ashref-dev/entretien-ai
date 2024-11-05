import { callAIWithPrompt as callGroqAI } from "./modelProviders/groq";
import { callAIWithPrompt as callTogetherAI } from "./modelProviders/together";

export async function callLLM(prompt: string): Promise<string> {
  try {
    // Try calling Groq AI first
    const groqResponse = await callGroqAI(prompt);
    return groqResponse;
  } catch (groqError) {
    console.error("Error calling Groq AI:", groqError);

    try {
      // If Groq AI fails, try calling Together AI
      const togetherResponse = await callTogetherAI(prompt);
      return togetherResponse;
    } catch (togetherError) {
      console.error("Error calling Together AI:", togetherError);
      throw new Error("Failed to get a valid response from either AI provider");
    }
  }
}
