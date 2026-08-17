import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/types/settings";
import { generateWords, moreWords } from "./textGenerator";

describe("text generator", () => {
  it("is deterministic for a given seed", () => {
    const a = generateWords(DEFAULT_SETTINGS, 42);
    const b = generateWords(DEFAULT_SETTINGS, 42);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(10);
  });

  it("respects custom text", () => {
    const words = generateWords(
      { ...DEFAULT_SETTINGS, textMode: "custom", customText: "alpha beta gamma" },
      1,
    );
    expect(words.slice(0, 3)).toEqual(["alpha", "beta", "gamma"]);
  });

  it("can extend a run without changing earlier words", () => {
    const first = generateWords({ ...DEFAULT_SETTINGS, wordCount: 20 }, 99);
    const extra = moreWords({ ...DEFAULT_SETTINGS, wordCount: 20 }, 99, 20, 10);
    const full = generateWords({ ...DEFAULT_SETTINGS, wordCount: 30 }, 99);
    expect(first).toEqual(full.slice(0, 20));
    expect(extra).toEqual(full.slice(20, 30));
  });
});
