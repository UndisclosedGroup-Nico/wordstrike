export interface TypingMetrics {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsedMs: number;
  remainingMs: number | null;
}

export type TypingEvent =
  | { type: "ignored" }
  | { type: "char"; correct: boolean }
  | { type: "backspace" }
  | { type: "word"; perfect: boolean; target: string; typed: string };
