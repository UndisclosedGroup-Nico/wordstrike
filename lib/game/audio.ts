type SoundName =
  | "key"
  | "hit"
  | "crit"
  | "error"
  | "hurt"
  | "combo"
  | "win"
  | "finish";

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  return ctx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  when = 0,
) {
  const audio = context();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(audio.destination);
  const start = audio.currentTime + when;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playSound(name: SoundName, volume: number): void {
  if (volume <= 0) return;
  const v = Math.min(1, Math.max(0, volume)) * 0.08;
  switch (name) {
    case "key":
      tone(660, 0.04, "square", v * 0.45);
      break;
    case "hit":
      tone(220, 0.09, "sawtooth", v);
      tone(440, 0.07, "square", v * 0.6, 0.02);
      break;
    case "crit":
      tone(330, 0.1, "sawtooth", v);
      tone(660, 0.12, "triangle", v, 0.04);
      tone(990, 0.1, "square", v * 0.5, 0.08);
      break;
    case "error":
      tone(140, 0.12, "square", v);
      break;
    case "hurt":
      tone(110, 0.16, "sawtooth", v);
      break;
    case "combo":
      tone(520, 0.08, "triangle", v);
      tone(780, 0.1, "triangle", v, 0.05);
      break;
    case "win":
      tone(392, 0.12, "triangle", v);
      tone(523, 0.12, "triangle", v, 0.1);
      tone(659, 0.18, "triangle", v, 0.2);
      break;
    case "finish":
      tone(300, 0.16, "sine", v);
      tone(200, 0.2, "sine", v, 0.08);
      break;
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
