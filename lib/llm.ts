import { callAIWithPrompt as callGrokAI } from "./modelProviders/grok";
import { callAIWithPrompt as callGroqAI } from "./modelProviders/groq";
import { callAIWithPrompt as callTogetherAI } from "./modelProviders/together";

interface AIError extends Error {
  provider: string;
  statusCode?: number;
  timestamp: string;
}

function createAIError(
  message: string,
  provider: string,
  statusCode?: number,
): AIError {
  const error = new Error(message) as AIError;
  error.provider = provider;
  error.statusCode = statusCode;
  error.timestamp = new Date().toISOString();
  return error;
}

export async function callLLM(prompt: string): Promise<string> {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[LLM ${requestId}] Starting LLM call sequence with prompt length: ${prompt.length}`);
  const startTime = performance.now();

  // Add timeout wrapper
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`[LLM ${requestId}] Global LLM timeout after 30 seconds`));
    }, 30000); // 30 second timeout
  });

  try {
    const response = await Promise.race([
      tryAllProviders(prompt, requestId),
      timeoutPromise
    ]) as string;
    
    console.log(`[LLM ${requestId}] Call successful, total duration: ${(performance.now() - startTime).toFixed(2)}ms`);
    return response;
  } catch (error) {
    console.error(`[LLM ${requestId}] Fatal error in LLM call:`, error);
    throw error;
  }
}

async function tryAllProviders(prompt: string, requestId: string): Promise<string> {
  // Try Grok
  try {
    console.log(`[LLM ${requestId}] Attempting Grok AI call...`);
    const grokStartTime = performance.now();
    const grokResponse = await callGrokAI(prompt);
    console.log(`[LLM ${requestId}] Grok AI call successful`, {
      duration: `${(performance.now() - grokStartTime).toFixed(2)}ms`,
      responseLength: grokResponse.length,
    });
    return grokResponse;
  } catch (error) {
    console.error(`[LLM ${requestId}] Grok AI failed:`, error);
  }

  // Try Groq
  try {
    console.log(`[LLM ${requestId}] Attempting Groq AI call...`);
    const groqStartTime = performance.now();
    const groqResponse = await callGroqAI(prompt);
    console.log(`[LLM ${requestId}] Groq AI call successful`, {
      duration: `${(performance.now() - groqStartTime).toFixed(2)}ms`,
      responseLength: groqResponse.length,
    });
    return groqResponse;
  } catch (error) {
    console.error(`[LLM ${requestId}] Groq AI failed:`, error);
  }

  // Try Together AI
  try {
    console.log(`[LLM ${requestId}] Attempting Together AI call (fallback)...`);
    const togetherStartTime = performance.now();
    const togetherResponse = await callTogetherAI(prompt);
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
