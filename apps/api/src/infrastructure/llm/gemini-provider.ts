import { env } from "../../config/env.js";
import { logReply } from "./llm-log.js";
import { LlmKeyRefused, type LlmProvider, type LlmRequest, redact } from "./llm-provider.js";

const API = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 15_000;
// Estimates for the budget alarm only (paid Standard tier, ai.google.dev pricing, Oct 2026).
const USD_TO_INR = 88; // update when the rupee moves
const USD_PER_MILLION: Record<string, { input: number; output: number }> = {
  "gemini-3.5-flash-lite": { input: 0.3, output: 2.5 },
  "gemini-3.8-flash": { input: 0.75, output: 3.75 },
  "gemini-3.1-pro-preview": { input: 2, output: 12 },
};

// The platform's key may carry learner data only on a paid project (privacy policy §5).
export const geminiReady = () => Boolean(env.GEMINI_API_KEY) && env.GEMINI_PAID === "true";

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number };
  error?: { message?: string; details?: { reason?: string }[] };
};

const costInr = (model: string, input: number, output: number) => {
  const price = USD_PER_MILLION[model];
  if (!price) throw new Error(`No price for ${model}: add it before using the model`);
  return (((input * price.input + output * price.output) / 1e6) * USD_TO_INR).toFixed(4);
};

// Gemini answers a wrong key with 400 API_KEY_INVALID, and a key without access with 401 or 403.
const keyRefused = (status: number, body: GeminiResponse) =>
  status === 401 || status === 403 || Boolean(body.error?.details?.some((d) => d.reason === "API_KEY_INVALID"));

// Gemini over plain fetch: one POST per call. Thinking is kept minimal (hints are short), and every call
// is logged, including failures. The platform's calls are priced for its budget; a learner's cost us nothing.
function gemini(apiKey: string | undefined, paidBy: "platform" | "learner"): LlmProvider {
  return {
    async generate(req: LlmRequest) {
      if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
      if (paidBy === "platform" && env.GEMINI_PAID !== "true" && !req.allowFreeTier) throw new Error("GEMINI_PAID is not \"true\": no calls until billing is on (privacy policy §5)");
      const startedAt = Date.now();
      const res = await fetch(`${API}/${encodeURIComponent(req.model)}:generateContent`, {
        method: "POST",
        headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(req.timeoutMs ?? TIMEOUT_MS),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: req.system }] },
          contents: [{ role: "user", parts: [{ text: req.prompt }] }],
          generationConfig: {
            maxOutputTokens: req.maxOutputTokens,
            thinkingConfig: { thinkingLevel: req.thinking ?? "minimal" },
            ...(req.jsonSchema && { responseMimeType: "application/json", responseJsonSchema: req.jsonSchema }),
          },
        }),
      });
      const body = (await res.json().catch(() => ({}))) as GeminiResponse;
      const usage = body.usageMetadata ?? {};
      const text = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
      const inputTokens = usage.promptTokenCount ?? 0;
      const outputTokens = (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0);
      const status = !res.ok ? "error" : text ? "ok" : "blocked"; // no text back: a safety block
      const estCostInr = paidBy === "platform" ? costInr(req.model, inputTokens, outputTokens) : "0";
      const callId = await logReply(req, startedAt, { status, inputTokens, outputTokens, estCostInr, paidBy });
      if (keyRefused(res.status, body)) throw new LlmKeyRefused("Gemini refused this key");
      if (status !== "ok") throw new Error(redact(`Gemini ${status}: ${body.error?.message ?? body.candidates?.[0]?.finishReason ?? "no text"}`, apiKey));
      return { text, callId };
    },
  };
}

export const geminiProvider = gemini(env.GEMINI_API_KEY, "platform");
export const geminiWith = (apiKey: string) => gemini(apiKey, "learner");
