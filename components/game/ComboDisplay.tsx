interface ComboDisplayProps {
  combo: number;
  enabled: boolean;
}

export function ComboDisplay({ combo, enabled }: ComboDisplayProps) {
  const intensity =
    combo >= 50 ? "text-gold scale-125" : combo >= 25 ? "text-rose" : combo >= 10 ? "text-mint" : "text-paper";

  return (
    <div className="flex h-8 items-center justify-center" aria-live="polite">
      {combo >= 2 ? (
        <div
          className={`font-display text-xl tracking-[0.2em] ${intensity} ${
            enabled && combo >= 5 ? "animate-pulse" : ""
          }`}
        >
          x{combo} COMBO
        </div>
      ) : null}
    </div>
  );
}
