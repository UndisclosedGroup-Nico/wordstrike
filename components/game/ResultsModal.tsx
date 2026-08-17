"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { modeLabel } from "@/lib/format";
import type { GameResult } from "@/types/game";

interface ResultsModalProps {
  result: GameResult | null;
  personalBests: string[];
  onAgain: () => void;
}

export function ResultsModal({ result, personalBests, onAgain }: ResultsModalProps) {
  if (!result) return null;

  const title = result.enemyDefeated
    ? "BOSS DOWN"
    : result.playerHpRemaining <= 0
      ? "YOU FELL"
      : "RUN COMPLETE";

  return (
    <Modal open title={title}>
      <div className="space-y-5">
        <div className="text-center">
          <p className="font-display text-5xl text-mint">{result.wpm.toFixed(0)} WPM</p>
          <p className="mt-1 text-fog">{result.accuracy.toFixed(1)}% accuracy</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-fog">
            {modeLabel(result.mode)} · {result.difficulty}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Score" value={result.score.toLocaleString()} />
          <Stat label="Max Combo" value={`x${result.maxCombo}`} />
          <Stat label="Damage" value={result.damageDealt.toLocaleString()} />
          <Stat label="Characters" value={String(result.correctCharacters)} />
        </div>
        {personalBests.length > 0 ? (
          <p className="rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-center text-sm text-gold">
            New personal best: {personalBests.join(" · ")}
          </p>
        ) : null}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={onAgain}>
            Play again
          </Button>
          <Link href="/settings" className="flex-1">
            <Button variant="ghost" className="w-full">
              Settings
            </Button>
          </Link>
          <Link href="/stats" className="flex-1">
            <Button variant="ghost" className="w-full">
              Stats
            </Button>
          </Link>
        </div>
        <p className="text-center text-xs text-fog">Enter to restart · Tab anytime</p>
      </div>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-ink/60 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.18em] text-fog">{label}</div>
      <div className="font-display text-xl">{value}</div>
    </div>
  );
}
