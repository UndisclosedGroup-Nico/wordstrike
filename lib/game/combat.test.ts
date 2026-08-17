import { describe, expect, it } from "vitest";
import {
  accuracyMultiplier,
  applyDamageToEnemy,
  calcWordDamage,
  enemyMaxHp,
} from "./combat";

describe("combat", () => {
  it("applies the documented accuracy bands", () => {
    expect(accuracyMultiplier(97)).toBe(1.5);
    expect(accuracyMultiplier(92)).toBe(1.25);
    expect(accuracyMultiplier(85)).toBe(1);
    expect(accuracyMultiplier(75)).toBe(0.8);
    expect(accuracyMultiplier(40)).toBe(0.6);
  });

  it("scales damage with word length and combo", () => {
    const short = calcWordDamage(3, 100, 0);
    const long = calcWordDamage(8, 100, 0);
    const combo = calcWordDamage(8, 100, 20);
    expect(long).toBeGreaterThan(short);
    expect(combo).toBeGreaterThan(long);
  });

  it("carries overflow damage into the next wave", () => {
    const result = applyDamageToEnemy(10, 100, 1, 40, "classic", "normal");
    expect(result.overflowKills).toBe(1);
    expect(result.wave).toBe(2);
    expect(result.enemyHp).toBeLessThan(result.enemyMaxHp);
  });

  it("defeats a boss without spawning another", () => {
    const max = enemyMaxHp("boss", "normal", 1);
    const result = applyDamageToEnemy(max, max, 1, max, "boss", "normal");
    expect(result.defeatedBoss).toBe(true);
    expect(result.enemyHp).toBe(0);
    expect(result.wave).toBe(1);
  });
});
