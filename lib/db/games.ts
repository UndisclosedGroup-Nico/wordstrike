import type { GameResult, LeaderboardMetric } from "@/types/game";
import type { Difficulty, GameMode } from "@/types/settings";
import { getDb, markIdbUnavailable, memoryStore } from "./database";

export async function saveGameResult(result: GameResult): Promise<void> {
  const db = getDb();
  if (!db) {
    const store = memoryStore();
    store.setResults([result, ...store.results]);
    return;
  }

  try {
    await db.gameResults.put(result);
  } catch {
    markIdbUnavailable();
    const store = memoryStore();
    store.setResults([result, ...store.results]);
  }
}

export async function getGameResults(): Promise<GameResult[]> {
  const db = getDb();
  if (!db) {
    return [...memoryStore().results].sort((a, b) => b.timestamp - a.timestamp);
  }

  try {
    return await db.gameResults.orderBy("timestamp").reverse().toArray();
  } catch {
    markIdbUnavailable();
    return [...memoryStore().results].sort((a, b) => b.timestamp - a.timestamp);
  }
}

export async function deleteGameResult(id: string): Promise<void> {
  const db = getDb();
  if (!db) {
    const store = memoryStore();
    store.setResults(store.results.filter((item) => item.id !== id));
    return;
  }
  try {
    await db.gameResults.delete(id);
  } catch {
    markIdbUnavailable();
  }
}

export async function clearAllData(): Promise<void> {
  const db = getDb();
  memoryStore().setResults([]);
  if (!db) return;
  try {
    await db.gameResults.clear();
  } catch {
    markIdbUnavailable();
  }
}

export interface LeaderboardFilter {
  mode?: GameMode | "all";
  difficulty?: Difficulty | "all";
  duration?: number | "all";
  metric: LeaderboardMetric;
  limit?: number;
}

export function rankResults(
  results: GameResult[],
  filter: LeaderboardFilter,
): GameResult[] {
  const filtered = results.filter((result) => {
    if (filter.mode && filter.mode !== "all" && result.mode !== filter.mode) {
      return false;
    }
    if (
      filter.difficulty &&
      filter.difficulty !== "all" &&
      result.difficulty !== filter.difficulty
    ) {
      return false;
    }
    if (filter.duration !== undefined && filter.duration !== "all") {
      const expected = filter.duration;
      const actual = result.settings.duration;
      if (Math.abs(actual - expected) > 0.5 && expected !== 0) return false;
      if (expected === 0 && actual !== 0) return false;
    }
    return true;
  });

  const metric = filter.metric;
  return filtered
    .slice()
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, filter.limit ?? 25);
}
