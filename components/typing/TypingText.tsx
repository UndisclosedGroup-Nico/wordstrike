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
  const boxRef = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const current = currentRef.current;
    if (!box || !current) return;
    const boxRect = box.getBoundingClientRect();
    const wordRect = current.getBoundingClientRect();
    box.scrollTop += wordRect.top - boxRect.top - box.clientHeight / 2 + wordRect.height / 2;
  }, [wordIndex]);

  const start = Math.max(0, wordIndex - 8);
  const end = Math.min(words.length, wordIndex + 24);
  const slice = words.slice(start, end);

  return (
    <div
      ref={boxRef}
      className={`relative max-h-40 overflow-y-auto overscroll-none rounded-2xl border border-line bg-ink/70 px-4 py-6 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
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
