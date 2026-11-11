import { z } from "zod";
import { aiProvider } from "../../../infrastructure/database/schema/index.js";
import { displayName } from "./auth.schemas.js";

// Intl knows every IANA zone, and throws on anything else.
function isTimeZone(zone: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

// Correction (DPDP s.12): the fields a learner may change themselves.
export const updateMeBody = z
  .object({ displayName, timezone: z.string().max(64).refine(isTimeZone, "Unknown time zone") })
  .partial()
  .refine((b) => b.displayName !== undefined || b.timezone !== undefined, "Send displayName or timezone");

export type ProfileInput = z.infer<typeof updateMeBody>;

// Only the optional opt-ins switch on and off. The required consents end with the account (DELETE /me).
export const optInParams = z.object({
  kind: z.enum(["ai_training", "research_study"], {
    error: "Only ai_training and research_study can be switched off; the others end when the account is deleted",
  }),
});

export const deleteMeBody = z.object({ password: z.string().min(1).max(128) });

// PUT /me/ai-key (ADR-0025). The model is a name in the provider's own list; without one, its default.
export const aiKeyBody = z.object({
  provider: z.enum(aiProvider.enumValues),
  model: z
    .string()
    .trim()
    .max(100)
    .regex(/^[A-Za-z0-9][\w.:/-]*$/, "That isn't a model name")
    .refine((m) => !m.includes(".."), "That isn't a model name")
    .optional(),
  apiKey: z.string().trim().min(8).max(400),
});

export type AiKeyInput = z.infer<typeof aiKeyBody>;
