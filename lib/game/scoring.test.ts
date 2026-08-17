import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { GameResult } from "@/types/game";
import { calcScore, isPersonalBest } from "./scoring";

function result(overrides: Partial<GameResult>): GameResult {
  return {
    id: "1",
    timestamp: 1,
    mode: "classic",
    difficulty: "normal",
    duration: 30,
    wpm: 80,
    rawWpm: 90,
    accuracy: 96,
    correctCharacters: 200,
    incorrectCharacters: 8,
    wordsCompleted: 40,
    damageDealt: 400,
    maxCombo: 10,
    score: 1000,
    text: "hello",
    settings: DEFAULT_SETTINGS,
    playerHpRemaining: 80,
    enemyDefeated: false,
    survivalTime: 30,
    wavesCleared: 2,
    ...overrides,
  };
}

describe("scoring", () => {
  it("rewards accuracy more than sloppy speed", () => {
    const clean = calcScore({
      wpm: 90,
      accuracy: 99,
      damageDealt: 300,
      maxCombo: 12,
      difficulty: "normal",
      mode: "classic",
    });
    const sloppy = calcScore({
      wpm: 130,
      accuracy: 60,
      damageDealt: 300,
      maxCombo: 2,
      difficulty: "normal",
      mode: "classic",
    });
    expect(clean).toBeGreaterThan(sloppy);
  });

  it("detects personal bests", () => {
    const previous = [result({ wpm: 100, score: 5000 })];
    expect(isPersonalBest(result({ wpm: 120 }), previous, "wpm")).toBe(true);
    expect(isPersonalBest(result({ wpm: 80 }), previous, "wpm")).toBe(false);
    expect(isPersonalBest(result({ wpm: 10 }), [], "wpm")).toBe(true);
  });
});
