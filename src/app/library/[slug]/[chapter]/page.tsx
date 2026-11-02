import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscordWorkspace } from "@/components/discord-workspace/DiscordWorkspace";
import { NoteReader } from "@/components/NoteReader";
import { BOOKS } from "@/data/books";
import type { EssayItem } from "@/data/portfolio";
import { libraryChapterPath, libraryPath } from "@/lib/site";

type ChapterParams = { slug: string; chapter: string };

export function generateStaticParams(): ChapterParams[] {
  return BOOKS.flatMap((book) =>
    book.chapters
      .filter((chapter) => chapter.view === "workspace" || chapter.content.length > 0)
      .map((chapter) => ({ slug: book.slug, chapter: chapter.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ChapterParams>;
}): Promise<Metadata> {
  const { slug, chapter: chapterSlug } = await params;
  const book = BOOKS.find((entry) => entry.slug === slug);
  const chapter = book?.chapters.find((entry) => entry.slug === chapterSlug);
  if (!book || !chapter) return { title: "Library" };

  const path = libraryChapterPath(book.slug, chapter.slug);
  return {
    title: `${chapter.title} · ${book.title}`,
    description: chapter.excerpt,
    alternates: { canonical: path },
    openGraph: {
      title: chapter.title,
      description: chapter.excerpt,
      type: "article",
      url: path,
      images: [{ url: book.cover, alt: book.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: chapter.title,
      description: chapter.excerpt,
      images: [book.cover],
    },
  };
}

export default async function ChapterPage({ params }: { params: Promise<ChapterParams> }) {
  const { slug, chapter: chapterSlug } = await params;
  const book = BOOKS.find((entry) => entry.slug === slug);
  const chapter = book?.chapters.find((entry) => entry.slug === chapterSlug);
  if (!book || !chapter) notFound();
  if (chapter.view === "workspace") {
    return (
      <DiscordWorkspace
        backHref={libraryPath(book.slug)}
        bookTitle={book.title}
        bookSlug={book.slug}
        chapter={chapter}
      />
    );
  }
  if (chapter.content.length === 0) notFound();

  const essay: EssayItem = {
    slug: chapter.slug,
    title: chapter.title,
    date: chapter.date,
    dateISO: chapter.dateISO,
    read: chapter.read,
    excerpt: chapter.excerpt,
    tags: chapter.tags,
    content: chapter.content,
    stats: chapter.stats,
  };

  return (
    <NoteReader
      essay={essay}
      kicker={book.title}
      backHref={libraryPath(book.slug)}
      backHint="Back to contents"
      targetPrefix={`book:${book.slug}`}
    />
  );
}
