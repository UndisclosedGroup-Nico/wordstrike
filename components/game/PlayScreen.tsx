"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BattleArena } from "@/components/game/BattleArena";
import { ResultsModal } from "@/components/game/ResultsModal";
import { useSettings } from "@/components/providers/SettingsProvider";
import { TypingStats } from "@/components/typing/TypingStats";
import { TypingText } from "@/components/typing/TypingText";
import { Button } from "@/components/ui/Button";
import { getGameResults, saveGameResult } from "@/lib/db/games";
import { playSound } from "@/lib/game/audio";
import { nextSeed } from "@/lib/game/createBattle";
import {
  battleReducer,
  liveMetrics,
  toGameResult,
} from "@/lib/game/reducer";
import { isPersonalBest } from "@/lib/game/scoring";
import { formatTime } from "@/lib/format";
import { createBattleState } from "@/lib/game/createBattle";
import type { GameMode } from "@/types/settings";
import type { GameResult } from "@/types/game";

function isMode(value: string | null): value is GameMode {
  return value === "classic" || value === "timeAttack" || value === "endless" || value === "boss";
}

function isFocusExempt(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("a, button, input, textarea, select, label, [role='button']"));
}

export function PlayScreen() {
  const { settings, update } = useSettings();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const savedId = useRef<string | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [bests, setBests] = useState<string[]>([]);
  const [seed] = useState(nextSeed);
  const [state, dispatch] = useReducer(
    battleReducer,
    undefined,
    () => createBattleState(settings, seed),
  );

  useEffect(() => {
    const mode = params.get("mode");
    const duration = params.get("duration");
    const patch: Partial<typeof settings> = {};
    if (isMode(mode) && mode !== settings.mode) patch.mode = mode;
    if (duration) {
      const parsed = Number(duration);
      if (Number.isFinite(parsed) && parsed > 0) {
        patch.duration = parsed;
      }
    }
    if (Object.keys(patch).length > 0) update(patch);
  }, [params, settings.mode, update]);

  const restart = useCallback(() => {
    savedId.current = null;
    setResult(null);
    setBests([]);
    dispatch({
      type: "RESTART",
      settings,
      seed: nextSeed(),
      now: Date.now(),
    });
    inputRef.current?.focus();
  }, [settings]);

  useEffect(() => {
    if (state.status === "idle") {
      dispatch({ type: "BOOT", settings, seed: state.seed, now: Date.now() });
    }
  }, [settings, state.seed, state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = window.setInterval(() => {
      dispatch({ type: "TICK", now: Date.now() });
    }, 100);
    return () => window.clearInterval(id);
  }, [state.status]);

  useEffect(() => {
    const blockPageScroll = (event: KeyboardEvent) => {
      if (event.key !== " " && event.code !== "Space") return;
      event.preventDefault();
    };
    window.addEventListener("keydown", blockPageScroll, { passive: false });
    return () => window.removeEventListener("keydown", blockPageScroll);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();

    const holdTypingFocus = (event: PointerEvent) => {
      if (isFocusExempt(event.target)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };

    const restoreTypingFocus = () => {
      window.requestAnimationFrame(() => {
        if (isFocusExempt(document.activeElement)) return;
        inputRef.current?.focus();
      });
    };

    document.addEventListener("pointerdown", holdTypingFocus, { capture: true });
    const input = inputRef.current;
    input?.addEventListener("blur", restoreTypingFocus);
    return () => {
      document.removeEventListener("pointerdown", holdTypingFocus, { capture: true });
      input?.removeEventListener("blur", restoreTypingFocus);
    };
  }, []);

  useEffect(() => {
    if (state.status !== "finished" || savedId.current === state.endedAt?.toString()) {
      return;
    }
    const next = toGameResult(state);
    savedId.current = String(state.endedAt);
    setResult(next);
    void (async () => {
      const previous = await getGameResults();
      const marks: string[] = [];
      if (isPersonalBest(next, previous, "wpm")) marks.push("WPM");
      if (isPersonalBest(next, previous, "score")) marks.push("Score");
      if (isPersonalBest(next, previous, "accuracy")) marks.push("Accuracy");
      if (isPersonalBest(next, previous, "maxCombo")) marks.push("Combo");
      if (isPersonalBest(next, previous, "damageDealt")) marks.push("Damage");
      setBests(marks);
      await saveGameResult(next);
      if (settings.soundEnabled) {
        playSound(next.enemyDefeated || marks.length > 0 ? "win" : "finish", settings.volume);
      }
    })();
  }, [settings.soundEnabled, settings.volume, state]);

  const onKey = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Tab" || event.key === "Escape") {
        event.preventDefault();
        restart();
        return;
      }
      if (event.key === "Enter" && state.status === "finished") {
        event.preventDefault();
        restart();
        return;
      }
      if (event.key === " ") {
        event.preventDefault();
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const before = state;
      dispatch({ type: "KEY", key: event.key, now: Date.now() });

      if (!settings.soundEnabled) return;
      if (event.key === "Backspace") return;
      if (event.key === " ") {
        const perfect = before.currentTyped === (before.words[before.wordIndex] ?? "");
        playSound(perfect ? (before.combo + 1 >= 10 ? "crit" : "hit") : "hurt", settings.volume);
        if (perfect && (before.combo + 1 === 5 || before.combo + 1 === 25)) {
          playSound("combo", settings.volume);
        }
        return;
      }
      if (event.key.length === 1) {
        const expected = (before.words[before.wordIndex] ?? "")[before.currentTyped.length];
        playSound(event.key === expected ? "key" : "error", settings.volume);
      }
    },
    [restart, settings.soundEnabled, settings.volume, state],
  );

  const metrics = useMemo(() => liveMetrics(state), [state]);
  const timeLabel =
    metrics.remainingMs === null
      ? formatTime(metrics.elapsedMs)
      : formatTime(metrics.remainingMs);
  const reduced =
    settings.reducedMotion ||
    (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-fog">
        <p>
          {state.settings.mode} · {state.settings.difficulty}
          {state.settings.duration > 0 ? ` · ${state.settings.duration}s` : " · no timer"}
        </p>
        <Button variant="ghost" onClick={restart}>
          Restart
        </Button>
      </div>

      <BattleArena
        state={state}
        reducedMotion={reduced || !settings.animationsEnabled}
      />

      <TypingText
        words={state.words}
        wordIndex={state.wordIndex}
        currentTyped={state.currentTyped}
        history={state.history}
        errorFlash={state.errorUntil > state.now}
      />

      <input
        ref={inputRef}
        autoFocus
        aria-label="Typing input"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="sr-only"
        value=""
        onChange={() => undefined}
        onKeyDown={onKey}
      />

      <TypingStats
        wpm={metrics.wpm}
        accuracy={metrics.accuracy}
        combo={state.combo}
        timeLabel={timeLabel}
        damage={state.damageDealt}
      />

      <p className="text-center text-xs text-fog">
        {state.status === "idle"
          ? "Start typing to fight. Tab or Esc restarts."
          : "Tab / Esc restart."}
      </p>

      <div className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-gold md:hidden">
        Wordstrike is built for a physical keyboard. A phone will work, but the fight is worse.
      </div>

      <ResultsModal result={result} personalBests={bests} onAgain={restart} />
    </div>
  );
}
