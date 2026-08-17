export function calcWpm(correctCharacters: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return (correctCharacters / 5) / minutes;
}

export function calcRawWpm(
  correctCharacters: number,
  incorrectCharacters: number,
  elapsedMs: number,
): number {
  return calcWpm(correctCharacters + incorrectCharacters, elapsedMs);
}

export function calcAccuracy(
  correctCharacters: number,
  incorrectCharacters: number,
): number {
  const total = correctCharacters + incorrectCharacters;
  if (total <= 0) return 100;
  return (correctCharacters / total) * 100;
}

export function compareWord(
  target: string,
  typed: string,
  countMissed: boolean,
): { correct: number; incorrect: number } {
  let correct = 0;
  let incorrect = 0;
  const limit = countMissed
    ? Math.max(target.length, typed.length)
    : typed.length;

  for (let i = 0; i < limit; i += 1) {
    const expected = target[i];
    const got = typed[i];
    if (got === undefined) {
      incorrect += 1;
    } else if (expected === undefined || got !== expected) {
      incorrect += 1;
    } else {
      correct += 1;
    }
  }

  return { correct, incorrect };
}

export function recountCharacters(
  history: Array<{ target: string; typed: string }>,
  currentTarget: string,
  currentTyped: string,
): { correct: number; incorrect: number } {
  let correct = 0;
  let incorrect = 0;

  for (const attempt of history) {
    const counted = compareWord(attempt.target, attempt.typed, true);
    correct += counted.correct;
    incorrect += counted.incorrect;
  }

  const live = compareWord(currentTarget, currentTyped, false);
  correct += live.correct;
  incorrect += live.incorrect;

  return { correct, incorrect };
}

export function roundStat(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
