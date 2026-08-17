import Dexie, { type Table } from "dexie";
import { DEFAULT_SETTINGS, type GameSettings } from "@/types/settings";
import type { GameResult } from "@/types/game";

export interface SettingsRow {
  id: "user";
  value: GameSettings;
}

export class WordstrikeDB extends Dexie {
  gameResults!: Table<GameResult, string>;
  settings!: Table<SettingsRow, string>;

  constructor() {
    super("wordstrike");
    this.version(1).stores({
      gameResults: "id, timestamp, mode, difficulty, wpm, score, accuracy, maxCombo, damageDealt",
      settings: "id",
    });
  }
}

let db: WordstrikeDB | null = null;
let memoryResults: GameResult[] = [];
let memorySettings: GameSettings = { ...DEFAULT_SETTINGS };
let idbAvailable = true;

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

export function getDb(): WordstrikeDB | null {
  if (!isBrowser() || !idbAvailable) return null;
  if (!db) {
    try {
      db = new WordstrikeDB();
    } catch {
      idbAvailable = false;
      return null;
    }
  }
  return db;
}

export function markIdbUnavailable(): void {
  idbAvailable = false;
}

export function isIdbAvailable(): boolean {
  return idbAvailable && isBrowser();
}

export function memoryStore() {
  return {
    results: memoryResults,
    settings: memorySettings,
    setResults(next: GameResult[]) {
      memoryResults = next;
    },
    setSettings(next: GameSettings) {
      memorySettings = next;
    },
  };
}

export const EXPORT_VERSION = 1;

export interface ExportPayload {
  version: number;
  exportedAt: number;
  results: GameResult[];
  settings: GameSettings;
}
