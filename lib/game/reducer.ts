import {
  applyDamageToEnemy,
  calcWordDamage,
  isCrit,
  mistakeDamage,
} from "@/lib/game/combat";
import { createBattleState } from "@/lib/game/createBattle";
import { calcScore } from "@/lib/game/scoring";
import {
  calcAccuracy,
  calcRawWpm,
  calcWpm,
  recountCharacters,
  roundStat,
} from "@/lib/typing/metrics";
import { moreWords } from "@/lib/typing/textGenerator";
import type { BattleState, GameResult, WordAttempt } from "@/types/game";
import type { GameSettings } from "@/types/settings";

export type BattleAction =
  | { type: "BOOT"; settings: GameSettings; seed: number; now: number }
  | { type: "KEY"; key: string; now: number }
  | { type: "TICK"; now: number }
  | { type: "PAUSE" }
  | { type: "RESUME"; now: number }
  | { type: "FINISH"; now: number }
  | { type: "RESTART"; settings: GameSettings; seed: number; now: number };

let floatId = 1;

function pruneFloats(state: BattleState, now: number): BattleState["floats"] {
  return state.floats.filter((item) => now - item.createdAt < 900);
}

function withCounts(state: BattleState): BattleState {
  const current = state.words[state.wordIndex] ?? "";
  const counted = recountCharacters(state.history, current, state.currentTyped);
  return {
    ...state,
    correctCharacters: counted.correct,
    incorrectCharacters: counted.incorrect,
  };
}

function elapsedMs(state: BattleState): number {
  if (state.startedAt === null) return 0;
  const end = state.endedAt ?? state.now;
  return Math.max(0, end - state.startedAt);
}

function remainingMs(state: BattleState): number | null {
  if (state.settings.duration <= 0) return null;
  return Math.max(0, state.settings.duration * 1000 - elapsedMs(state));
}

function shouldFinish(state: BattleState): boolean {
  if (state.playerHp <= 0) return true;
  if (state.settings.mode === "boss" && state.enemyDefeated) return true;
  const remaining = remainingMs(state);
  return remaining !== null && remaining <= 0;
}

function finish(state: BattleState, now: number): BattleState {
  if (state.status === "finished") return state;
  return {
    ...state,
    status: "finished",
    now,
    endedAt: now,
    currentTyped: state.currentTyped,
  };
}

function ensureWords(state: BattleState): BattleState {
  if (state.wordIndex < state.words.length - 16) return state;
  const extra = moreWords(state.settings, state.seed, state.words.length, 40);
  return { ...state, words: [...state.words, ...extra] };
}

function applyWord(state: BattleState, now: number): BattleState {
  const target = state.words[state.wordIndex] ?? "";
  const typed = state.currentTyped;
  const perfect = typed === target && target.length > 0;
  const attempt: WordAttempt = { target, typed, perfect };
  const history = [...state.history, attempt];
  const counted = recountCharacters(history, "", "");
  const accuracy = calcAccuracy(counted.correct, counted.incorrect);

  let next: BattleState = {
    ...state,
    history,
    wordIndex: state.wordIndex + 1,
    currentTyped: "",
    correctCharacters: counted.correct,
    incorrectCharacters: counted.incorrect,
    now,
  };

  if (perfect) {
    const combo = state.combo + 1;
    const damage = calcWordDamage(target.length, accuracy, combo);
    const crit = isCrit(combo, accuracy);
    const applied = applyDamageToEnemy(
      state.enemyHp,
      state.enemyMaxHp,
      state.wave,
      damage,
      state.settings.mode,
      state.settings.difficulty,
    );
    const float = {
      id: floatId++,
      value: damage,
      kind: crit ? ("crit" as const) : ("hit" as const),
      createdAt: now,
    };
    next = {
      ...next,
      combo,
      maxCombo: Math.max(state.maxCombo, combo),
      damageDealt: state.damageDealt + damage,
      enemyHp: applied.enemyHp,
      enemyMaxHp: applied.enemyMaxHp,
      wave: applied.wave,
      enemyDefeated: applied.defeatedBoss || state.enemyDefeated,
      lastHit: float,
      floats: [...pruneFloats(state, now), float],
      attackUntil: now + 180,
      hitUntil: now + 220,
    };
  } else {
    const hurt = mistakeDamage(state.settings.difficulty);
    const float = {
      id: floatId++,
      value: hurt,
      kind: "hurt" as const,
      createdAt: now,
    };
    next = {
      ...next,
      combo: 0,
      playerHp: Math.max(0, state.playerHp - hurt),
      lastHit: float,
      floats: [...pruneFloats(state, now), float],
      shakeUntil: now + 180,
      errorUntil: now + 220,
    };
  }

  next = ensureWords(next);
  if (shouldFinish(next)) return finish(next, now);
  return next;
}

