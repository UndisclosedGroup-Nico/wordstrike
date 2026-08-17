import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { GameResult } from "@/types/game";
import { computeStatistics, parseImportData } from "./stats";

function result(id: string, wpm: number, accuracy: number, score: number): GameResult {
  return {
    id,
    timestamp: Number(id),
    mode: "classic",
    difficulty: "normal",
    duration: 30,
    wpm,
    rawWpm: wpm + 5,
    accuracy,
    correctCharacters: 100,
    incorrectCharacters: 4,
    wordsCompleted: 20,
    damageDealt: 200,
    maxCombo: 6,
    score,
    text: "demo",
    settings: DEFAULT_SETTINGS,
    playerHpRemaining: 70,
    enemyDefeated: false,
    survivalTime: 30,
    wavesCleared: 1,
  };
}

describe("statistics", () => {
  it("returns zeros for an empty history", () => {
    const stats = computeStatistics([]);
    expect(stats.totalGames).toBe(0);
    expect(stats.lastRun).toBeNull();
  });

  it("aggregates personal bests and averages", () => {
    const stats = computeStatistics([
      result("1", 80, 90, 1000),
      result("2", 120, 98, 4000),
    ]);
    expect(stats.totalGames).toBe(2);
    expect(stats.bestWpm).toBe(120);
    expect(stats.bestAccuracy).toBe(98);
    expect(stats.highestScore).toBe(4000);
    expect(stats.averageWpm).toBe(100);
    expect(stats.lastRun?.id).toBe("2");
  });

  it("rejects invalid import payloads", () => {
    expect(() => parseImportData("{}")).toThrow();
    expect(() =>
      parseImportData(
        JSON.stringify({ version: 1, exportedAt: 1, results: [], settings: DEFAULT_SETTINGS }),
      ),
    ).not.toThrow();
  });
});
