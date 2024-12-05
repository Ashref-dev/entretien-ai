import { callAIWithPrompt as callGrokAI } from "./modelProviders/grok";
import { callAIWithPrompt as callGroqAI } from "./modelProviders/groq";
import { callAIWithPrompt as callTogetherAI } from "./modelProviders/together";

interface AIError extends Error {
  provider: string;
  statusCode?: number;
  timestamp: string;
}

function createAIError(message: string, provider: string, statusCode?: number): AIError {
  const error = new Error(message) as AIError;
  error.provider = provider;
  error.statusCode = statusCode;
  error.timestamp = new Date().toISOString();
  return error;
}

export async function callLLM(prompt: string): Promise<string> {
  console.log("[LLM] Starting LLM call sequence with prompt length:", prompt.length);
  const startTime = performance.now();
  
  try {
    console.log("[LLM] Attempting Groq AI call...");
    const groqStartTime = performance.now();
    const groqResponse = await callGroqAI(prompt);
    console.log("[LLM] Groq AI call successful", {
      duration: `${(performance.now() - groqStartTime).toFixed(2)}ms`,
      responseLength: groqResponse.length
    });
    return groqResponse;
  } catch (error) {
    const groqError = createAIError(
      (error as Error).message || "Unknown Groq error",
      "Groq",
      (error as any).statusCode
    );
    console.error("[LLM] Groq AI call failed:", {
      error: groqError,
      stackTrace: (error as Error).stack,
      timestamp: groqError.timestamp
    });
  }
  
  try {
    console.log("[LLM] Attempting Grok AI call...");
    const grokStartTime = performance.now();
    const grokResponse = await callGrokAI(prompt);
    console.log("[LLM] Grok AI call successful", {
      duration: `${(performance.now() - grokStartTime).toFixed(2)}ms`,
      responseLength: grokResponse.length
    });
    return grokResponse;
  } catch (error) {
    const grokError = createAIError(
      (error as Error).message || "Unknown Grok error",
      "Grok",
      (error as any).statusCode
    );
    console.error("[LLM] Grok AI call failed:", {
      error: grokError,
      stackTrace: (error as Error).stack,
      timestamp: grokError.timestamp
    });
  }
  
  try {
    console.log("[LLM] Attempting Together AI call (fallback)...");
    const togetherStartTime = performance.now();
    const togetherResponse = await callTogetherAI(prompt);
    console.log("[LLM] Together AI call successful", {
      duration: `${(performance.now() - togetherStartTime).toFixed(2)}ms`,
      responseLength: togetherResponse.length
    });
    return togetherResponse;
  } catch (error) {
    const togetherError = createAIError(
      (error as Error).message || "Unknown Together AI error",
      "Together",
      (error as any).statusCode
    );
    console.error("[LLM] All AI providers failed:", {
      error: togetherError,
      stackTrace: (error as Error).stack,
      timestamp: togetherError.timestamp,
      totalDuration: `${(performance.now() - startTime).toFixed(2)}ms`
    });
    throw new Error("Failed to get a valid response from any AI provider");
  }
}
