"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeSwitch, useTheme } from "@/components/theme";
import { libraryChapterPath } from "@/lib/site";
import type { Book } from "@/data/books";

export function BookContents({ book }: { book: Book }) {
  const { theme, applyTheme } = useTheme();

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className="mx-auto min-h-screen w-full max-w-[520px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-page/75 px-4 py-1.5 backdrop-blur-xl">
          <Link
            href="/?tab=library"
            className="flex min-w-0 items-center gap-2 rounded-full py-1 text-left"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pill text-ink">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold tracking-[-0.02em]">
                Library
              </span>
              <span className="block text-[12px] text-muted">Back to profile</span>
            </span>
          </Link>
          <div className="ml-auto">
            <ThemeSwitch theme={theme} onChange={applyTheme} />
          </div>
        </header>

        <article className="px-4 pb-16 pt-5">
          <p className="text-[13px] text-muted">{book.read}</p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-[-0.03em]">
            {book.title}
          </h1>
          {book.excerpt ? (
            <p className="mt-3 text-[16px] leading-6 text-muted">{book.excerpt}</p>
          ) : null}

          <h2 className="mb-1 mt-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">
            Contents
          </h2>
          <ol>
            {book.chapters.map((chapter) => {
              const open = chapter.view === "workspace" || chapter.content.length > 0;
              const row = (
                <>
                  <span className={`pt-0.5 text-[13px] tabular-nums ${open ? "text-accent" : "text-faint"}`}>
                    {chapter.number}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[16px] font-semibold tracking-[-0.02em] ${open ? "" : "text-muted"}`}>
                      {chapter.title}
                    </span>
                    {chapter.excerpt ? (
                      <span className="mt-1 block text-[13px] leading-5 text-muted">{chapter.excerpt}</span>
                    ) : null}
                    {chapter.read ? (
                      <span className="mt-1 block text-[12px] text-faint">{chapter.read}</span>
                    ) : null}
                  </span>
                </>
              );
              return (
                <li key={chapter.slug} className="border-t border-line-subtle">
                  {open ? (
                    <Link href={libraryChapterPath(book.slug, chapter.slug)} className="grid grid-cols-[2.25rem_1fr] gap-3 py-4">
                      {row}
                    </Link>
                  ) : (
                    <div className="grid grid-cols-[2.25rem_1fr] gap-3 py-4">{row}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </article>
      </div>
    </div>
  );
}