function applyChar(state: BattleState, key: string, now: number): BattleState {
  const target = state.words[state.wordIndex] ?? "";
  const nextTyped = state.currentTyped + key;
  const expected = target[state.currentTyped.length];
  const correct = expected !== undefined && key === expected;
  let next: BattleState = {
    ...state,
    currentTyped: nextTyped,
    now,
  };

  if (!correct) {
    next = {
      ...next,
      combo: 0,
      shakeUntil: now + 120,
      errorUntil: now + 160,
    };
  }

  return withCounts(next);
}

function applyBackspace(state: BattleState, now: number): BattleState {
  const mode = state.settings.backspace;
  if (mode === "off") return state;
  if (state.currentTyped.length === 0) return state;

  if (mode === "word") {
    return withCounts({ ...state, currentTyped: "", now });
  }

  return withCounts({
    ...state,
    currentTyped: state.currentTyped.slice(0, -1),
    now,
  });
}

function beginIfNeeded(state: BattleState, now: number): BattleState {
  if (state.status === "playing") return { ...state, now };
  if (state.status !== "idle" && state.status !== "countdown") return state;
  return {
    ...state,
    status: "playing",
    startedAt: now,
    now,
  };
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case "BOOT":
    case "RESTART":
      return createBattleState(action.settings, action.seed, action.now);
    case "PAUSE":
      if (state.status !== "playing") return state;
      return { ...state, status: "paused" };
    case "RESUME":
      if (state.status !== "paused") return state;
      return { ...state, status: "playing", now: action.now };
    case "FINISH":
      return finish(state, action.now);
    case "TICK": {
      if (state.status !== "playing") return { ...state, now: action.now };
      const next = {
        ...state,
        now: action.now,
        floats: pruneFloats(state, action.now),
      };
      if (shouldFinish(next)) return finish(next, action.now);
      return next;
    }
    case "KEY": {
      if (state.status === "finished" || state.status === "paused") return state;
      const key = action.key;
      if (key === "Tab" || key === "Escape") return state;
      if (key === "Backspace") {
        const live = beginIfNeeded(state, action.now);
        return applyBackspace(live, action.now);
      }
      if (key === " ") {
        if (state.currentTyped.length === 0 && state.status === "idle") {
          return state;
        }
        const live = beginIfNeeded(state, action.now);
        if (live.currentTyped.length === 0) return live;
        return applyWord(live, action.now);
      }
      if (key.length !== 1) return state;
      const live = beginIfNeeded(state, action.now);
      return applyChar(live, key, action.now);
    }
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export function liveMetrics(state: BattleState) {
  const elapsed = elapsedMs(state);
  return {
    wpm: roundStat(calcWpm(state.correctCharacters, elapsed)),
    rawWpm: roundStat(
      calcRawWpm(state.correctCharacters, state.incorrectCharacters, elapsed),
    ),
    accuracy: roundStat(
      calcAccuracy(state.correctCharacters, state.incorrectCharacters),
    ),
    elapsedMs: elapsed,
    remainingMs: remainingMs(state),
  };
}

export function toGameResult(state: BattleState): GameResult {
  const metrics = liveMetrics(state);
  const duration = metrics.elapsedMs / 1000;
  return {
    id: `${state.seed}-${state.endedAt ?? state.now}`,
    timestamp: state.endedAt ?? state.now,
    mode: state.settings.mode,
    difficulty: state.settings.difficulty,
    duration,
    wpm: metrics.wpm,
    rawWpm: metrics.rawWpm,
    accuracy: metrics.accuracy,
    correctCharacters: state.correctCharacters,
    incorrectCharacters: state.incorrectCharacters,
    wordsCompleted: state.history.length,
    damageDealt: state.damageDealt,
    maxCombo: state.maxCombo,
    score: calcScore({
      wpm: metrics.wpm,
      accuracy: metrics.accuracy,
      damageDealt: state.damageDealt,
      maxCombo: state.maxCombo,
      difficulty: state.settings.difficulty,
      mode: state.settings.mode,
    }),
    text: state.history.map((item) => item.target).join(" "),
    settings: state.settings,
    playerHpRemaining: state.playerHp,
    enemyDefeated: state.enemyDefeated,
    survivalTime: duration,
    wavesCleared: Math.max(0, state.wave - 1),
  };
}
