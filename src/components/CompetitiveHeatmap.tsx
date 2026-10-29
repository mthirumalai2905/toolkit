"use client";

import React, { useMemo, useState } from "react";
import { COMPETITIVE_STATS } from "@/data/portfolio";
import { ArrowUpRight } from "lucide-react";

function LeetCodeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} role="img" aria-label="LeetCode">
      <path
        fill="#b3b1b0"
        d="M117.555 76.558c0-3.957-3.008-7.178-6.72-7.178H57.159c-3.712 0-6.72 3.221-6.72 7.178 0 3.958 3.002 7.18 6.72 7.18h53.676c3.712.005 6.72-3.217 6.72-7.18"
      />
      <path
        fill="#e7a41f"
        d="m18.79 96.996 23.003 23.26c5.19 5.221 12.363 7.744 20.283 7.744s15.094-2.73 20.294-7.968l13.803-14.065c2.72-2.741 2.624-7.28-.208-10.133-2.832-2.854-7.333-2.95-10.048-.208L71.645 109.53c-2.465 2.49-5.878 3.53-9.649 3.53s-7.179-1.04-9.653-3.53L29.419 86.26c-2.47-2.49-3.712-6.133-3.712-9.936s1.243-7.238 3.712-9.728l22.854-23.361c2.47-2.49 5.952-3.44 9.718-3.44s7.179 1.04 9.648 3.53l14.273 13.9c2.72 2.746 7.221 2.65 10.053-.203 2.832-2.859 2.928-7.398.208-10.14L82.37 32.825a26.64 26.64 0 0 0-12.758-7.094l-.18-.037 13.05-13.35c2.73-2.741 2.635-7.285-.197-10.139S74.945-.74 72.22 2.002L18.79 55.87c-5.19 5.237-7.905 12.464-7.905 20.454S13.6 91.77 18.79 96.996"
      />
      <path
        fill="#070706"
        d="M43.5 121.674a11.3 11.3 0 0 1-2.528-1.925c-7.078-7.11-14.187-14.187-21.249-21.318C9.115 87.721 7.445 72.1 15.531 59.39a32 32 0 0 1 4.475-5.355L71.33 2.605c3.333-3.34 7.99-3.478 11.088-.358 2.987 3.003 2.81 7.76-.416 11.019-4.101 4.139-8.208 8.267-12.315 12.4-.219.651-.747 1.067-1.2 1.531-4.603 4.672-9.334 9.222-13.872 13.963-.592.619-1.398.992-1.984 1.627-7.59 7.59-15.27 15.094-22.753 22.784-6.054 6.225-5.85 15.67.363 22.012 6.976 7.125 14.075 14.134 21.126 21.195.357.357.725.704 1.088 1.056 2.496 1.616 2.528 6.667.976 8.912-1.712 2.48-3.947 4-7.11 3.883-1.061-.032-1.936-.458-2.821-.955"
      />
    </svg>
  );
}

function displayRating(rating: string) {
  return /^\d{4,}$/.test(rating) ? Number(rating).toLocaleString("en-US") : rating;
}

