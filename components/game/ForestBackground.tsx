const PIXELATED = { imageRendering: "pixelated" as const };

export function ForestBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <img
        src="/assets/backgrounds/forest/meadow.png"
        alt=""
        className="absolute inset-x-0 bottom-0 h-[175%] w-full object-cover object-bottom"
        style={PIXELATED}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/20" />
    </div>
  );
}
