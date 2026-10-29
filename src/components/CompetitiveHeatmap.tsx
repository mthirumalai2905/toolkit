"use client";

import React, { useMemo, useState } from "react";
import { COMPETITIVE_STATS } from "@/data/portfolio";
import { ArrowUpRight, Flame } from "lucide-react";

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
  const progressPct = Math.min(
    100,
    Math.round((activePlatform.rawRating / activePlatform.maxRating) * 100)
  );

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
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-[#30d158]">
              <Flame className="h-3.5 w-3.5" />
            </span>
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

      {/* Platform Switcher Card */}
      <div
        className="rounded-2xl border p-4"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: "var(--border-hairline)" }}>
          <div className="flex items-center gap-1.5">
            {COMPETITIVE_STATS.platforms.map((platform) => {
              const active = platform.id === selectedPlatform;
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setSelectedPlatform(platform.id)}
                  className="rounded-full px-3 py-1 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: active
                      ? "var(--text-primary)"
                      : "var(--bg-pill)",
                    color: active
                      ? "var(--bg-column)"
                      : "var(--text-secondary)",
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
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--bg-pill)",
              color: "var(--accent-blue)",
            }}
          >
            Verify Profile
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-3xl font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {activePlatform.rating}
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: `${activePlatform.color}20`,
                  color: activePlatform.color,
                }}
              >
                {activePlatform.rank}
              </span>
            </div>
            <div
              className="mt-1 text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Handle: <span className="font-mono">{activePlatform.handle}</span>
            </div>
          </div>

          <div className="w-full sm:w-48">
            <div
              className="mb-1.5 flex justify-between text-[11px]"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>Percentile / Rating Scale</span>
              <span className="font-mono">{progressPct}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--bg-pill)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: activePlatform.color,
                }}
              />
            </div>
          </div>
        </div>

        <p
          className="mt-3 text-[13.5px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {activePlatform.note}
        </p>
      </div>
    </div>
  );
}
