import type { GameResult, Statistics } from "@/types/game";
import { getGameResults } from "./games";
import { EXPORT_VERSION, type ExportPayload } from "./database";
import { loadSettings } from "./settings";

export function computeStatistics(results: GameResult[]): Statistics {
  if (results.length === 0) {
    return {
      totalGames: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      highestScore: 0,
      highestCombo: 0,
      mostDamage: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      lastRun: null,
    };
  }

  const totalGames = results.length;
  const bestWpm = Math.max(...results.map((item) => item.wpm));
  const bestAccuracy = Math.max(...results.map((item) => item.accuracy));
  const highestScore = Math.max(...results.map((item) => item.score));
  const highestCombo = Math.max(...results.map((item) => item.maxCombo));
  const mostDamage = Math.max(...results.map((item) => item.damageDealt));
  const averageWpm =
    results.reduce((sum, item) => sum + item.wpm, 0) / totalGames;
  const averageAccuracy =
    results.reduce((sum, item) => sum + item.accuracy, 0) / totalGames;
  const lastRun = [...results].sort((a, b) => b.timestamp - a.timestamp)[0] ?? null;

  return {
    totalGames,
    bestWpm,
    bestAccuracy,
    highestScore,
    highestCombo,
    mostDamage,
    averageWpm,
    averageAccuracy,
    lastRun,
  };
}

export async function getStatistics(): Promise<Statistics> {
  return computeStatistics(await getGameResults());
}

export async function getPersonalBest(): Promise<Statistics> {
  return getStatistics();
}

export async function exportData(): Promise<ExportPayload> {
  const [results, settings] = await Promise.all([getGameResults(), loadSettings()]);
  return {
    version: EXPORT_VERSION,
    exportedAt: Date.now(),
    results,
    settings,
  };
}

export function parseImportData(raw: string): ExportPayload {
  const parsed = JSON.parse(raw) as ExportPayload;
  if (!parsed || !Array.isArray(parsed.results) || !parsed.settings) {
    throw new Error("Invalid Wordstrike export file");
  }
  return parsed;
}
