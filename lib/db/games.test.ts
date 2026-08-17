import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { GameResult } from "@/types/game";
import { rankResults } from "./games";

function result(id: string, wpm: number, mode: GameResult["mode"] = "classic"): GameResult {
  return {
    id,
    timestamp: Number(id),
    mode,
    difficulty: "normal",
    duration: 30,
    wpm,
    rawWpm: wpm,
    accuracy: 95,
    correctCharacters: 100,
    incorrectCharacters: 5,
    wordsCompleted: 20,
    damageDealt: 200,
    maxCombo: 8,
    score: wpm * 100,
    text: "x",
    settings: { ...DEFAULT_SETTINGS, mode, duration: 30 },
    playerHpRemaining: 80,
    enemyDefeated: false,
    survivalTime: 30,
    wavesCleared: 1,
  };
}

describe("leaderboard ranking", () => {
  it("sorts by the selected metric and honors filters", () => {
    const rows = [
      result("1", 90, "classic"),
      result("2", 140, "classic"),
      result("3", 200, "boss"),
    ];
    const ranked = rankResults(rows, { metric: "wpm", mode: "classic", limit: 10 });
    expect(ranked.map((row) => row.id)).toEqual(["2", "1"]);
  });
});
