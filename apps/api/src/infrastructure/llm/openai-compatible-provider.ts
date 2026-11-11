import { logReply } from "./llm-log.js";
import { LlmKeyRefused, type LlmProvider, type LlmRequest, redact } from "./llm-provider.js";

const TIMEOUT_MS = 15_000;

// Fixed addresses only: a learner never names the URL the server calls (ADR-0025, no SSRF).
const PRESETS = {
  openai: { url: "https://api.openai.com/v1/chat/completions", maxTokens: "max_completion_tokens" },
  openrouter: { url: "https://openrouter.ai/api/v1/chat/completions", maxTokens: "max_tokens" },
} as const;

type ChatResponse = {
  choices?: { message?: { content?: string | null }; finish_reason?: string }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

// The Chat Completions API, which OpenAI and OpenRouter both speak. Live calls are plain text, so no
// JSON-schema replies. Every call runs on the learner's own key: logged, at no cost to us.
export function openAiCompatible(preset: keyof typeof PRESETS, apiKey: string): LlmProvider {
  const { url, maxTokens } = PRESETS[preset];
  return {
    async generate(req: LlmRequest) {
      const startedAt = Date.now();
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(req.timeoutMs ?? TIMEOUT_MS),
        body: JSON.stringify({
          model: req.model,
          messages: [
            { role: "system", content: req.system },
            { role: "user", content: req.prompt },
          ],
          [maxTokens]: req.maxOutputTokens,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as ChatResponse;
      const text = body.choices?.[0]?.message?.content ?? "";
      const status = !res.ok ? "error" : text ? "ok" : "blocked";
      const usage = body.usage ?? {};
      const callId = await logReply(req, startedAt, { status, inputTokens: usage.prompt_tokens ?? 0, outputTokens: usage.completion_tokens ?? 0, estCostInr: "0", paidBy: "learner" });
      if (res.status === 401 || res.status === 403) throw new LlmKeyRefused(`${preset} refused this key`);
      if (status !== "ok") throw new Error(redact(`${preset} ${status}: ${body.error?.message ?? body.choices?.[0]?.finish_reason ?? `HTTP ${res.status}`}`, apiKey));
      return { text, callId };
    },
  };
}
