import { describe, expect, it } from "vitest";
import { calcAccuracy, calcRawWpm, calcWpm, compareWord, recountCharacters } from "./metrics";

describe("metrics", () => {
  it("calculates WPM from correct characters", () => {
    expect(calcWpm(50, 60000)).toBe(10);
    expect(calcWpm(0, 1000)).toBe(0);
    expect(calcWpm(25, 0)).toBe(0);
  });

  it("calculates raw WPM from all keystrokes", () => {
    expect(calcRawWpm(40, 10, 60000)).toBe(10);
  });

  it("calculates accuracy without inflating empty input", () => {
    expect(calcAccuracy(0, 0)).toBe(100);
    expect(calcAccuracy(8, 2)).toBe(80);
  });

  it("compares words and counts extras plus misses", () => {
    expect(compareWord("cat", "cat", true)).toEqual({ correct: 3, incorrect: 0 });
    expect(compareWord("cat", "cot", true)).toEqual({ correct: 2, incorrect: 1 });
    expect(compareWord("cat", "catch", true)).toEqual({ correct: 3, incorrect: 2 });
    expect(compareWord("catch", "cat", true)).toEqual({ correct: 3, incorrect: 2 });
    expect(compareWord("catch", "cat", false)).toEqual({ correct: 3, incorrect: 0 });
  });

  it("recounts submitted history plus the live word", () => {
    const counted = recountCharacters(
      [{ target: "hi", typed: "hi" }],
      "go",
      "ga",
    );
    expect(counted).toEqual({ correct: 3, incorrect: 1 });
  });
});
