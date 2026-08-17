"use client";

import { useEffect, useRef } from "react";
import type { WordAttempt } from "@/types/game";

interface TypingTextProps {
  words: string[];
  wordIndex: number;
  currentTyped: string;
  history: WordAttempt[];
  errorFlash: boolean;
}

function PastWord({ attempt }: { attempt: WordAttempt }) {
  return (
    <span className={`mr-3 ${attempt.perfect ? "text-mint/80" : "text-rose"}`}>
      {attempt.target}
    </span>
  );
}

function ActiveWord({ word, typed }: { word: string; typed: string }) {
  const letters = word.split("");
  return (
    <span className="relative mr-3">
      {letters.map((char, index) => {
        const got = typed[index];
        let className = "text-fog";
        if (got !== undefined) {
          className = got === char ? "text-paper" : "text-rose bg-rose/20";
        }
        const caret = index === typed.length;
        return (
          <span key={`${char}-${index}`} className={className}>
            {caret ? <span className="caret" aria-hidden="true" /> : null}
            {char}
          </span>
        );
      })}
      {typed.length >= word.length ? (
        <>
          <span className="caret" aria-hidden="true" />
          <span className="text-rose">
            {typed.slice(word.length)}
          </span>
        </>
      ) : null}
    </span>
  );
}

export function TypingText({
  words,
  wordIndex,
  currentTyped,
  history,
  errorFlash,
}: TypingTextProps) {
  const currentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center", behavior: "auto" });
  }, [wordIndex]);

  const start = Math.max(0, wordIndex - 8);
  const end = Math.min(words.length, wordIndex + 24);
  const slice = words.slice(start, end);

  return (
    <div
      className={`relative max-h-40 overflow-hidden rounded-2xl border border-line bg-ink/70 px-4 py-6 sm:px-8 ${
        errorFlash ? "ring-1 ring-rose/70" : ""
      }`}
    >
      <p
        className="font-mono text-xl leading-relaxed tracking-wide sm:text-2xl"
        aria-label="Text to type"
      >
        {slice.map((word, offset) => {
          const index = start + offset;
          if (index < wordIndex) {
            const attempt = history[index];
            if (!attempt) return null;
            return <PastWord key={`${word}-${index}`} attempt={attempt} />;
          }
          if (index === wordIndex) {
            return (
              <span key={`${word}-${index}`} ref={currentRef}>
                <ActiveWord word={word} typed={currentTyped} />
              </span>
            );
          }
          return (
            <span key={`${word}-${index}`} className="mr-3 text-fog/70">
              {word}
            </span>
          );
        })}
      </p>
    </div>
  );
}
