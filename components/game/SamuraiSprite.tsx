"use client";

import { useEffect, useRef, useState } from "react";

type Clip = "idle" | "attack" | "hurt" | "death";

interface ClipSpec {
  src: string;
  frames: number;
  fps: number;
  loop: boolean;
}

const FRAME = 200;
const CROP = { x: 42, y: 50, w: 148, h: 146 };

const CLIPS: Record<Clip, ClipSpec> = {
  idle: {
    src: "/assets/characters/samurai/Idle.png",
    frames: 8,
    fps: 10,
    loop: true,
  },
  attack: {
    src: "/assets/characters/samurai/Attack1.png",
    frames: 6,
    fps: 12,
    loop: false,
  },
  hurt: {
    src: "/assets/characters/samurai/TakeHit.png",
    frames: 4,
    fps: 11,
    loop: false,
  },
  death: {
    src: "/assets/characters/samurai/Death.png",
    frames: 6,
    fps: 8,
    loop: false,
  },
};

const ATTACK_SHEETS = [
  "/assets/characters/samurai/Attack1.png",
  "/assets/characters/samurai/Attack2.png",
] as const;

function specFor(clip: Clip): ClipSpec {
  switch (clip) {
    case "idle":
    case "attack":
    case "hurt":
    case "death":
      return CLIPS[clip];
    default: {
      const _never: never = clip;
      return _never;
    }
  }
}

interface SamuraiSpriteProps {
  attacking: boolean;
  hurt: boolean;
  dead: boolean;
  attackToken: number;
  hurtToken: number;
  reducedMotion: boolean;
}

export function SamuraiSprite({
  attacking,
  hurt,
  dead,
  attackToken,
  hurtToken,
  reducedMotion,
}: SamuraiSpriteProps) {
  const [clip, setClip] = useState<Clip>("idle");
  const [frame, setFrame] = useState(0);
  const [attackSrc, setAttackSrc] = useState<string>(ATTACK_SHEETS[0]);
  const attackCount = useRef(0);

  useEffect(() => {
    if (dead) {
      setClip("death");
      setFrame(0);
      return;
    }
    setClip("idle");
    setFrame(0);
  }, [dead]);

  useEffect(() => {
    if (dead || hurtToken <= 0) return;
    setClip("hurt");
    setFrame(0);
  }, [hurtToken, dead]);

  useEffect(() => {
    if (dead || attackToken <= 0) return;
    attackCount.current += 1;
    setAttackSrc(ATTACK_SHEETS[attackCount.current % 2]);
    setClip("attack");
    setFrame(0);
  }, [attackToken, dead]);

  useEffect(() => {
    if (reducedMotion) {
      setFrame(0);
      return;
    }
    const spec = specFor(clip);
    const id = window.setInterval(() => {
      setFrame((current) => {
        if (current + 1 < spec.frames) return current + 1;
        return spec.loop ? 0 : current;
      });
    }, Math.round(1000 / spec.fps));
    return () => window.clearInterval(id);
  }, [clip, reducedMotion]);

  useEffect(() => {
    if (clip === "death" || specFor(clip).loop) return;
    const spec = specFor(clip);
    if (frame < spec.frames - 1) return;
    const id = window.setTimeout(() => {
      setClip("idle");
      setFrame(0);
    }, 70);
    return () => window.clearTimeout(id);
  }, [clip, frame]);

  const activeClip = reducedMotion
    ? dead
      ? "death"
      : hurt
        ? "hurt"
        : attacking
          ? "attack"
          : "idle"
    : clip;
  const spec = specFor(activeClip);
  const sheet = activeClip === "attack" ? attackSrc : spec.src;
  const shownFrame = reducedMotion ? 0 : frame;

  return (
    <div className="relative h-full w-full [container-type:size]" aria-hidden="true">
      <div
        className="absolute bottom-0 left-1/2 origin-bottom"
        style={{
          width: CROP.w,
          height: CROP.h,
          transform: `translateX(-50%) scale(calc(100cqmin / ${CROP.w}px))`,
          backgroundImage: `url("${sheet}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${spec.frames * FRAME}px ${FRAME}px`,
          backgroundPosition: `${-(shownFrame * FRAME + CROP.x)}px ${-CROP.y}px`,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
