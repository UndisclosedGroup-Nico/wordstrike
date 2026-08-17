import { describe, expect, it } from "vitest";
import { MONSTERS, monsterForWave } from "./monsters";

describe("monsterForWave", () => {
  it("cycles the roster as waves advance", () => {
    expect(monsterForWave(1, false).id).toBe("skeleton");
    expect(monsterForWave(2, false).id).toBe("mushroom");
    expect(monsterForWave(3, false).id).toBe("goblin");
    expect(monsterForWave(4, false).id).toBe("flying-eye");
    expect(monsterForWave(5, false).id).toBe("skeleton");
    expect(monsterForWave(MONSTERS.length + 2, false).id).toBe("mushroom");
  });

  it("uses the last monster as the boss", () => {
    expect(monsterForWave(1, true).id).toBe("flying-eye");
  });
});
