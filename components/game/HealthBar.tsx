interface HealthBarProps {
  label: string;
  value: number;
  max: number;
  tone: "mint" | "rose" | "gold";
}

const tones = {
  mint: "from-mint to-ice",
  rose: "from-rose to-gold",
  gold: "from-gold to-mint",
};

export function HealthBar({ label, value, max, tone }: HealthBarProps) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="w-full max-w-md">
      <div className="mb-1 flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em] text-fog">
        <span>{label}</span>
        <span className="tabular-nums text-paper">
          {Math.max(0, Math.round(value))} / {max}
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-sm border border-line bg-ink"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
      >
        <div
          className={`h-full bg-gradient-to-r ${tones[tone]} transition-[width] duration-150`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
