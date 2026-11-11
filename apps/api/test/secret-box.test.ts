import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { open, seal } from "../src/shared/crypto/secret-box.js";

const KEY = randomBytes(32);

describe("secret box", () => {
  it("opens what it sealed, and the sealed text doesn't contain the secret", () => {
    const sealed = seal("sk-learner-secret-9876", KEY, "user-1");
    expect(sealed).not.toContain("sk-learner");
    expect(open(sealed, KEY, "user-1")).toBe("sk-learner-secret-9876");
  });

  it("won't open for another learner, with another key, or after tampering", () => {
    const sealed = seal("sk-learner-secret-9876", KEY, "user-1");
    expect(() => open(sealed, KEY, "user-2")).toThrow();
    expect(() => open(sealed, randomBytes(32), "user-1")).toThrow();
    const [iv, tag, body] = sealed.split(".");
    const flipped = Buffer.from(body, "base64");
    flipped[0] ^= 1;
    expect(() => open([iv, tag, flipped.toString("base64")].join("."), KEY, "user-1")).toThrow();
  });
});
