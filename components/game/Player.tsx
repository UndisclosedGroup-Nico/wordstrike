"use client";

import { SamuraiSprite } from "@/components/game/SamuraiSprite";

interface PlayerProps {
  attacking: boolean;
  hurt: boolean;
  dead: boolean;
  attackToken: number;
  hurtToken: number;
  reducedMotion: boolean;
}

export function Player({
  attacking,
  hurt,
  dead,
  attackToken,
  hurtToken,
  reducedMotion,
}: PlayerProps) {
  return (
    <div
      className={`relative flex size-[min(25vw,36vh)] items-end justify-center ${
        !reducedMotion && attacking ? "animate-lunge" : ""
      } ${!reducedMotion && hurt ? "animate-hit" : ""}`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute -bottom-[18%] left-1/2 h-[6%] w-2/5 -translate-x-1/2 rounded-full bg-mint/25 blur-[6px]" />
      <SamuraiSprite
        attacking={attacking}
        hurt={hurt}
        dead={dead}
        attackToken={attackToken}
        hurtToken={hurtToken}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
