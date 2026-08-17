import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/types/settings";
import { createBattleState } from "./createBattle";
import { battleReducer, liveMetrics, toGameResult } from "./reducer";

function typeWord(state: ReturnType<typeof createBattleState>, word: string, now: number) {
  let next = state;
  for (const char of word) {
    next = battleReducer(next, { type: "KEY", key: char, now });
  }
  return battleReducer(next, { type: "KEY", key: " ", now });
}

describe("battle reducer", () => {
  it("stays idle until the first real character", () => {
    const state = createBattleState(DEFAULT_SETTINGS, 1, 1000);
    const spaced = battleReducer(state, { type: "KEY", key: " ", now: 1001 });
    expect(spaced.status).toBe("idle");
  });

  it("starts on the first character and attacks on a perfect word", () => {
    const state = createBattleState(DEFAULT_SETTINGS, 7, 1000);
    const word = state.words[0] ?? "the";
    const after = typeWord(state, word, 1500);
    expect(after.status).toBe("playing");
    expect(after.history[0]?.perfect).toBe(true);
    expect(after.combo).toBe(1);
    expect(after.damageDealt).toBeGreaterThan(0);
    expect(after.enemyHp).toBeLessThan(state.enemyHp);
  });

  it("breaks combo and damages the player on a bad word", () => {
    const started = battleReducer(
      createBattleState(DEFAULT_SETTINGS, 3, 1000),
      { type: "KEY", key: "z", now: 1100 },
    );
    const finished = battleReducer(started, { type: "KEY", key: " ", now: 1200 });
    expect(finished.combo).toBe(0);
    expect(finished.playerHp).toBeLessThan(started.playerHp);
  });

  it("supports backspace inside the current word", () => {
    let state = createBattleState(DEFAULT_SETTINGS, 4, 1000);
    const word = state.words[0] ?? "the";
    state = battleReducer(state, { type: "KEY", key: word[0] ?? "t", now: 1100 });
    state = battleReducer(state, { type: "KEY", key: "x", now: 1101 });
    state = battleReducer(state, { type: "KEY", key: "Backspace", now: 1102 });
    expect(state.currentTyped).toBe(word[0] ?? "t");
  });

  it("finishes when the timer expires", () => {
    const settings = { ...DEFAULT_SETTINGS, duration: 1, mode: "classic" as const };
    let state = createBattleState(settings, 9, 0);
    state = battleReducer(state, { type: "KEY", key: "a", now: 10 });
    state = battleReducer(state, { type: "TICK", now: 1200 });
    expect(state.status).toBe("finished");
    const result = toGameResult(state);
    expect(result.duration).toBeGreaterThan(0);
    expect(liveMetrics(state).remainingMs).toBe(0);
  });

  it("does not start a second timer after finish", () => {
    const settings = { ...DEFAULT_SETTINGS, duration: 1 };
    let state = createBattleState(settings, 2, 0);
    state = battleReducer(state, { type: "KEY", key: "a", now: 1 });
    state = battleReducer(state, { type: "FINISH", now: 20 });
    const again = battleReducer(state, { type: "TICK", now: 5000 });
    expect(again.status).toBe("finished");
    expect(again.endedAt).toBe(20);
  });
});
