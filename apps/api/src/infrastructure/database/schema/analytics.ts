import { index, integer, numeric, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, logId } from "./columns.js";

export const llmPurpose = pgEnum("llm_purpose", ["exercise_generation", "hint", "explanation", "embedding"]);
export const llmStatus = pgEnum("llm_status", ["ok", "error", "blocked"]);
// learner: the call ran on the learner's own key (ADR-0025), so it costs us nothing and no budget counts it.
export const llmPaidBy = pgEnum("llm_paid_by", ["platform", "learner"]);

// Every AI call, with its estimated cost: the budget alarm. A log, so only a loose ref.
export const llmCalls = pgTable(
  "llm_calls",
  {
    id: logId(),
    purpose: llmPurpose().notNull(),
    model: text().notNull(),
    promptVersion: text().notNull(),
    inputTokens: integer().notNull(),
    outputTokens: integer().notNull(),
    latencyMs: integer().notNull(),
    status: llmStatus().notNull(),
    estCostInr: numeric({ precision: 10, scale: 4 }).notNull(),
    paidBy: llmPaidBy().notNull().default("platform"),
    refType: text(),
    refId: uuid(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.createdAt), index().on(t.purpose, t.createdAt)],
);
