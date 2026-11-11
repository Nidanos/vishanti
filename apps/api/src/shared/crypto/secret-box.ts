import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// AES-256-GCM. The context (a learner's id) is bound in as associated data, so a sealed value copied
// to another row won't open. Format: iv.tag.ciphertext, each base64.
const ALGORITHM = "aes-256-gcm";

export function seal(plain: string, key: Buffer, context: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv).setAAD(Buffer.from(context));
  const body = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), body].map((b) => b.toString("base64")).join(".");
}

// Throws if the value, the key or the context is wrong.
export function open(sealed: string, key: Buffer, context: string): string {
  const [iv, tag, body] = sealed.split(".").map((part) => Buffer.from(part, "base64"));
  const decipher = createDecipheriv(ALGORITHM, key, iv).setAAD(Buffer.from(context)).setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
}
