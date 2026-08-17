interface TypingStatsProps {
  wpm: number;
  accuracy: number;
  combo: number;
  timeLabel: string;
  damage: number;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-20 text-center">
      <div className="font-display text-2xl tabular-nums text-paper sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-fog">
        {label}
      </div>
    </div>
  );
}

export function TypingStats({
  wpm,
  accuracy,
  combo,
  timeLabel,
  damage,
}: TypingStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-panel/70 px-3 py-4 sm:grid-cols-5 sm:px-6">
      <Stat label="WPM" value={wpm.toFixed(0)} />
      <Stat label="Acc" value={`${accuracy.toFixed(0)}%`} />
      <Stat label="Combo" value={`x${combo}`} />
      <Stat label="Time" value={timeLabel} />
      <Stat label="Dmg" value={damage.toFixed(0)} />
    </div>
  );
}
