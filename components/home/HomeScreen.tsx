"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { getStatistics } from "@/lib/db/stats";
import { modeLabel } from "@/lib/format";
import type { Statistics } from "@/types/game";
import type { GameMode } from "@/types/settings";

const modes: Array<{ id: GameMode; label: string; blurb: string }> = [
  { id: "classic", label: "Classic", blurb: "30s speed trial" },
  { id: "timeAttack", label: "Time Attack", blurb: "Max damage" },
  { id: "endless", label: "Endless", blurb: "Survive the waves" },
  { id: "boss", label: "Boss Fight", blurb: "Kill it fast" },
];

export function HomeScreen() {
  const { settings, update } = useSettings();
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    void getStatistics().then(setStats);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-4 py-12">
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-mint">Arcade typing combat</p>
        <h1 className="mt-4 font-display text-5xl leading-none tracking-[0.12em] sm:text-7xl">
          TYPE.
          <br />
          <span className="text-mint">FIGHT.</span>
          <br />
          MASTER.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-fog">
          A typing speed game where every word is an attack. Faster, cleaner
          input hits harder. Mistakes break your combo and your ribs.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/play">
            <Button className="min-w-48 px-8 py-3 text-base">Start fight</Button>
          </Link>
          <Link href="/stats">
            <Button variant="ghost" className="min-w-40 py-3">
              View stats
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <HeroStat label="Best WPM" value={stats ? stats.bestWpm.toFixed(0) : "—"} />
        <HeroStat
          label="Accuracy"
          value={stats ? `${stats.bestAccuracy.toFixed(0)}%` : "—"}
        />
        <HeroStat
          label="Max Combo"
          value={stats ? `x${stats.highestCombo}` : "—"}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.22em] text-fog">Quick match</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => update({ mode: mode.id, duration: mode.id === "classic" ? 30 : settings.duration })}
              className={`rounded-xl border px-4 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint ${
                settings.mode === mode.id
                  ? "border-mint bg-mint/10"
                  : "border-line hover:border-mint/40"
              }`}
            >
              <div className="font-display tracking-wide">{mode.label}</div>
              <div className="mt-1 text-sm text-fog">{mode.blurb}</div>
            </button>
          ))}
        </div>
      </section>

      {stats?.lastRun ? (
        <p className="text-center text-sm text-fog">
          Last run: {stats.lastRun.wpm.toFixed(0)} WPM · {stats.lastRun.accuracy.toFixed(0)}% ·{" "}
          {modeLabel(stats.lastRun.mode)}
        </p>
      ) : (
        <p className="text-center text-sm text-fog">No fights yet. The dummy is waiting.</p>
      )}
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-panel/70 px-5 py-6 text-center">
      <div className="font-display text-4xl text-mint">{value}</div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-fog">{label}</div>
    </div>
  );
}
