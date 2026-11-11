import { and, eq, gte } from "drizzle-orm";
import { startOfIstMonth } from "../../shared/utils/ist.js";
import { sumOf } from "../database/aggregates.js";
import { db } from "../database/index.js";
import { llmCalls } from "../database/schema/index.js";
import type { LlmRequest } from "./llm-provider.js";

// Every call is logged with its estimated cost: the budget alarm (ADR-0010).
export const logCall = async (values: typeof llmCalls.$inferInsert) =>
  (await db.insert(llmCalls).values(values).returning({ id: llmCalls.id }))[0].id;

type Reply = Pick<typeof llmCalls.$inferInsert, "status" | "inputTokens" | "outputTokens" | "estCostInr" | "paidBy">;

// What every adapter logs for one call: the request, how long it took, and what came back.
export const logReply = (req: LlmRequest, startedAt: number, reply: Reply) =>
  logCall({ purpose: req.purpose, model: req.model, promptVersion: req.promptVersion, latencyMs: Date.now() - startedAt, refType: req.ref?.type, refId: req.ref?.id, ...reply });

// Each purpose has its own monthly cap on what the platform pays: content that is kept ("exercise_generation",
// "explanation"). Calls on a learner's own key cost us nothing, so they don't count (ADR-0025).
export const spentThisMonthInr = async (purpose: (typeof llmCalls.$inferSelect)["purpose"], now = new Date()) =>
  (
    await db
      .select({ inr: sumOf(llmCalls.estCostInr) })
      .from(llmCalls)
      .where(and(eq(llmCalls.purpose, purpose), eq(llmCalls.paidBy, "platform"), gte(llmCalls.createdAt, startOfIstMonth(now))))
  )[0].inr;
