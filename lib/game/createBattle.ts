import { enemyMaxHp, playerMaxHp } from "@/lib/game/combat";
import { effectiveDuration, generateWords } from "@/lib/typing/textGenerator";
import type { BattleState } from "@/types/game";
import type { GameSettings } from "@/types/settings";

export function createBattleState(
  settings: GameSettings,
  seed: number,
  now = Date.now(),
): BattleState {
  const words = generateWords(
    {
      ...settings,
      wordCount: settings.mode === "boss" ? 160 : Math.max(settings.wordCount, 80),
    },
    seed,
  );
  const maxHp = playerMaxHp(settings.difficulty);
  const foeHp = enemyMaxHp(settings.mode, settings.difficulty, 1);

  return {
    status: "idle",
    words,
    wordIndex: 0,
    currentTyped: "",
    history: [],
    correctCharacters: 0,
    incorrectCharacters: 0,
    startedAt: null,
    endedAt: null,
    now,
    combo: 0,
    maxCombo: 0,
    damageDealt: 0,
    playerHp: maxHp,
    playerMaxHp: maxHp,
    enemyHp: foeHp,
    enemyMaxHp: foeHp,
    wave: 1,
    lastHit: null,
    floats: [],
    shakeUntil: 0,
    attackUntil: 0,
    hitUntil: 0,
    errorUntil: 0,
    enemyDefeated: false,
    seed,
    settings: {
      ...settings,
      duration: effectiveDuration(settings),
    },
  };
}

export function nextSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647) + 1;
}
