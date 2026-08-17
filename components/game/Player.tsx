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
      className={`relative flex h-44 w-40 items-end justify-center ${
        !reducedMotion && attacking ? "animate-lunge" : ""
      } ${!reducedMotion && hurt ? "animate-hit" : ""}`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute bottom-1 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-mint/25 blur-[3px]" />
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
