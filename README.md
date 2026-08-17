# Wordstrike

A local-first typing speed fighter. Every correctly typed word is an attack. Faster, cleaner input hits harder. Mistakes break your combo and chip your HP.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run lint
npm run build
```

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Dexie / IndexedDB for history and settings
- No backend, no accounts, works offline after load

## Loop

Configure → type → fight → results → Tab / Enter to go again.

Shortcuts: `Tab` or `Esc` restarts. `Enter` restarts from the results screen.

## Assets

Player fighter is [Martial Hero](https://luizmelo.itch.io/martial-hero) by LuizMelo (CC0). Enemies are from the same author's [Monsters Creatures Fantasy](https://luizmelo.itch.io/monsters-creatures-fantasy) and [Fantasy 2](https://luizmelo.itch.io/monsters-creatures-fantasy-2) packs (CC0): Skeleton, Mimic, Mushroom, Rat, Goblin, Slime, Flying Eye, then Bat, looping after each defeat. Boss mode stays on Flying Eye. Correct words play an attack slash. Wrong letters, failed words, and HP loss play the take-hit clip. The arena background is [Green Meadow](https://opengameart.org/content/green-meadow-pixel-art-background) by CraftPix (OGA-BY 3.0).
