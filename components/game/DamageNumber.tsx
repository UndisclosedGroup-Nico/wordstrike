import type { FloatingNumber } from "@/types/game";

export function DamageNumber({ item }: { item: FloatingNumber }) {
  const color =
    item.kind === "hurt"
      ? "text-rose"
      : item.kind === "crit"
        ? "text-gold"
        : "text-mint";

  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 animate-float-up font-display text-2xl tabular-nums ${color}`}
    >
      {item.kind === "hurt" ? `-${item.value}` : `-${item.value}`}
      {item.kind === "crit" ? " CRIT" : ""}
    </div>
  );
}
