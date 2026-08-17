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
