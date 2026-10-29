"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeSwitch, useTheme } from "@/components/theme";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { PROFILE, type EssayItem } from "@/data/portfolio";

export function NoteReader({ essay }: { essay: EssayItem }) {
  const { theme, applyTheme } = useTheme();

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className="mx-auto min-h-screen w-full max-w-[520px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-page/75 px-4 py-1.5 backdrop-blur-xl">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 rounded-full py-1 text-left"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pill text-ink">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold tracking-[-0.02em]">
                Note
              </span>
              <span className="block text-[12px] text-muted">Back to profile</span>
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
            <time dateTime={essay.dateISO}>{essay.date}</time>
            <span>·</span>
            <span>{essay.read}</span>
          </div>
          <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-[-0.03em]">
            {essay.title}
          </h1>
          <p className="mt-3 text-[16px] leading-6 text-muted">{essay.excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {essay.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-pill px-3 py-1 text-[12px] font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {essay.content.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <h2 key={index} className="pt-2 text-[20px] font-semibold tracking-[-0.02em]">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={index}
                    className="text-[17px] leading-7 tracking-[-0.02em] text-ink"
                  >
                    {block.text}
                  </blockquote>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={index} className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted">
                    {block.items?.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-[15px] leading-7 text-ink">
                  {block.text}
                </p>
              );
            })}
          </div>
        </article>
      </div>
    </div>
  );
}
