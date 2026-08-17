export interface MonsterClip {
  src: string;
  frames: number;
  fps: number;
  loop: boolean;
}

export interface MonsterDef {
  id: string;
  name: string;
  frame: number;
  crop: { x: number; y: number; w: number; h: number };
  idle: MonsterClip;
  attack: MonsterClip;
  hurt: MonsterClip;
  death: MonsterClip;
}

const FRAME = 150;
const CROP = { x: 16, y: 10, w: 118, h: 134 };

function clips(
  folder: string,
  idleFile: string,
  idleFrames: number,
): Pick<MonsterDef, "frame" | "crop" | "idle" | "attack" | "hurt" | "death"> {
  const root = `/assets/characters/monsters/${folder}`;
  return {
    frame: FRAME,
    crop: CROP,
    idle: {
      src: `${root}/${idleFile}`,
      frames: idleFrames,
      fps: 8,
      loop: true,
    },
    attack: {
      src: `${root}/Attack.png`,
      frames: 8,
      fps: 12,
      loop: false,
    },
    hurt: {
      src: `${root}/TakeHit.png`,
      frames: 4,
      fps: 10,
      loop: false,
    },
    death: {
      src: `${root}/Death.png`,
      frames: 4,
      fps: 8,
      loop: false,
    },
  };
}

export const MONSTERS: MonsterDef[] = [
  { id: "skeleton", name: "Skeleton", ...clips("skeleton", "Idle.png", 4) },
  { id: "mushroom", name: "Mushroom", ...clips("mushroom", "Idle.png", 4) },
  { id: "goblin", name: "Goblin", ...clips("goblin", "Idle.png", 4) },
  { id: "flying-eye", name: "Flying Eye", ...clips("flying-eye", "Idle.png", 8) },
];

export function monsterForWave(wave: number, boss: boolean): MonsterDef {
  if (boss) {
    return MONSTERS[MONSTERS.length - 1] ?? MONSTERS[0];
  }
  const index = ((Math.max(1, wave) - 1) % MONSTERS.length + MONSTERS.length) % MONSTERS.length;
  return MONSTERS[index] ?? MONSTERS[0];
}
