import type { EssayBlock } from "@/data/portfolio";

export interface BookChapter {
  slug: string;
  number: string;
  title: string;
  date: string;
  dateISO: string;
  read: string;
  excerpt: string;
  tags: string[];
  content: EssayBlock[];
  view?: "workspace";
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views: string;
  };
}

export interface Book {
  slug: string;
  title: string;
  cover: string;
  read: string;
  excerpt: string;
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views: string;
  };
  chapters: BookChapter[];
}

function comingSoonChapters(count = 5): BookChapter[] {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      slug: `coming-soon-${number}`,
      number,
      title: "Coming soon",
      date: "",
      dateISO: "",
      read: "",
      excerpt: "",
      tags: [],
      stats: { replies: 0, reposts: 0, likes: 0, views: "" },
      content: [],
    };
  });
}

export const BOOKS: Book[] = [
  {
    slug: "discord-system-design",
    title: "Discord System Design",
    cover: "/library/book-discord.jpg?v=4",
    read: "5 chapters",
    excerpt:
      "A server is a place with rooms. A message has to land in order, reach the people who are actually here, and stay out of the way until someone asks for the rest.",
    stats: { replies: 12, reposts: 19, likes: 164, views: "3.4K" },
    chapters: [
      {
        slug: "high-level-design",
        number: "01",
        title: "High level Design",
        date: "Nov 2, 2026",
        dateISO: "2026-11-02",
        read: "12 min read",
        excerpt:
          "A room has to look the same on the web, on a desktop, and on a phone. This is the picture of how that room is put together.",
        tags: ["Architecture", "Realtime"],
        view: "workspace",
        stats: { replies: 4, reposts: 7, likes: 86, views: "1.4K" },
        content: [],
      },
      {
        slug: "coming-soon-02",
        number: "02",
        title: "Coming soon",
        date: "",
        dateISO: "",
        read: "",
        excerpt: "",
        tags: [],
        stats: { replies: 0, reposts: 0, likes: 0, views: "" },
        content: [],
      },
      {
        slug: "coming-soon-03",
        number: "03",
        title: "Coming soon",
        date: "",
        dateISO: "",
        read: "",
        excerpt: "",
        tags: [],
        stats: { replies: 0, reposts: 0, likes: 0, views: "" },
        content: [],
      },
      {
        slug: "coming-soon-04",
        number: "04",
        title: "Coming soon",
        date: "",
        dateISO: "",
        read: "",
        excerpt: "",
        tags: [],
        stats: { replies: 0, reposts: 0, likes: 0, views: "" },
        content: [],
      },
      {
        slug: "coming-soon-05",
        number: "05",
        title: "Coming soon",
        date: "",
        dateISO: "",
        read: "",
        excerpt: "",
        tags: [],
        stats: { replies: 0, reposts: 0, likes: 0, views: "" },
        content: [],
      },
    ],
  },
  {
    slug: "netflix-system-design",
    title: "Netflix System Design",
    cover: "/library/book-netflix.jpg?v=1",
    read: "Coming soon",
    excerpt: "",
    stats: { replies: 0, reposts: 8, likes: 0, views: "1.6K" },
    chapters: comingSoonChapters(),
  },
  {
    slug: "whatsapp-system-design",
    title: "WhatsApp System Design",
    cover: "/library/book-whatsapp.jpg?v=1",
    read: "Coming soon",
    excerpt: "",
    stats: { replies: 0, reposts: 6, likes: 0, views: "1.2K" },
    chapters: comingSoonChapters(),
  },
  {
    slug: "cassandra-system-design",
    title: "Cassandra System Design",
    cover: "/library/book-cassandra.jpg?v=3",
    read: "Coming soon",
    excerpt: "",
    stats: { replies: 0, reposts: 4, likes: 0, views: "980" },
    chapters: comingSoonChapters(),
  },
];
