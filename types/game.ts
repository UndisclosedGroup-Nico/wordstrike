import type { Difficulty, GameMode, GameSettings } from "./settings";

export type GameStatus = "idle" | "countdown" | "playing" | "finished" | "paused";

export interface GameResult {
  id: string;
  timestamp: number;
  mode: GameMode;
  difficulty: Difficulty;
  duration: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctCharacters: number;
  incorrectCharacters: number;
  wordsCompleted: number;
  damageDealt: number;
  maxCombo: number;
  score: number;
  text: string;
  settings: GameSettings;
  playerHpRemaining: number;
  enemyDefeated: boolean;
  survivalTime: number;
  wavesCleared: number;
}

export interface Statistics {
  totalGames: number;
  bestWpm: number;
  bestAccuracy: number;
  highestScore: number;
  highestCombo: number;
  mostDamage: number;
  averageWpm: number;
  averageAccuracy: number;
  lastRun: GameResult | null;
}

export interface WordAttempt {
  target: string;
  typed: string;
  perfect: boolean;
}

export interface FloatingNumber {
  id: number;
  value: number;
  kind: "hit" | "crit" | "hurt";
  createdAt: number;
}

export interface BattleState {
  status: GameStatus;
  words: string[];
  wordIndex: number;
  currentTyped: string;
  history: WordAttempt[];
  correctCharacters: number;
  incorrectCharacters: number;
  startedAt: number | null;
  endedAt: number | null;
  now: number;
  combo: number;
  maxCombo: number;
  damageDealt: number;
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  wave: number;
  lastHit: FloatingNumber | null;
  floats: FloatingNumber[];
  shakeUntil: number;
  attackUntil: number;
  hitUntil: number;
  errorUntil: number;
  enemyDefeated: boolean;
  seed: number;
  settings: GameSettings;
}

export type LeaderboardMetric =
  | "wpm"
  | "score"
  | "accuracy"
  | "maxCombo"
  | "damageDealt";
