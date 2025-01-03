import { callAIWithPrompt as callGrokAI } from "./modelProviders/grok";
import { callAIWithPrompt as callGroqAI } from "./modelProviders/groq";
import { callAIWithPrompt as callTogetherAI } from "./modelProviders/together";

export async function callLLM(
  prompt: string,
  options?: { signal?: AbortSignal },
): Promise<string> {
  const requestId = Math.random().toString(36).substring(7);
  console.log(
    `[LLM ${requestId}] Starting LLM call sequence with prompt length: ${prompt.length}`,
  );
  const startTime = performance.now();

  // Add timeout wrapper
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`[LLM ${requestId}] timed out after 120 seconds`));
    }, 120000); // 120 second timeout
  });

  try {
    const response = (await Promise.race([
      tryAllProviders(prompt, requestId, options),
      timeoutPromise,
    ])) as string;

    console.log(
      `[LLM ${requestId}] Call successful, total duration: ${(performance.now() - startTime).toFixed(2)}ms`,
    );

    console.log("🚀 ~ callLLM ~ response:", response);

    return response;
  } catch (error) {
    console.error(`[LLM ${requestId}] Fatal error in LLM call:`, error);
    throw error;
  }
}

async function tryAllProviders(
  prompt: string,
  requestId: string,
  options?: { signal?: AbortSignal },
): Promise<string> {
  // Try Groq
  try {
    console.log(`[LLM ${requestId}] Attempting Groq AI call...`);
    const groqStartTime = performance.now();
    const groqResponse = await callGroqAI(prompt, options);
    console.log(`[LLM ${requestId}] Groq AI call successful`, {
      duration: `${(performance.now() - groqStartTime).toFixed(2)}ms`,
      responseLength: groqResponse.length,
    });
    return groqResponse;
  } catch (error) {
    console.error(`[LLM ${requestId}] Groq AI failed:`, error);
  }

  // Try Grok
  try {
    console.log(`[LLM ${requestId}] Attempting Grok AI call...`);
    const grokStartTime = performance.now();
    const grokResponse = await callGrokAI(prompt, options);
    console.log(`[LLM ${requestId}] Grok AI call successful`, {
      duration: `${(performance.now() - grokStartTime).toFixed(2)}ms`,
      responseLength: grokResponse.length,
    });
    return grokResponse;
  } catch (error) {
    console.error(`[LLM ${requestId}] Grok AI failed:`, error);
  }

  // Try Together AI
  try {
    console.log(`[LLM ${requestId}] Attempting Together AI call (fallback)...`);
    const togetherStartTime = performance.now();
    const togetherResponse = await callTogetherAI(prompt, options);
    console.log(`[LLM ${requestId}] Together AI call successful`, {
      duration: `${(performance.now() - togetherStartTime).toFixed(2)}ms`,
      responseLength: togetherResponse.length,
    });
    return togetherResponse;
  } catch (error) {
    console.error(`[LLM ${requestId}] Together AI failed:`, error);
    throw new Error(`[LLM ${requestId}] All AI providers failed`);
  }
}
