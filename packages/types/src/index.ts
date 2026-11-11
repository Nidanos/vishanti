// Contracts the API returns and the web app reads. Add a type here when a screen first uses an endpoint.

export type UserRole = "LEARNER" | "AUTHOR" | "ADMIN";

// GET /auth/me
export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  timezone: string;
  dateOfBirth: string | null;
  status: "active" | "pending_parent";
  createdAt: string;
  // The course of the latest finished placement test; null until the first one is finished.
  placementCourse: CourseSlug | null;
};

// The seeded courses (apps/api seed/data.ts); every course is in C++ for now.
export type CourseSlug = "cpp-basics" | "dsa";

// GET /me/consents lists the live ones; only the two optional opt-ins switch on and off (PUT|DELETE /me/consents/:kind).
export type ConsentKind = "terms" | "data_processing" | "parental" | "research_study" | "ai_training";
export type Consent = { kind: ConsentKind; policyVersion: string; grantedAt: string };

// The learner's own AI key (ADR-0025). GET /me/ai-key → { aiKey: AiKey | null }; PUT /me/ai-key with
// AiKeyInput checks the key with one call (422 AI_KEY_INVALID, 403 ADULTS_ONLY) → { aiKey: AiKey };
// DELETE /me/ai-key → 204. The key itself is never sent back.
export type AiProvider = "gemini" | "openai" | "openrouter";
export type AiKeyInput = { provider: AiProvider; model?: string; apiKey: string };
export type AiKey = {
  provider: AiProvider;
  model: string;
  last4: string;
  status: "ok" | "invalid"; // invalid: the provider refused it; hints are frozen until a new key is saved
  lastError: string | null; // the last failed call's reason (quota, timeout…), cleared by the next success
  lastUsedAt: string | null;
  addedAt: string;
};

export * from "./dashboard.js";
export * from "./diagnostic.js";
export * from "./learning.js";
