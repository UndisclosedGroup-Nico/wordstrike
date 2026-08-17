"use client";

import { useEffect } from "react";
import { useSettings } from "@/components/providers/SettingsProvider";

export function ThemeApplier() {
  const { settings } = useSettings();

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.density = settings.uiDensity;
  }, [settings.theme, settings.uiDensity]);

  return null;
}
