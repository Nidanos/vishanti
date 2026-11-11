import { eq } from "drizzle-orm";
import { db } from "../../../infrastructure/database/index.js";
import { aiKeys } from "../../../infrastructure/database/schema/index.js";

type NewKey = Pick<typeof aiKeys.$inferInsert, "provider" | "model" | "sealedKey" | "keyLast4">;
type Use = Partial<Pick<typeof aiKeys.$inferInsert, "status" | "lastError" | "lastUsedAt">>;

// One key per learner: a new one replaces the old, with a clean record.
export const saveKey = (userId: string, key: NewKey) =>
  db
    .insert(aiKeys)
    .values({ userId, ...key })
    .onConflictDoUpdate({ target: aiKeys.userId, set: { ...key, status: "ok", lastError: null, lastUsedAt: null, updatedAt: new Date() } });

export const findKey = async (userId: string) => (await db.select().from(aiKeys).where(eq(aiKeys.userId, userId)))[0];

export const removeKey = (userId: string) => db.delete(aiKeys).where(eq(aiKeys.userId, userId));

export const recordUse = (userId: string, use: Use) => db.update(aiKeys).set(use).where(eq(aiKeys.userId, userId));
