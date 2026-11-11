import { env } from "../../../config/env.js";
import { LlmKeyRefused, type LlmProvider, redact } from "../../../infrastructure/llm/llm-provider.js";
import { DEFAULT_MODELS, providerFor } from "../../../infrastructure/llm/providers.js";
import { open, seal } from "../../../shared/crypto/secret-box.js";
import { AppError } from "../../../shared/errors/app-error.js";
import * as repo from "../repositories/ai-key.repository.js";
import type { AiKeyInput } from "../schemas/account.schemas.js";
import { isAdult } from "./age.js";
import { me } from "./auth.service.js";

// The learner's own AI key runs the live tutor (ADR-0025). The key itself never leaves this module.
const ERROR_CHARS = 300;
const secret = () => (env.AI_KEY_SECRET ? Buffer.from(env.AI_KEY_SECRET, "base64") : undefined);
const messageOf = (err: unknown) => (err instanceof Error ? err.message : String(err)).slice(0, ERROR_CHARS);

// One tiny call proves the key and the model name before anything is stored.
const CHECK = { purpose: "hint", promptVersion: "key-check-v1", system: "Reply with the word OK.", prompt: "Say OK.", maxOutputTokens: 256 } as const;

// GET /me/ai-key: what the learner may see of their key.
export async function keyView(userId: string) {
  const key = await repo.findKey(userId);
  if (!key) return null;
  const { provider, model, keyLast4: last4, status, lastError, lastUsedAt, createdAt: addedAt } = key;
  return { provider, model, last4, status, lastError, lastUsedAt, addedAt };
}

// PUT /me/ai-key. Adults only: some providers' terms need it, and the pilot is adults only (ADR-0025).
export async function saveKey(userId: string, { provider, model, apiKey }: AiKeyInput) {
  const box = secret();
  if (!box) throw new AppError(503, "AI_KEYS_OFF", "This server can't store AI keys yet");
  const { dateOfBirth } = await me(userId);
  if (!dateOfBirth || !isAdult(dateOfBirth)) throw new AppError(403, "ADULTS_ONLY", "Only adults can add their own AI key");
  const chosen = model ?? DEFAULT_MODELS[provider];
  try {
    await providerFor(provider, apiKey).generate({ ...CHECK, model: chosen, ref: { type: "ai_key_check", id: userId } });
  } catch (err) {
    const why = err instanceof LlmKeyRefused ? "The provider refused this key" : `The provider couldn't use this key: ${redact(messageOf(err), apiKey)}`;
    throw new AppError(422, "AI_KEY_INVALID", why);
  }
  await repo.saveKey(userId, { provider, model: chosen, sealedKey: seal(apiKey, box, userId), keyLast4: apiKey.slice(-4) });
  return keyView(userId);
}

export const removeKey = repo.removeKey;

export type LiveTutor = { llm: LlmProvider; model: string };

// For M8: the learner's tutor, or null without a usable key. Each call records how the key did: a refused
// key is marked invalid and isn't called again; any other failure is kept to show on the account page.
export async function liveTutorFor(userId: string): Promise<LiveTutor | null> {
  const box = secret();
  const key = box && (await repo.findKey(userId));
  if (!box || !key || key.status !== "ok") return null;
  let apiKey: string;
  try {
    apiKey = open(key.sealedKey, box, userId);
  } catch {
    await repo.recordUse(userId, { status: "invalid", lastError: "Add your key again" }); // AI_KEY_SECRET changed
    return null;
  }
  const provider = providerFor(key.provider, apiKey);
  const llm: LlmProvider = {
    async generate(req) {
      try {
        const result = await provider.generate(req);
        await repo.recordUse(userId, { lastUsedAt: new Date(), lastError: null });
        return result;
      } catch (err) {
        await repo.recordUse(userId, err instanceof LlmKeyRefused ? { status: "invalid", lastError: messageOf(err) } : { lastError: messageOf(err) });
        throw err;
      }
    },
  };
  return { llm, model: key.model };
}
