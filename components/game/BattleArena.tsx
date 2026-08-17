import { ComboDisplay } from "@/components/game/ComboDisplay";
import { DamageNumber } from "@/components/game/DamageNumber";
import { Enemy } from "@/components/game/Enemy";
import { HealthBar } from "@/components/game/HealthBar";
import { Player } from "@/components/game/Player";
import type { BattleState } from "@/types/game";

interface BattleArenaProps {
  state: BattleState;
  reducedMotion: boolean;
}

export function BattleArena({ state, reducedMotion }: BattleArenaProps) {
  const shaking =
    !reducedMotion &&
    state.settings.screenShake &&
    state.shakeUntil > state.now;
  const attacking = !reducedMotion && state.attackUntil > state.now;
  const hit = !reducedMotion && state.hitUntil > state.now;
  const comboFx = state.settings.comboEffects && !reducedMotion;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-line bg-panel/80 px-4 py-6 ${
        shaking ? "animate-shake" : ""
      } ${state.combo >= 25 && comboFx ? "arena-overdrive" : ""}`}
      aria-label="Battle arena"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(62,242,178,0.08),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(255,75,122,0.08),transparent_40%)]" />
      <div className="relative flex flex-col items-center gap-4">
        <HealthBar
          label={state.settings.mode === "boss" ? "Boss" : `Wave ${state.wave}`}
          value={state.enemyHp}
          max={state.enemyMaxHp}
          tone="rose"
        />
        <div className="relative flex min-h-40 w-full items-end justify-center gap-10 sm:gap-16">
          {state.settings.damageNumbers
            ? state.floats.map((item) => <DamageNumber key={item.id} item={item} />)
            : null}
          <Player attacking={attacking} />
          <div className="hidden h-px w-16 self-center bg-gradient-to-r from-mint to-rose sm:block" />
          <Enemy
            hit={hit}
            defeated={state.enemyDefeated}
            boss={state.settings.mode === "boss"}
            wave={state.wave}
          />
        </div>
        <ComboDisplay combo={state.combo} enabled={comboFx} />
        <HealthBar label="You" value={state.playerHp} max={state.playerMaxHp} tone="mint" />
      </div>
    </section>
  );
}
