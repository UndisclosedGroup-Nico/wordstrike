"use client";

import { useEffect, useState } from "react";
import type { MonsterClip, MonsterDef } from "@/lib/game/monsters";

const knockoutCache = new Map<string, string>();

function useKnockoutSheet(src: string, enabled: boolean): string {
  const [url, setUrl] = useState(() => knockoutCache.get(src) ?? src);

  useEffect(() => {
    if (!enabled) {
      setUrl(src);
      return;
    }
    const cached = knockoutCache.get(src);
    if (cached) {
      setUrl(cached);
      return;
    }

    let cancelled = false;
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = pixels.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        if (r <= 10 && g <= 10 && b <= 10) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(pixels, 0, 0);
      const next = canvas.toDataURL("image/png");
      knockoutCache.set(src, next);
      if (!cancelled) setUrl(next);
    };
    return () => {
      cancelled = true;
    };
  }, [src, enabled]);

  return enabled ? url : src;
}

type Clip = "idle" | "attack" | "hurt" | "death";

function specFor(monster: MonsterDef, clip: Clip): MonsterClip {
  switch (clip) {
    case "idle":
      return monster.idle;
    case "attack":
      return monster.attack;
    case "hurt":
      return monster.hurt;
    case "death":
      return monster.death;
    default: {
      const _never: never = clip;
      return _never;
    }
  }
}

interface MonsterSpriteProps {
  monster: MonsterDef;
  hit: boolean;
  attacking: boolean;
  dead: boolean;
  hitToken: number;
  attackToken: number;
  reducedMotion: boolean;
}

export function MonsterSprite({
  monster,
  hit,
  attacking,
  dead,
  hitToken,
  attackToken,
  reducedMotion,
}: MonsterSpriteProps) {
  const [clip, setClip] = useState<Clip>("idle");
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setClip("idle");
    setFrame(0);
  }, [monster.id]);

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
    if (dead || hitToken <= 0) return;
    setClip("hurt");
    setFrame(0);
  }, [hitToken, dead]);

  useEffect(() => {
    if (dead || attackToken <= 0) return;
    setClip("attack");
    setFrame(0);
  }, [attackToken, dead]);

  useEffect(() => {
    if (reducedMotion) {
      setFrame(0);
      return;
    }
    const spec = specFor(monster, clip);
    const id = window.setInterval(() => {
      setFrame((current) => {
        if (current + 1 < spec.frames) return current + 1;
        return spec.loop ? 0 : current;
      });
    }, Math.round(1000 / spec.fps));
    return () => window.clearInterval(id);
  }, [clip, monster, reducedMotion]);

  useEffect(() => {
    if (clip === "death" || specFor(monster, clip).loop) return;
    const spec = specFor(monster, clip);
    if (frame < spec.frames - 1) return;
    const id = window.setTimeout(() => {
      setClip("idle");
      setFrame(0);
    }, 70);
    return () => window.clearTimeout(id);
  }, [clip, frame, monster]);

  const activeClip = reducedMotion
    ? dead
      ? "death"
      : attacking
        ? "attack"
        : hit
          ? "hurt"
          : "idle"
    : clip;
  const spec = specFor(monster, activeClip);
  const shownFrame = reducedMotion ? 0 : frame;
  const sheet = useKnockoutSheet(spec.src, monster.blend === "normal");

  return (
    <div className="relative h-full w-full [container-type:size]" aria-hidden="true">
      <div
        className={`absolute left-1/2 origin-bottom ${
          monster.blend === "lighten" ? "mix-blend-lighten" : ""
        }`}
        style={{
          bottom: `-${monster.ground}%`,
          width: monster.crop.w,
          height: monster.crop.h,
          transform: `translateX(-50%) scaleX(-1) scale(calc(100cqmin / ${monster.scale}px))`,
          backgroundImage: `url("${sheet}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${spec.frames * monster.frame}px ${monster.frame}px`,
          backgroundPosition: `${-(shownFrame * monster.frame + monster.crop.x)}px ${-monster.crop.y}px`,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
