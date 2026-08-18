"use client";

interface TypingTextProps {
  word: string;
  typed: string;
  errorFlash: boolean;
}

function ActiveWord({ word, typed }: { word: string; typed: string }) {
  const letters = word.split("");
  return (
    <span className="relative">
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
          <span className="text-rose">{typed.slice(word.length)}</span>
        </>
      ) : null}
    </span>
  );
}

export function TypingText({ word, typed, errorFlash }: TypingTextProps) {
  if (!word) return null;

  return (
    <p
      className={`whitespace-nowrap px-10 py-2 text-center font-mono text-xl tracking-wide sm:text-2xl ${
        errorFlash
          ? "bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--rose)_32%,transparent)_0%,transparent_72%)]"
          : "bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--ink)_55%,transparent)_0%,transparent_72%)]"
      } [text-shadow:0_1px_1px_rgba(0,0,0,0.75),0_0_16px_rgba(0,0,0,0.45)]`}
      aria-label="Text to type"
    >
      <ActiveWord key={word} word={word} typed={typed} />
    </p>
  );
}