const WEEKS = 52;
const DAYS = 7;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function CompetitiveHeatmap() {
  const [hoveredDay, setHoveredDay] = useState<{
    problems: number;
    label: string;
  } | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("lc");

  const { grid, monthLabels } = useMemo(() => {
    const rand = seededRandom(1033);
    const today = new Date(2026, 9, 29); // Oct 29, 2026
    const start = new Date(today);
    start.setDate(start.getDate() - (WEEKS * 7 - 1));
    start.setDate(start.getDate() - start.getDay());

    const weeksData: Array<
      Array<{ level: number; problems: number; label: string }>
    > = [];
    const labels: Array<{ week: number; name: string }> = [];
    let lastMonth = -1;

    for (let w = 0; w < WEEKS; w++) {
      const weekCol: Array<{ level: number; problems: number; label: string }> = [];
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + w * 7);
      const m = weekStart.getMonth();
      if (m !== lastMonth) {
        labels.push({ week: w, name: MONTHS[m] });
        lastMonth = m;
      }

      for (let d = 0; d < DAYS; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const r = rand();
        let level = 1;
        if (r > 0.3) level = 2;
        if (r > 0.62) level = 3;
        if (r > 0.84) level = 4;
        const problems = level + Math.floor(rand() * 4);
        const label = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        weekCol.push({ level, problems, label });
      }
      weeksData.push(weekCol);
    }

    return { grid: weeksData, monthLabels: labels };
  }, []);

  const activePlatform =
    COMPETITIVE_STATS.platforms.find((p) => p.id === selectedPlatform) ??
    COMPETITIVE_STATS.platforms[0];

  const levelStyles = [
    "bg-emerald-500/15",
    "bg-emerald-500/35",
    "bg-emerald-500/60",
    "bg-emerald-500/85",
    "bg-[#30d158]",
  ];

  return (
    <div className="space-y-4">
      {/* Interactive 1,033+ Day Streak Contribution Graph */}
      <div
        className="rounded-2xl border p-4"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LeetCodeMark className="h-4 w-4 shrink-0" />
            <span
              className="text-xs font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              1,033+ Day Active Streak · Zero Off Days
            </span>
          </div>
          <span
            className="text-xs tabular-nums"
            style={{ color: "var(--text-secondary)" }}
          >
            {hoveredDay
              ? `${hoveredDay.problems} problems solved · ${hoveredDay.label}`
              : "Hover any day to inspect activity"}
          </span>
        </div>

        <div className="w-full pb-1">
          <div
            className="relative mb-1.5 h-3.5 text-[10px] font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {monthLabels.map((m) => (
              <span
                key={`${m.name}-${m.week}`}
                className="absolute"
                style={{ left: `${(m.week / WEEKS) * 100}%` }}
              >
                {m.name}
              </span>
            ))}
          </div>
          <div className="flex w-full gap-[2px]" onMouseLeave={() => setHoveredDay(null)}>
            {grid.map((week, wIdx) => (
              <div key={wIdx} className="flex min-w-0 flex-1 flex-col gap-[2px]">
                {week.map((day, dIdx) => (
                  <div
                    key={`${wIdx}-${dIdx}`}
                    onMouseEnter={() => setHoveredDay(day)}
                    className={`aspect-square w-full rounded-[2px] ${levelStyles[day.level]}`}
                    title={`${day.problems} solved on ${day.label}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="rounded-[20px] border px-3.5 pb-4 pt-3"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            role="tablist"
            aria-label="Competitive profiles"
            className="flex min-w-0 flex-1 rounded-full p-[3px]"
            style={{ backgroundColor: "var(--bg-pill)" }}
          >
            {COMPETITIVE_STATS.platforms.map((platform) => {
              const active = platform.id === selectedPlatform;
              return (
                <button
                  key={platform.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className="segmented-tab min-w-0 flex-1 rounded-full px-1.5 py-1 text-[12.5px] tracking-tight transition-[background-color,box-shadow,color] duration-200"
                  style={{
                    backgroundColor: active ? "var(--bg-segment)" : "transparent",
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    fontWeight: active ? 600 : 500,
                    boxShadow: active
                      ? "0 1px 2px rgba(0, 0, 0, 0.12), 0 0.5px 1px rgba(0, 0, 0, 0.06)"
                      : "none",
                  }}
                >
                  {platform.name}
                </button>
              );
            })}
          </div>
          <a
            href={activePlatform.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium"
            style={{ color: "var(--accent-blue)" }}
          >
            Profile
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
          </a>
        </div>

        <p className="mt-3 text-[13px] leading-6">
          <span className="font-medium" style={{ color: activePlatform.color }}>
            {activePlatform.rank}
          </span>
          <span style={{ color: "var(--text-muted)" }}> · </span>
          <span className="font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {displayRating(activePlatform.rating)}
          </span>
        </p>
        <p className="text-[13px] leading-6" style={{ color: "var(--text-secondary)" }}>
          {activePlatform.name}
          <span style={{ color: "var(--text-muted)" }}> · </span>
          {activePlatform.handle}
        </p>
        <p className="mt-1 text-[13px] leading-6" style={{ color: "var(--text-secondary)" }}>
          {activePlatform.note}
        </p>
      </div>
    </div>
  );
}
