export function formatTime(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export function modeLabel(mode: string): string {
  switch (mode) {
    case "classic":
      return "Classic";
    case "timeAttack":
      return "Time Attack";
    case "endless":
      return "Endless";
    case "boss":
      return "Boss Fight";
    default:
      return mode;
  }
}

export function difficultyLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
