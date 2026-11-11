import { desc } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { db } from "../src/infrastructure/database/index.js";
import { llmCalls } from "../src/infrastructure/database/schema/index.js";
import { LlmKeyRefused, type LlmRequest } from "../src/infrastructure/llm/llm-provider.js";
import { providerFor } from "../src/infrastructure/llm/providers.js";

const KEY = "sk-test-0123456789abcdef";
const REQUEST: LlmRequest = { purpose: "hint", model: "some-model", promptVersion: "test", system: "Be brief.", prompt: "Hint, please.", maxOutputTokens: 100 };

// One faked reply from the provider; returns the request the adapter sent.
function providerReplies(status: number, body: object) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetchMock);
  return () => {
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    return { url, headers: init.headers as Record<string, string>, body: JSON.parse(String(init.body)) };
  };
}
const lastCall = async () => (await db.select().from(llmCalls).orderBy(desc(llmCalls.id)).limit(1))[0];

afterEach(() => vi.unstubAllGlobals());

describe("a learner's own provider (ADR-0025)", () => {
  it("OpenAI: sends the chat request to its fixed address, and logs the call as theirs, at no cost to us", async () => {
    const sent = providerReplies(200, { choices: [{ message: { content: "Look at the loop." } }], usage: { prompt_tokens: 12, completion_tokens: 5 } });
    expect((await providerFor("openai", KEY).generate(REQUEST)).text).toBe("Look at the loop.");
    const { url, headers, body } = sent();
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect(headers.Authorization).toBe(`Bearer ${KEY}`);
    expect(body).toMatchObject({ model: "some-model", max_completion_tokens: 100, messages: [{ role: "system" }, { role: "user", content: "Hint, please." }] });
    expect(await lastCall()).toMatchObject({ paidBy: "learner", estCostInr: "0.0000", inputTokens: 12, outputTokens: 5, status: "ok" });
  });

  it("OpenRouter: the same request shape at its own address", async () => {
    const sent = providerReplies(200, { choices: [{ message: { content: "ok" } }] });
    await providerFor("openrouter", KEY).generate(REQUEST);
    expect(sent()).toMatchObject({ url: "https://openrouter.ai/api/v1/chat/completions", body: { max_tokens: 100 } });
  });

  it("Gemini: the learner's key in the header, logged as theirs", async () => {
    const sent = providerReplies(200, { candidates: [{ content: { parts: [{ text: "Check the base case." }] } }], usageMetadata: { promptTokenCount: 9, candidatesTokenCount: 4 } });
    expect((await providerFor("gemini", KEY).generate(REQUEST)).text).toBe("Check the base case.");
    expect(sent().headers["x-goog-api-key"]).toBe(KEY);
    expect(await lastCall()).toMatchObject({ paidBy: "learner", estCostInr: "0.0000" });
  });

  it("a refused key says so, so it isn't tried again", async () => {
    providerReplies(401, { error: { message: `Incorrect API key provided: ${KEY}` } });
    await expect(providerFor("openai", KEY).generate(REQUEST)).rejects.toBeInstanceOf(LlmKeyRefused);
    providerReplies(400, { error: { message: "API key not valid.", details: [{ reason: "API_KEY_INVALID" }] } });
    await expect(providerFor("gemini", KEY).generate(REQUEST)).rejects.toBeInstanceOf(LlmKeyRefused);
  });

  it("never repeats the key in an error", async () => {
    providerReplies(429, { error: { message: `Quota exceeded for key ${KEY}` } });
    const err = await providerFor("openrouter", KEY).generate(REQUEST).catch((e: Error) => e);
    expect(String(err)).toContain("Quota exceeded");
    expect(String(err)).not.toContain(KEY);
  });
});
