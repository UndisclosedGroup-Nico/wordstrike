"use client";

import { MonsterSprite } from "@/components/game/MonsterSprite";
import { monsterForWave } from "@/lib/game/monsters";

interface EnemyProps {
  hit: boolean;
  attacking: boolean;
  defeated: boolean;
  boss: boolean;
  wave: number;
  hitToken: number;
  attackToken: number;
  reducedMotion: boolean;
}

export function Enemy({
  hit,
  attacking,
  defeated,
  boss,
  wave,
  hitToken,
  attackToken,
  reducedMotion,
}: EnemyProps) {
  const monster = monsterForWave(wave, boss);
  const size = boss ? "size-[min(28vw,40vh)]" : "size-[min(25vw,36vh)]";

  return (
    <div
      className={`relative flex flex-col items-center justify-end ${size} ${
        defeated
          ? "animate-defeat"
          : !reducedMotion && attacking
            ? "animate-enemy-lunge"
            : hit && reducedMotion
              ? "animate-hit"
              : ""
      }`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute bottom-[4%] left-1/2 h-[6%] w-2/5 -translate-x-1/2 rounded-full bg-rose/25 blur-[6px]" />
      <MonsterSprite
        monster={monster}
        hit={hit}
        attacking={attacking}
        dead={defeated}
        hitToken={hitToken}
        attackToken={attackToken}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
