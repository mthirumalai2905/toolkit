import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookContents } from "@/components/BookContents";
import { BOOKS } from "@/data/books";
import { libraryPath } from "@/lib/site";

type LibraryParams = { slug: string };

export function generateStaticParams(): LibraryParams[] {
  return BOOKS.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LibraryParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = BOOKS.find((entry) => entry.slug === slug);
  if (!book) return { title: "Library" };

  const path = libraryPath(book.slug);
  return {
    title: `${book.title} · Thirumalai`,
    description: book.excerpt,
    alternates: { canonical: path },
    openGraph: {
      title: book.title,
      description: book.excerpt,
      type: "article",
      url: path,
      images: [{ url: book.cover, alt: book.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.excerpt,
      images: [book.cover],
    },
  };
}

export default async function LibraryPage({ params }: { params: Promise<LibraryParams> }) {
  const { slug } = await params;
  const book = BOOKS.find((entry) => entry.slug === slug);
  if (!book) notFound();
  return <BookContents book={book} />;
}
