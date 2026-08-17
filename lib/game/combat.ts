import type { Difficulty, GameMode } from "@/types/settings";

export function accuracyMultiplier(accuracy: number): number {
  if (accuracy >= 95) return 1.5;
  if (accuracy >= 90) return 1.25;
  if (accuracy >= 80) return 1.0;
  if (accuracy >= 70) return 0.8;
  return 0.6;
}

export function comboMultiplier(combo: number): number {
  return 1 + Math.min(combo, 50) * 0.04;
}

export function calcWordDamage(
  wordLength: number,
  accuracy: number,
  combo: number,
): number {
  const base = Math.max(1, wordLength) * 4;
  return Math.max(
    1,
    Math.round(base * accuracyMultiplier(accuracy) * comboMultiplier(combo)),
  );
}

export function playerMaxHp(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 120;
    case "normal":
      return 100;
    case "hard":
      return 75;
    case "expert":
      return 55;
    case "custom":
      return 100;
    default: {
      const _exhaustive: never = difficulty;
      return _exhaustive;
    }
  }
}

export function mistakeDamage(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 6;
    case "normal":
      return 10;
    case "hard":
      return 14;
    case "expert":
      return 18;
    case "custom":
      return 10;
    default: {
      const _exhaustive: never = difficulty;
      return _exhaustive;
    }
  }
}

export function enemyMaxHp(
  mode: GameMode,
  difficulty: Difficulty,
  wave: number,
): number {
  const base = (() => {
    switch (difficulty) {
      case "easy":
        return 70;
      case "normal":
        return 100;
      case "hard":
        return 140;
      case "expert":
        return 180;
      case "custom":
        return 100;
      default: {
        const _exhaustive: never = difficulty;
        return _exhaustive;
      }
    }
  })();

  if (mode === "boss") {
    return base * 12;
  }

  const safeWave = Math.max(1, wave);
  if (mode === "endless") {
    return Math.round(base * 1.18 ** (safeWave - 1));
  }

  return Math.round(base * (1 + (safeWave - 1) * 0.15));
}

export function applyDamageToEnemy(
  currentHp: number,
  currentMax: number,
  wave: number,
  damage: number,
  mode: GameMode,
  difficulty: Difficulty,
): {
  enemyHp: number;
  enemyMaxHp: number;
  wave: number;
  overflowKills: number;
  defeatedBoss: boolean;
} {
  let hp = currentHp;
  let max = currentMax;
  let nextWave = wave;
  let remaining = damage;
  let overflowKills = 0;

  if (mode === "boss") {
    const nextHp = Math.max(0, hp - remaining);
    return {
      enemyHp: nextHp,
      enemyMaxHp: max,
      wave: nextWave,
      overflowKills: nextHp === 0 ? 1 : 0,
      defeatedBoss: nextHp === 0,
    };
  }

  while (remaining > 0) {
    if (remaining >= hp) {
      remaining -= hp;
      overflowKills += 1;
      nextWave += 1;
      max = enemyMaxHp(mode, difficulty, nextWave);
      hp = max;
    } else {
      hp -= remaining;
      remaining = 0;
    }
  }

  return {
    enemyHp: hp,
    enemyMaxHp: max,
    wave: nextWave,
    overflowKills,
    defeatedBoss: false,
  };
}

export function isCrit(combo: number, accuracy: number): boolean {
  return combo >= 10 && accuracy >= 95;
}
