"use client";

import { CLIENT_PINS } from "@/data/portfolio";
import { useTheme } from "@/components/theme";

export function ClientMap() {
  const { theme } = useTheme();
  const src = theme === "light" ? "/map-light.svg" : "/map-dark.svg";

  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl bg-card">
      <img src={src} alt="" className="block h-auto w-full" />
      {CLIENT_PINS.map((pin, index) => {
        const left = ((pin.lon + 180) / 360) * 100;
        const top = ((90 - pin.lat) / 180) * 100;
        return (
          <span
            key={pin.city}
            title={pin.city}
            className="map-pin"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              ["--beep-delay" as string]: `${index * 0.22}s`,
            }}
          />
        );
      })}
    </div>
  );
}
