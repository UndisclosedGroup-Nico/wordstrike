interface EnemyProps {
  hit: boolean;
  defeated: boolean;
  boss: boolean;
  wave: number;
}

export function Enemy({ hit, defeated, boss, wave }: EnemyProps) {
  const size = boss ? "h-36 w-36" : "h-28 w-28";
  return (
    <div
      className={`relative flex items-center justify-center ${size} ${
        defeated ? "animate-defeat" : hit ? "animate-hit" : "animate-idle"
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        className={`h-full w-full ${
          boss
            ? "drop-shadow-[0_0_18px_rgba(255,75,122,0.45)]"
            : "drop-shadow-[0_0_12px_rgba(255,75,122,0.28)]"
        }`}
      >
        <circle cx="60" cy="58" r={boss ? 42 : 34} fill="#1a0f16" stroke="#ff4b7a" strokeWidth="3" />
        <polygon points="28,40 40,18 52,40" fill="#ff4b7a" />
        <polygon points="68,40 80,14 92,40" fill="#ff4b7a" />
        {boss ? <polygon points="50,22 60,4 70,22" fill="#ffd166" /> : null}
        <rect x="42" y="52" width="10" height="8" fill="#ffd166" />
        <rect x="68" y="52" width="10" height="8" fill="#ffd166" />
        <path d="M44 74 Q60 86 76 74" fill="none" stroke="#ff4b7a" strokeWidth="3" />
        <text
          x="60"
          y="108"
          textAnchor="middle"
          fill="#8b93a7"
          fontSize="10"
          fontFamily="monospace"
        >
          {boss ? "NULLSPAWN" : `DUMMY-${String(wave).padStart(2, "0")}`}
        </text>
      </svg>
    </div>
  );
}
