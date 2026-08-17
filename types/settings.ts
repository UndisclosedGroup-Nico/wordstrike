export type GameMode = "classic" | "timeAttack" | "endless" | "boss";
export type Difficulty = "easy" | "normal" | "hard" | "expert" | "custom";
export type TextMode = "words" | "sentences" | "quotes" | "random" | "custom";
export type BackspaceMode = "on" | "off" | "word";
export type ThemeId = "void" | "ember" | "ion";
export type WordCategory =
  | "common"
  | "quotes"
  | "programming"
  | "fantasy"
  | "scifi"
  | "gaming";
export type UiDensity = "comfortable" | "compact";
export type AnimationIntensity = "low" | "medium" | "high";

export interface GameSettings {
  mode: GameMode;
  duration: number;
  customDuration: number;
  difficulty: Difficulty;
  textMode: TextMode;
  customText: string;
  wordCount: number;
  minWordLength: number;
  maxWordLength: number;
  punctuation: boolean;
  numbers: boolean;
  capitalization: boolean;
  category: WordCategory;
  soundEnabled: boolean;
  volume: number;
  animationsEnabled: boolean;
  screenShake: boolean;
  damageNumbers: boolean;
  comboEffects: boolean;
  reducedMotion: boolean;
  theme: ThemeId;
  uiDensity: UiDensity;
  backspace: BackspaceMode;
  animationIntensity: AnimationIntensity;
}

export const DEFAULT_SETTINGS: GameSettings = {
  mode: "classic",
  duration: 30,
  customDuration: 45,
  difficulty: "normal",
  textMode: "words",
  customText: "",
  wordCount: 80,
  minWordLength: 3,
  maxWordLength: 8,
  punctuation: false,
  numbers: false,
  capitalization: false,
  category: "common",
  soundEnabled: false,
  volume: 0.45,
  animationsEnabled: true,
  screenShake: true,
  damageNumbers: true,
  comboEffects: true,
  reducedMotion: false,
  theme: "void",
  uiDensity: "comfortable",
  backspace: "on",
  animationIntensity: "medium",
};
