"use client";

import { useRef, useState } from "react";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { clearAllData, saveGameResult } from "@/lib/db/games";
import { exportData, parseImportData } from "@/lib/db/stats";
import { saveSettings } from "@/lib/db/settings";
import type {
  AnimationIntensity,
  BackspaceMode,
  Difficulty,
  GameMode,
  TextMode,
  ThemeId,
  UiDensity,
  WordCategory,
} from "@/types/settings";

export function SettingsForm() {
  const { settings, update, replace, reset } = useSettings();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  async function onExport() {
    const payload = await exportData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wordstrike-data.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Export downloaded.");
  }

  async function onImport(file: File) {
    try {
      const parsed = parseImportData(await file.text());
      await clearAllData();
      for (const result of parsed.results) {
        await saveGameResult(result);
      }
      await saveSettings(parsed.settings);
      replace(parsed.settings);
      setMessage(`Imported ${parsed.results.length} runs.`);
    } catch {
      setMessage("Import failed. Use a Wordstrike JSON export.");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <header>
        <h1 className="font-display text-4xl tracking-wide">Settings</h1>
        <p className="mt-2 text-sm text-fog">
          Preferences persist locally. Tab / Esc restarts a fight. Enter restarts from results.
        </p>
      </header>

      <Section title="Test">
        <Field label="Mode">
          <Select
            value={settings.mode}
            onChange={(value) => update({ mode: value as GameMode })}
            options={[
              ["classic", "Classic"],
              ["timeAttack", "Time Attack"],
              ["endless", "Endless"],
              ["boss", "Boss Fight"],
            ]}
          />
        </Field>
        <Field label="Duration">
          <Select
            value={String(settings.duration)}
            onChange={(value) => update({ duration: Number(value) })}
            options={[
              ["15", "15s"],
              ["30", "30s"],
              ["60", "60s"],
              ["120", "120s"],
              ["-1", "Custom"],
              ["0", "No timer"],
            ]}
          />
        </Field>
        {settings.duration < 0 ? (
          <Field label="Custom seconds">
            <input
              type="number"
              min={5}
              max={600}
              value={settings.customDuration}
              onChange={(event) =>
                update({ customDuration: Number(event.target.value) || 45 })
              }
              className="input"
            />
          </Field>
        ) : null}
        <Field label="Difficulty">
          <Select
            value={settings.difficulty}
            onChange={(value) => update({ difficulty: value as Difficulty })}
            options={[
              ["easy", "Easy"],
              ["normal", "Normal"],
              ["hard", "Hard"],
              ["expert", "Expert"],
              ["custom", "Custom"],
            ]}
          />
        </Field>
        <Field label="Text">
          <Select
            value={settings.textMode}
            onChange={(value) => update({ textMode: value as TextMode })}
            options={[
              ["words", "Words"],
              ["sentences", "Sentences"],
              ["quotes", "Quotes"],
              ["random", "Random"],
              ["custom", "Custom text"],
            ]}
          />
        </Field>
        <Field label="Category">
          <Select
            value={settings.category}
            onChange={(value) => update({ category: value as WordCategory })}
            options={[
              ["common", "Common"],
              ["programming", "Programming"],
              ["fantasy", "Fantasy"],
              ["scifi", "Sci-Fi"],
              ["gaming", "Gaming"],
              ["quotes", "Quotes"],
            ]}
          />
        </Field>
        <Field label="Word count">
          <input
            type="number"
            min={20}
            max={400}
            value={settings.wordCount}
            onChange={(event) =>
              update({ wordCount: Number(event.target.value) || 80 })
            }
            className="input"
          />
        </Field>
        {settings.difficulty === "custom" ? (
          <>
            <Field label="Min length">
              <input
                type="number"
                min={1}
                max={20}
                value={settings.minWordLength}
                onChange={(event) =>
                  update({ minWordLength: Number(event.target.value) || 3 })
                }
                className="input"
              />
            </Field>
            <Field label="Max length">
              <input
                type="number"
                min={1}
                max={24}
                value={settings.maxWordLength}
                onChange={(event) =>
                  update({ maxWordLength: Number(event.target.value) || 8 })
                }
                className="input"
              />
            </Field>
          </>
        ) : null}
        <Toggle
          label="Punctuation"
          checked={settings.punctuation}
          onChange={(checked) => update({ punctuation: checked })}
        />
        <Toggle
          label="Numbers"
          checked={settings.numbers}
          onChange={(checked) => update({ numbers: checked })}
        />
        <Toggle
          label="Capitalization"
          checked={settings.capitalization}
          onChange={(checked) => update({ capitalization: checked })}
        />
        {settings.textMode === "custom" ? (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-fog">
              Custom text
            </span>
            <textarea
              value={settings.customText}
              onChange={(event) => update({ customText: event.target.value })}
              rows={4}
              className="input min-h-24"
            />
          </label>
        ) : null}
      </Section>

      <Section title="Combat">
        <Field label="Animation intensity">
          <Select
            value={settings.animationIntensity}
            onChange={(value) =>
              update({ animationIntensity: value as AnimationIntensity })
            }
            options={[
              ["low", "Low"],
              ["medium", "Medium"],
              ["high", "High"],
            ]}
          />
        </Field>
        <Toggle
          label="Animations"
          checked={settings.animationsEnabled}
          onChange={(checked) => update({ animationsEnabled: checked })}
        />
        <Toggle
          label="Screen shake"
          checked={settings.screenShake}
          onChange={(checked) => update({ screenShake: checked })}
        />
        <Toggle
          label="Damage numbers"
          checked={settings.damageNumbers}
          onChange={(checked) => update({ damageNumbers: checked })}
        />
        <Toggle
          label="Combo effects"
          checked={settings.comboEffects}
          onChange={(checked) => update({ comboEffects: checked })}
        />
      </Section>

      <Section title="Audio">
        <Toggle
          label="Sound effects"
          checked={settings.soundEnabled}
          onChange={(checked) => update({ soundEnabled: checked })}
        />
        <Field label="Volume">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(event) => update({ volume: Number(event.target.value) })}
          />
        </Field>
      </Section>

      <Section title="Appearance">
        <Field label="Theme">
          <Select
            value={settings.theme}
            onChange={(value) => update({ theme: value as ThemeId })}
            options={[
              ["void", "Void"],
              ["ember", "Ember"],
              ["ion", "Ion"],
            ]}
          />
        </Field>
        <Field label="Density">
          <Select
            value={settings.uiDensity}
            onChange={(value) => update({ uiDensity: value as UiDensity })}
            options={[
              ["comfortable", "Comfortable"],
              ["compact", "Compact"],
            ]}
          />
        </Field>
        <Field label="Backspace">
          <Select
            value={settings.backspace}
            onChange={(value) => update({ backspace: value as BackspaceMode })}
            options={[
              ["on", "On"],
              ["off", "Off"],
              ["word", "Whole word"],
            ]}
          />
        </Field>
        <Toggle
          label="Reduced motion"
          checked={settings.reducedMotion}
          onChange={(checked) => update({ reducedMotion: checked })}
        />
      </Section>

      <Section title="Data">
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => void onExport()}>
            Export data
          </Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>
            Import data
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              if (!window.confirm("Clear all run history?")) return;
              await clearAllData();
              setMessage("History cleared.");
            }}
          >
            Clear history
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              await reset();
              setMessage("Settings reset.");
            }}
          >
            Reset settings
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onImport(file);
            event.target.value = "";
          }}
        />
        {message ? <p className="text-sm text-mint">{message}</p> : null}
        <p className="text-xs text-fog">
          All data stays in this browser. No account, no server.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-panel/70 p-5">
      <h2 className="mb-4 font-display text-xl tracking-wide">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-fog">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="input"
    >
      {options.map(([id, label]) => (
        <option key={id} value={id}>
          {label}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-mint"
      />
    </label>
  );
}
