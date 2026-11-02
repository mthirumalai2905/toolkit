"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EngagementBar } from "@/components/EngagementBar";
import { ThemeSwitch, useTheme } from "@/components/theme";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { HldCanvas } from "@/components/discord-workspace/HldCanvas";
import { ChapterSections } from "@/components/discord-workspace/Sections";
import { STORAGE_KEY, createSeed, type WorkspaceState } from "@/components/discord-workspace/model";
import { PROFILE } from "@/data/portfolio";
import type { BookChapter } from "@/data/books";

export function DiscordWorkspace({
  backHref,
  bookTitle,
  bookSlug,
  chapter,
}: {
  backHref: string;
  bookTitle: string;
  bookSlug: string;
  chapter: BookChapter;
}) {
  const { theme, applyTheme } = useTheme();
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<WorkspaceState>(() => createSeed());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WorkspaceState;
        if (parsed.version === 1 && Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          setState(parsed);
        }
      }
    } catch {
      /* keep the seed */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  function reset() {
    setState(createSeed());
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className="mx-auto min-h-screen w-full max-w-[520px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-page/75 px-4 py-1.5 backdrop-blur-xl">
          <Link href={backHref} className="flex min-w-0 items-center gap-2 rounded-full py-1 text-left">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pill text-ink">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold tracking-[-0.02em]">{bookTitle}</span>
              <span className="block text-[12px] text-muted">Back to contents</span>
            </span>
          </Link>
          <div className="ml-auto">
            <ThemeSwitch theme={theme} onChange={applyTheme} />
          </div>
        </header>

        <article className="px-4 pb-16 pt-5">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-elevated">
              <Image
                src="/avatar.jpg"
                alt={PROFILE.name}
                fill
                unoptimized
                quality={100}
                sizes="36px"
                className="object-cover"
                style={{ objectPosition: "center 18%" }}
              />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[13px]">
                <span className="font-semibold tracking-[-0.01em]">{PROFILE.name}</span>
                <VerifiedBadge className="h-3.5 w-3.5" />
              </div>
              <p className="text-[13px] text-muted">{PROFILE.handle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
            <time dateTime={chapter.dateISO}>{chapter.date}</time>
            <span>·</span>
            <span>{chapter.read}</span>
          </div>
          <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-[-0.03em]">{chapter.title}</h1>
          <p className="mt-3 text-[16px] leading-6 text-muted">{chapter.excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {chapter.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-pill px-3 py-1 text-[12px] font-medium text-muted">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-[15px] leading-7 text-ink">
              People open the same place from a browser, a desktop app, or a phone. The room they land in has to be the same room, with the same history, whether they were here a second ago or not at all.
            </p>
            <p className="text-[15px] leading-7 text-ink">
              This chapter is the high level design. One picture for the whole system, then the requirements, the records, and the calls underneath it. It is a proposal from how the product behaves in public. It is not a map of a production cluster, and every technology on a box can be swapped.
            </p>
            <p className="text-[15px] leading-7 text-ink">
              Clients talk to an edge. The edge talks to the service that owns the action. Messaging writes the log first. A queue then carries the event to the people who are looking, the people who are away, and the search index.
            </p>

            <figure>
              <div className="h-[520px] overflow-hidden rounded-[18px] bg-[#0c0f14] text-[#e8e6e3]">
                <HldCanvas framed state={state} onChange={setState} />
              </div>
              <figcaption className="mt-2 flex items-baseline justify-between gap-3 text-[13px] leading-5 text-muted">
                <span>Drag a box. Draw from the dot on its right. Scroll to zoom.</span>
                <button type="button" onClick={reset} className="shrink-0 text-[12px] text-faint">
                  Reset
                </button>
              </figcaption>
            </figure>

            <ChapterSections state={state} />
          </div>

          <div className="mt-8">
            <EngagementBar
              targetId={`book:${bookSlug}:${chapter.slug}`}
              reposts={chapter.stats.reposts}
              views={chapter.stats.views}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
