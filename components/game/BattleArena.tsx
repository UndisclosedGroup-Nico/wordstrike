import { ComboDisplay } from "@/components/game/ComboDisplay";
import { DamageNumber } from "@/components/game/DamageNumber";
import { Enemy } from "@/components/game/Enemy";
import { ForestBackground } from "@/components/game/ForestBackground";
import { HealthBar } from "@/components/game/HealthBar";
import { Player } from "@/components/game/Player";
import { monsterForWave } from "@/lib/game/monsters";
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
  const attacking = state.attackUntil > state.now;
  const lastHit = state.lastHit;
  const failedWord = lastHit?.kind === "hurt";
  const playerHurtToken = failedWord && lastHit ? lastHit.id : 0;
  const hurting = Boolean(
    failedWord && lastHit && state.now - lastHit.createdAt < 400,
  );
  const hit = !reducedMotion && state.hitUntil > state.now;
  const enemyAttacking = failedWord;
  const enemyAttackToken = playerHurtToken;
  const comboFx = state.settings.comboEffects && !reducedMotion;
  const monster = monsterForWave(state.wave, state.settings.mode === "boss");

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-line bg-ink px-4 py-6 ${
        shaking ? "animate-shake" : ""
      } ${state.combo >= 25 && comboFx ? "arena-overdrive" : ""}`}
      aria-label="Battle arena"
    >
      <ForestBackground />
      <div className="relative flex flex-col items-center gap-4 drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">
        <HealthBar
          label={
            state.settings.mode === "boss"
              ? `Boss · ${monster.name}`
              : `Wave ${state.wave} · ${monster.name}`
          }
          value={state.enemyHp}
          max={state.enemyMaxHp}
          tone="rose"
        />
        <div className="relative -mb-4 flex min-h-[min(25vw,36vh)] w-full items-end justify-center">
          {state.settings.damageNumbers
            ? state.floats.map((item) => <DamageNumber key={item.id} item={item} />)
            : null}
          <div className="translate-x-[16%]">
            <Player
              attacking={attacking}
              hurt={hurting}
              dead={state.playerHp <= 0}
              attackToken={state.attackUntil}
              hurtToken={playerHurtToken}
              reducedMotion={reducedMotion}
            />
          </div>
          <div className="-translate-x-[16%]">
            <Enemy
              hit={hit}
              attacking={enemyAttacking && state.errorUntil > state.now}
              defeated={state.enemyDefeated}
              boss={state.settings.mode === "boss"}
              wave={state.wave}
              hitToken={state.hitUntil}
              attackToken={enemyAttackToken}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
        <ComboDisplay combo={state.combo} enabled={comboFx} />
        <HealthBar label="You" value={state.playerHp} max={state.playerMaxHp} tone="mint" />
      </div>
    </section>
  );
}
