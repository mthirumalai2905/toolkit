import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteReader } from "@/components/NoteReader";
import { ESSAYS } from "@/data/portfolio";
import { notePath } from "@/lib/site";

type NoteParams = { slug: string };

export function generateStaticParams(): NoteParams[] {
  return ESSAYS.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<NoteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = ESSAYS.find((entry) => entry.slug === slug);
  if (!essay) return { title: "Note" };

  const path = notePath(essay.slug);
  return {
    title: `${essay.title} · Thirumalai`,
    description: essay.excerpt,
    alternates: { canonical: path },
    openGraph: {
      title: essay.title,
      description: essay.excerpt,
      type: "article",
      url: path,
      images: [
        {
          url: "/banner.jpg",
          width: 736,
          height: 414,
          alt: essay.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: essay.title,
      description: essay.excerpt,
      images: ["/banner.jpg"],
    },
  };
}

export default async function NotePage({ params }: { params: Promise<NoteParams> }) {
  const { slug } = await params;
  const essay = ESSAYS.find((entry) => entry.slug === slug);
  if (!essay) notFound();
  return <NoteReader essay={essay} />;
}
