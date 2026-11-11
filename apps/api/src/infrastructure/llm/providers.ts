import type { aiProvider } from "../database/schema/index.js";
import { geminiWith } from "./gemini-provider.js";
import type { LlmProvider } from "./llm-provider.js";
import { openAiCompatible } from "./openai-compatible-provider.js";

export type AiProvider = (typeof aiProvider.enumValues)[number];

// Small, cheap models suit short hints; a learner may name another model of the same provider (Nov 2026).
export const DEFAULT_MODELS: Record<AiProvider, string> = {
  gemini: "gemini-3.5-flash-lite",
  openai: "gpt-6-luna",
  openrouter: "google/gemini-3.5-flash-lite",
};

// The one place a learner's key becomes a provider (ADR-0025).
export const providerFor = (provider: AiProvider, apiKey: string): LlmProvider =>
  provider === "gemini" ? geminiWith(apiKey) : openAiCompatible(provider, apiKey);
