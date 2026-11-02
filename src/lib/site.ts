export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3010";
}

export function notePath(slug: string) {
  return `/notes/${slug}`;
}

export function libraryPath(slug: string) {
  return `/library/${slug}`;
}

export function libraryChapterPath(book: string, chapter: string) {
  return `/library/${book}/${chapter}`;
}
