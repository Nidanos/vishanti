import type { llmPurpose } from "../database/schema/index.js";

// One door to any LLM (design §4), so the hint engine and generation never depend on a vendor.
export type LlmRequest = {
  purpose: (typeof llmPurpose.enumValues)[number];
  model: string;
  promptVersion: string;
  system: string;
  prompt: string;
  maxOutputTokens: number;
  thinking?: "minimal" | "low"; // more thinking costs more; content that is kept gets "low" (default "minimal")
  jsonSchema?: object; // set: the reply is JSON matching this schema
  ref?: { type: string; id: string }; // what the call was for, kept in the cost log
  timeoutMs?: number; // long content (a lesson) takes longer than a hint
  // Content without any learner data may run before billing is on, on an explicit request only (ADR-0019).
  allowFreeTier?: boolean;
};

export type LlmResult = { text: string; callId: number };

export type LlmProvider = { generate(request: LlmRequest): Promise<LlmResult> };

// The provider refused the key itself (revoked, wrong, no access): calling again won't help (ADR-0025).
export class LlmKeyRefused extends Error {}

// A provider's error text can quote the key it was given; none of it leaves the server unredacted.
export const redact = (text: string, apiKey: string) => (apiKey ? text.replaceAll(apiKey, "[key]") : text);
