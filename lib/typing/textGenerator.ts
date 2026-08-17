import type { Difficulty, GameSettings, TextMode, WordCategory } from "@/types/settings";
import {
  EASY_WORDS,
  EXPERT_WORDS,
  FANTASY_WORDS,
  GAMING_WORDS,
  HARD_WORDS,
  NORMAL_WORDS,
  PROGRAMMING_WORDS,
  QUOTES,
  SCIFI_WORDS,
  SENTENCES,
} from "./wordLists";

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(list: readonly T[], rand: () => number): T {
  const index = Math.floor(rand() * list.length);
  return list[index] ?? list[0]!;
}

function poolForDifficulty(difficulty: Difficulty): readonly string[] {
  switch (difficulty) {
    case "easy":
      return EASY_WORDS;
    case "normal":
      return NORMAL_WORDS;
    case "hard":
      return HARD_WORDS;
    case "expert":
      return EXPERT_WORDS;
    case "custom":
      return [...NORMAL_WORDS, ...HARD_WORDS];
    default: {
      const _exhaustive: never = difficulty;
      return _exhaustive;
    }
  }
}

function poolForCategory(category: WordCategory): readonly string[] {
  switch (category) {
    case "common":
      return NORMAL_WORDS;
    case "programming":
      return PROGRAMMING_WORDS;
    case "fantasy":
      return FANTASY_WORDS;
    case "scifi":
      return SCIFI_WORDS;
    case "gaming":
      return GAMING_WORDS;
    case "quotes":
      return QUOTES;
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

const PUNCTUATION = [",", ".", "?", "!", ";"] as const;

function decorateWord(word: string, settings: GameSettings, rand: () => number): string {
  let next = word;
  if (settings.capitalization && rand() < 0.22) {
    next = next.charAt(0).toUpperCase() + next.slice(1);
  }
  if (settings.punctuation && rand() < 0.18) {
    next += pick(PUNCTUATION, rand);
  }
  return next;
}

function maybeNumber(settings: GameSettings, rand: () => number): string | null {
  if (!settings.numbers || rand() > 0.08) return null;
  return String(Math.floor(rand() * 1000));
}

function wordsFromPool(
  pool: readonly string[],
  settings: GameSettings,
  count: number,
  rand: () => number,
): string[] {
  const filtered = pool.filter((word) => {
    if (settings.difficulty !== "custom") return true;
    return (
      word.length >= settings.minWordLength && word.length <= settings.maxWordLength
    );
  });
  const source = filtered.length > 0 ? filtered : pool;
  const words: string[] = [];

  while (words.length < count) {
    const number = maybeNumber(settings, rand);
    if (number) {
      words.push(number);
      continue;
    }
    words.push(decorateWord(pick(source, rand), settings, rand));
  }

  return words;
}

function splitText(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

export function generateWords(settings: GameSettings, seed: number): string[] {
  const rand = mulberry32(seed);
  const count = Math.max(20, settings.wordCount);

  if (settings.textMode === "custom" && settings.customText.trim().length > 0) {
    const custom = splitText(settings.customText);
    if (custom.length === 0) {
      return wordsFromPool(poolForDifficulty(settings.difficulty), settings, count, rand);
    }
    const words: string[] = [];
    while (words.length < Math.max(count, custom.length)) {
      words.push(...custom);
    }
    return words.slice(0, Math.max(count, custom.length));
  }

  const mode: TextMode =
    settings.textMode === "random"
      ? pick(["words", "sentences", "quotes"] as const, rand)
      : settings.textMode;

  if (mode === "quotes") {
    const quote = pick(QUOTES, rand);
    return splitText(quote);
  }

  if (mode === "sentences") {
    const words: string[] = [];
    while (words.length < count) {
      words.push(...splitText(pick(SENTENCES, rand)));
    }
    return words.slice(0, count);
  }

  if (settings.category !== "common" && settings.difficulty !== "custom") {
    return wordsFromPool(poolForCategory(settings.category), settings, count, rand);
  }

  return wordsFromPool(poolForDifficulty(settings.difficulty), settings, count, rand);
}

export function moreWords(
  settings: GameSettings,
  seed: number,
  offset: number,
  count = 40,
): string[] {
  return generateWords(
    { ...settings, wordCount: offset + count },
    seed,
  ).slice(offset, offset + count);
}

export function effectiveDuration(settings: GameSettings): number {
  if (settings.mode === "endless" || settings.mode === "boss") return 0;
  if (settings.duration < 0) return Math.max(5, settings.customDuration);
  return settings.duration;
}
