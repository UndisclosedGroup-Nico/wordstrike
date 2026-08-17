"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadSettings, resetSettings, saveSettings } from "@/lib/db/settings";
import { DEFAULT_SETTINGS, type GameSettings } from "@/types/settings";

interface SettingsContextValue {
  settings: GameSettings;
  ready: boolean;
  update: (patch: Partial<GameSettings>) => void;
  replace: (next: GameSettings) => void;
  reset: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void loadSettings().then((loaded) => {
      if (!active) return;
      setSettings(loaded);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((patch: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  const replace = useCallback((next: GameSettings) => {
    setSettings(next);
    void saveSettings(next);
  }, []);

  const reset = useCallback(async () => {
    const next = await resetSettings();
    setSettings(next);
  }, []);

  const value = useMemo(
    () => ({ settings, ready, update, replace, reset }),
    [settings, ready, update, replace, reset],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return value;
}
