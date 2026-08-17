interface PlayerProps {
  attacking: boolean;
}

export function Player({ attacking }: PlayerProps) {
  return (
    <div
      className={`relative flex h-28 w-24 items-end justify-center ${
        attacking ? "animate-lunge" : ""
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 100" className="h-full w-full drop-shadow-[0_0_12px_rgba(62,242,178,0.35)]">
        <polygon points="40,8 52,28 28,28" fill="#3ef2b2" />
        <rect x="30" y="28" width="20" height="28" rx="3" fill="#d8fff0" />
        <rect x="18" y="34" width="12" height="6" fill="#3ef2b2" />
        <rect x="50" y="30" width="18" height="5" fill="#ffd166" />
        <rect x="28" y="56" width="8" height="28" fill="#7aa2ff" />
        <rect x="44" y="56" width="8" height="28" fill="#7aa2ff" />
        <circle cx="36" cy="38" r="2" fill="#06070b" />
        <circle cx="44" cy="38" r="2" fill="#06070b" />
      </svg>
    </div>
  );
}
