import { eq } from "drizzle-orm";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../src/app.js";
import { db } from "../src/infrastructure/database/index.js";
import { aiKeys, users } from "../src/infrastructure/database/schema/index.js";
import { LlmKeyRefused } from "../src/infrastructure/llm/llm-provider.js";
import { eraseAccount } from "../src/modules/m1_auth/services/erasure.service.js";
import { bearerFor, createUser } from "./helpers.js";

const { generate } = vi.hoisted(() => ({ generate: vi.fn() }));
vi.mock("../src/infrastructure/llm/providers.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/infrastructure/llm/providers.js")>()),
  providerFor: () => ({ generate }), // the provider's answer to the one check call, faked
}));
beforeEach(() => generate.mockReset().mockResolvedValue({ text: "OK", callId: 0 }));

const API_KEY = "AIzaSy-learner-own-key-WXYZ";

async function adult() {
  const user = await createUser();
  await db.update(users).set({ dateOfBirth: "1999-05-01" }).where(eq(users.id, user.id));
  return { user, auth: await bearerFor(user.id) };
}
const put = (auth: string, body: object, status: number) => request(app).put("/api/v1/me/ai-key").set("Authorization", auth).send(body).expect(status);
const view = async (auth: string) => (await request(app).get("/api/v1/me/ai-key").set("Authorization", auth).expect(200)).body.data.aiKey;

describe("/me/ai-key (ADR-0025)", () => {
  it("checks the key with one call, stores it sealed, and only ever shows its last 4 characters", async () => {
    const { user, auth } = await adult();
    expect(await view(auth)).toBeNull();

    const res = await put(auth, { provider: "gemini", apiKey: API_KEY }, 200);
    expect(res.body.data.aiKey).toMatchObject({ provider: "gemini", model: "gemini-3.5-flash-lite", last4: "WXYZ", status: "ok", lastError: null });
    expect(generate).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(res.body)).not.toContain(API_KEY);
    expect(JSON.stringify(await view(auth))).not.toContain(API_KEY);

    const [row] = await db.select().from(aiKeys).where(eq(aiKeys.userId, user.id));
    expect(row.sealedKey).not.toContain(API_KEY);
  });

  it("stores nothing when the provider refuses the key or can't use the model", async () => {
    const { auth } = await adult();
    generate.mockRejectedValueOnce(new LlmKeyRefused("refused"));
    expect((await put(auth, { provider: "openai", apiKey: API_KEY }, 422)).body.error).toMatchObject({ code: "AI_KEY_INVALID", message: "The provider refused this key" });

    generate.mockRejectedValueOnce(new Error("openai error: The model `gpt-nope` does not exist"));
    const { error } = (await put(auth, { provider: "openai", model: "gpt-nope", apiKey: API_KEY }, 422)).body;
    expect(error.message).toContain("does not exist");
    expect(await view(auth)).toBeNull();
  });

  it("replaces the old key, and removes it on request", async () => {
    const { auth } = await adult();
    await put(auth, { provider: "gemini", apiKey: API_KEY }, 200);
    await put(auth, { provider: "openrouter", model: "google/gemini-3.5-flash-lite", apiKey: "sk-or-v1-other-key-ABCD" }, 200);
    expect(await view(auth)).toMatchObject({ provider: "openrouter", model: "google/gemini-3.5-flash-lite", last4: "ABCD" });

    await request(app).delete("/api/v1/me/ai-key").set("Authorization", auth).expect(204);
    expect(await view(auth)).toBeNull();
  });

  it("is for adults only, and refuses an unknown provider or a strange model name", async () => {
    const minor = await createUser();
    await db.update(users).set({ dateOfBirth: "2012-01-01" }).where(eq(users.id, minor.id));
    expect((await put(await bearerFor(minor.id), { provider: "gemini", apiKey: API_KEY }, 403)).body.error.code).toBe("ADULTS_ONLY");

    const { auth } = await adult();
    await put(auth, { provider: "anthropic", apiKey: API_KEY }, 400);
    await put(auth, { provider: "openai", model: "../../etc", apiKey: API_KEY }, 400);
    expect(generate).not.toHaveBeenCalled();
  });

  it("appears in the data download without the key, and goes when the account is erased", async () => {
    const { user, auth } = await adult();
    await put(auth, { provider: "gemini", apiKey: API_KEY }, 200);
    const download = await request(app).get("/api/v1/me/data").set("Authorization", auth).expect(200);
    expect(JSON.parse(download.text).aiKey).toMatchObject({ provider: "gemini", last4: "WXYZ" });
    expect(download.text).not.toContain(API_KEY);

    await db.update(users).set({ deletionRequestedAt: new Date(Date.now() - 8 * 86_400_000) }).where(eq(users.id, user.id));
    await eraseAccount(user.id);
    expect(await db.$count(aiKeys, eq(aiKeys.userId, user.id))).toBe(0);
  });
});
