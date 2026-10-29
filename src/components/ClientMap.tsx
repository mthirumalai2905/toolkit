"use client";

import { CLIENT_PINS } from "@/data/portfolio";
import { useTheme } from "@/components/theme";

export function ClientMap() {
  const { theme } = useTheme();
  const src = theme === "light" ? "/map-light.svg" : "/map-dark.svg";

  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl bg-card">
      <img src={src} alt="" className="block h-auto w-full" />
      {CLIENT_PINS.map((pin) => {
        const left = ((pin.lon + 180) / 360) * 100;
        const top = ((90 - pin.lat) / 180) * 100;
        return (
          <span
            key={pin.city}
            title={pin.city}
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-blue)_35%,transparent)]"
            style={{ left: `${left}%`, top: `${top}%` }}
          />
        );
      })}
    </div>
  );
}
