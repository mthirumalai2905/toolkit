"use client";

import { useEffect, useState } from "react";
import { Contrast, Moon, Sun } from "lucide-react";

export type ThemeName = "light" | "dim" | "dark";

const THEMES: { id: ThemeName; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dim", label: "Dim", icon: Contrast },
  { id: "dark", label: "Lights out", icon: Moon },
];

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>("light");

  useEffect(() => {
    const stored = document.documentElement.getAttribute("data-theme");
    if (stored === "light" || stored === "dim" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  function applyTheme(next: ThemeName) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
  }

  return { theme, applyTheme };
}

export function ThemeSwitch({
  theme,
  onChange,
}: {
  theme: ThemeName;
  onChange: (theme: ThemeName) => void;
}) {
  return (
    <div
      className="flex items-center rounded-full bg-pill p-0.5"
      role="radiogroup"
      aria-label="Color theme"
    >
      {THEMES.map((option) => {
        const active = theme === option.id;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.id)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              active
                ? "bg-elevated text-ink shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                : "text-muted hover:text-ink"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
