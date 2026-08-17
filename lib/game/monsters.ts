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
  scale: number;
  blend: "lighten" | "normal";
  idle: MonsterClip;
  attack: MonsterClip;
  hurt: MonsterClip;
  death: MonsterClip;
}

const PACK1_FRAME = 150;
const PACK1_CROP = { x: 16, y: 10, w: 118, h: 134 };
const BOSS_ID = "flying-eye";

function pack1Clips(
  folder: string,
  idleFile: string,
  idleFrames: number,
): Pick<MonsterDef, "frame" | "crop" | "scale" | "blend" | "idle" | "attack" | "hurt" | "death"> {
  const root = `/assets/characters/monsters/${folder}`;
  return {
    frame: PACK1_FRAME,
    crop: PACK1_CROP,
    scale: PACK1_CROP.w,
    blend: "lighten",
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

function pack2Clips(
  folder: string,
  frame: number,
  crop: { x: number; y: number; w: number; h: number },
  scale: number,
  counts: { idle: number; attack: number; hurt: number; death: number },
): Pick<MonsterDef, "frame" | "crop" | "scale" | "blend" | "idle" | "attack" | "hurt" | "death"> {
  const root = `/assets/characters/monsters/${folder}`;
  return {
    frame,
    crop,
    scale,
    blend: "normal",
    idle: {
      src: `${root}/Idle.png`,
      frames: counts.idle,
      fps: 8,
      loop: true,
    },
    attack: {
      src: `${root}/Attack.png`,
      frames: counts.attack,
      fps: 12,
      loop: false,
    },
    hurt: {
      src: `${root}/TakeHit.png`,
      frames: counts.hurt,
      fps: 10,
      loop: false,
    },
    death: {
      src: `${root}/Death.png`,
      frames: counts.death,
      fps: 8,
      loop: false,
    },
  };
}

export const MONSTERS: MonsterDef[] = [
  { id: "skeleton", name: "Skeleton", ...pack1Clips("skeleton", "Idle.png", 4) },
  {
    id: "mimic",
    name: "Mimic",
    ...pack2Clips("mimic", 146, { x: 45, y: 37, w: 74, h: 48 }, 96, {
      idle: 9,
      attack: 14,
      hurt: 3,
      death: 6,
    }),
  },
  { id: "mushroom", name: "Mushroom", ...pack1Clips("mushroom", "Idle.png", 4) },
  {
    id: "rat",
    name: "Rat",
    ...pack2Clips("rat", 70, { x: 13, y: 21, w: 50, h: 26 }, 72, {
      idle: 10,
      attack: 12,
      hurt: 3,
      death: 6,
    }),
  },
  { id: "goblin", name: "Goblin", ...pack1Clips("goblin", "Idle.png", 4) },
  {
    id: "slime",
    name: "Slime",
    ...pack2Clips("slime", 156, { x: 42, y: 50, w: 114, h: 40 }, 100, {
      idle: 14,
      attack: 19,
      hurt: 3,
      death: 11,
    }),
  },
  { id: "flying-eye", name: "Flying Eye", ...pack1Clips("flying-eye", "Idle.png", 8) },
  {
    id: "bat",
    name: "Bat",
    ...pack2Clips("bat", 87, { x: 12, y: 14, w: 76, h: 58 }, 116, {
      idle: 11,
      attack: 11,
      hurt: 3,
      death: 4,
    }),
  },
];

export function monsterForWave(wave: number, boss: boolean): MonsterDef {
  if (boss) {
    return MONSTERS.find((monster) => monster.id === BOSS_ID) ?? MONSTERS[0];
  }
  const index = ((Math.max(1, wave) - 1) % MONSTERS.length + MONSTERS.length) % MONSTERS.length;
  return MONSTERS[index] ?? MONSTERS[0];
}
