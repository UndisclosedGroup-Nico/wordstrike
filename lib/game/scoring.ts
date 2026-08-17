import type { GameResult } from "@/types/game";
import type { Difficulty, GameMode } from "@/types/settings";

export function difficultyMultiplier(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 0.85;
    case "normal":
      return 1;
    case "hard":
      return 1.25;
    case "expert":
      return 1.5;
    case "custom":
      return 1;
    default: {
      const _exhaustive: never = difficulty;
      return _exhaustive;
    }
  }
}

export function modeMultiplier(mode: GameMode): number {
  switch (mode) {
    case "classic":
      return 1;
    case "timeAttack":
      return 1.1;
    case "endless":
      return 1.2;
    case "boss":
      return 1.35;
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

export function calcScore(input: {
  wpm: number;
  accuracy: number;
  damageDealt: number;
  maxCombo: number;
  difficulty: Difficulty;
  mode: GameMode;
}): number {
  const consistency = Math.max(0, input.accuracy - 70) / 30;
  const raw =
    input.wpm * 100 +
    input.accuracy * 10 +
    input.damageDealt * 5 +
    input.maxCombo * 50 +
    consistency * input.wpm * 40;

  const penalized = input.accuracy < 80 ? raw * (input.accuracy / 100) : raw;
  return Math.max(
    0,
    Math.round(
      penalized *
        difficultyMultiplier(input.difficulty) *
        modeMultiplier(input.mode),
    ),
  );
}

export function isPersonalBest(
  result: GameResult,
  previous: GameResult[],
  field: keyof Pick<
    GameResult,
    "wpm" | "accuracy" | "score" | "maxCombo" | "damageDealt"
  >,
): boolean {
  if (previous.length === 0) return true;
  return previous.every((run) => run[field] <= result[field]);
}
