interface ComboDisplayProps {
  combo: number;
  enabled: boolean;
}

export function ComboDisplay({ combo, enabled }: ComboDisplayProps) {
  if (combo < 2) return null;

  const intensity =
    combo >= 50 ? "text-gold scale-125" : combo >= 25 ? "text-rose" : combo >= 10 ? "text-mint" : "text-paper";

  return (
    <div
      className={`font-display text-xl tracking-[0.2em] ${intensity} ${
        enabled && combo >= 5 ? "animate-pulse" : ""
      }`}
      aria-live="polite"
    >
      x{combo} COMBO
    </div>
  );
}
