import { DEFAULT_SETTINGS, type GameSettings } from "@/types/settings";
import { getDb, markIdbUnavailable, memoryStore } from "./database";

const LOCAL_KEY = "wordstrike:settings";

function readLocal(): GameSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as GameSettings) };
  } catch {
    return null;
  }
}

function writeLocal(settings: GameSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
  } catch {
    // ignore quota / private mode
  }
}

export async function loadSettings(): Promise<GameSettings> {
  const local = readLocal();
  const db = getDb();
  if (!db) {
    const fallback = local ?? memoryStore().settings;
    memoryStore().setSettings(fallback);
    return fallback;
  }

  try {
    const row = await db.settings.get("user");
    if (row) {
      const merged = { ...DEFAULT_SETTINGS, ...row.value };
      writeLocal(merged);
      return merged;
    }
  } catch {
    markIdbUnavailable();
  }

  return local ?? { ...DEFAULT_SETTINGS };
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  memoryStore().setSettings(settings);
  writeLocal(settings);
  const db = getDb();
  if (!db) return;
  try {
    await db.settings.put({ id: "user", value: settings });
  } catch {
    markIdbUnavailable();
  }
}

export async function resetSettings(): Promise<GameSettings> {
  const next = { ...DEFAULT_SETTINGS };
  await saveSettings(next);
  return next;
}
