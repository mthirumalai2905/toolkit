"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Link2,
  MapPin,
  Pin,
} from "lucide-react";
import { ClientMap } from "@/components/ClientMap";
import { DesignDesk } from "@/components/DesignDesk";
import { EngagementBar } from "@/components/EngagementBar";
import { CompetitiveHeatmap } from "@/components/CompetitiveHeatmap";
import { ThemeSwitch, useTheme } from "@/components/theme";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  EDUCATION,
  ESSAYS,
  EXPERIENCES,
  isLatestEssay,
  PROFILE,
  PROJECTS,
  TOOLKIT,
  type ExperienceItem,
  type ProjectItem,
} from "@/data/portfolio";
import { notePath } from "@/lib/site";

type TabId = "posts" | "work" | "experience" | "notes";
type Stats = { replies: number; reposts: number; likes: number; views: string };
type OpenItem =
  | { kind: "project"; id: string }
  | { kind: "experience"; slug: string };

const TABS: { id: TabId; label: string }[] = [
  { id: "posts", label: "Posts" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "notes", label: "Notes" },
];

const POST_COUNT = 4;

function Avatar({
  size,
  priority = false,
  alt = "",
}: {
  size: number;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full bg-elevated"
      style={{ width: size, height: size }}
    >
      <Image
        src="/avatar.jpg"
        alt={alt}
        fill
        priority={priority}
        unoptimized
        quality={100}
        sizes={`${size}px`}
        className="object-cover"
        style={{ objectPosition: "center 18%" }}
      />
    </span>
  );
}

function Post({
  date,
  pinned = false,
  stats,
  targetId,
  onOpen,
  children,
}: {
  date?: string;
  pinned?: boolean;
  stats?: Stats;
  targetId?: string;
  onOpen?: () => void;
  children: ReactNode;
}) {
  return (
    <article
      className={`px-4 py-2.5 ${
        onOpen ? "cursor-pointer transition-colors hover:bg-card-hover" : ""
      }`}
      onClick={onOpen}
    >
      {pinned && (
        <div className="mb-1 flex items-center gap-1.5 pl-10 text-[12px] font-medium text-faint">
          <Pin className="h-3.5 w-3.5" strokeWidth={2} />
          Pinned
        </div>
      )}
      <div className="flex gap-2.5">
        <Avatar size={32} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[13px] leading-5">
            <span className="font-semibold tracking-[-0.01em] text-ink">
              {PROFILE.name}
            </span>
            <VerifiedBadge className="h-3.5 w-3.5" />
            <span className="text-muted">{PROFILE.handle}</span>
            {date && (
              <>
                <span className="text-faint">·</span>
                <span className="text-muted">{date}</span>
              </>
            )}
          </div>
          <div className="mt-1 text-[13px] leading-6 text-ink">{children}</div>
          {stats && targetId && (
            <EngagementBar targetId={targetId} reposts={stats.reposts} views={stats.views} />
          )}
        </div>
      </div>
    </article>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 pb-1 pt-5 text-[12px] font-medium text-faint">
      {children}
    </div>
  );
}

function externalProps(href: string) {
  if (href.startsWith("http")) {
    return { target: "_blank", rel: "noopener noreferrer" } as const;
  }
  return {};
}

function ProjectBody({ project }: { project: ProjectItem }) {
  const cta = project.href.includes("calendly")
    ? "Request a walkthrough"
    : "Open project";

  return (
    <>
      <p className="text-[13px] leading-6">{project.tagline}</p>
      <p className="mt-2 text-[13px] leading-6 text-muted">{project.description}</p>
      <a
        href={project.href}
        {...externalProps(project.href)}
        onClick={(event) => event.stopPropagation()}
        className="mt-3 block overflow-hidden rounded-2xl bg-card transition-colors hover:bg-card-hover"
      >
        <div className="px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold tracking-[-0.02em]">{project.name}</div>
              <div className="mt-0.5 truncate text-[13px] text-muted">{project.handle}</div>
            </div>
            <span className="shrink-0 rounded-full bg-pill px-2.5 py-1 text-[12px] text-muted">
              {project.metricLabel}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-5 text-muted">{project.stack.join(" · ")}</p>
        </div>
        <div className="flex items-center gap-1 px-4 pb-3.5 text-[13px] font-medium text-accent">
          {cta}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </a>
    </>
  );
}

function Detail({ item }: { item: OpenItem }) {
  const titleId = useId();
  const project =
    item.kind === "project"
      ? PROJECTS.find((entry) => entry.id === item.id)
      : undefined;
  const role =
    item.kind === "experience"
      ? EXPERIENCES.find((entry) => entry.slug === item.slug)
      : undefined;

  if (!project && !role) return null;

  return (
    <article className="px-4 pb-16 pt-5">
      <div className="mb-5 flex items-center gap-2.5">
        <Avatar size={36} alt={PROFILE.name} />
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-[13px]">
            <span className="font-semibold tracking-[-0.01em]">{PROFILE.name}</span>
            <VerifiedBadge className="h-3.5 w-3.5" />
          </div>
          <p className="text-[13px] text-muted">{PROFILE.handle}</p>
        </div>
      </div>
      {project && <ProjectDetail project={project} titleId={titleId} />}
      {role && <ExperienceDetail role={role} titleId={titleId} />}
    </article>
  );
}

function ProjectDetail({
  project,
  titleId,
}: {
  project: ProjectItem;
  titleId: string;
}) {
  const cta = project.href.includes("calendly")
    ? "Request a walkthrough"
    : "Open project";

  return (
    <div>
      <p className="text-[13px] text-muted">{project.handle}</p>
      <h2 id={titleId} className="mt-1 text-[28px] font-bold tracking-[-0.03em]">
        {project.name}
      </h2>
      <p className="mt-2 text-[17px] leading-6 text-ink">{project.tagline}</p>
      <p className="mt-4 text-[13px] leading-6 text-muted">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span
            key={item}
            className="rounded-full bg-pill px-3 py-1 text-[13px] font-medium text-ink"
          >
            {item}
          </span>
        ))}
      </div>
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold tracking-[-0.03em]">
            {project.metric}
          </div>
          <div className="text-[13px] text-faint">{project.metricLabel}</div>
        </div>
        <a
          href={project.href}
          {...externalProps(project.href)}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white"
        >
          {cta}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function ExperienceDetail({
  role,
  titleId,
}: {
  role: ExperienceItem;
  titleId: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        {role.logo ? (
          <Image
            src={role.logo}
            alt=""
            width={36}
            height={36}
            unoptimized
            quality={100}
            className="h-9 w-9 rounded-full bg-card object-contain"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pill text-sm font-bold">
            {role.company.slice(0, 1)}
          </span>
        )}
        <div>
          <h2 id={titleId} className="text-[26px] font-bold leading-none tracking-[-0.03em]">
            {role.company}
          </h2>
          <p className="mt-1 text-[13px] text-muted">{role.handle}</p>
        </div>
      </div>
      <p className="mt-4 text-[17px] font-medium">
        {role.role}
        <span className="text-muted"> · {role.type}</span>
      </p>
      <p className="mt-1 text-[13px] text-muted">
        {role.period}
        {role.duration ? ` · ${role.duration}` : ""}
      </p>
      <p className="mt-1 text-[13px] font-medium text-accent">{role.location}</p>
      <p className="mt-5 text-[13px] leading-6 text-ink">{role.summary}</p>
      {role.context && (
        <p className="mt-3 text-[13px] leading-6 text-muted">{role.context}</p>
      )}
      <h3 className="mt-8 text-[15px] font-semibold tracking-[-0.02em]">The work</h3>
      <ol className="mt-3">
        {role.highlights.map((highlight, index) => (
          <li key={highlight.title} className="grid grid-cols-[2rem_1fr] gap-3 py-4">
            <span className="pt-0.5 text-[13px] tabular-nums text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="font-semibold tracking-[-0.01em]">{highlight.title}</div>
              <p className="mt-1 text-[13px] leading-6 text-muted">{highlight.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex flex-wrap gap-2">
        {role.tech.map((item) => (
          <span key={item} className="rounded-full bg-pill px-3 py-1 text-[13px] text-ink">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Portfolio() {
  const { theme, applyTheme } = useTheme();
  const [tab, setTab] = useState<TabId>("posts");
  const [designOpen, setDesignOpen] = useState(false);
  const [open, setOpen] = useState<OpenItem | null>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    if (!open) return;
    window.scrollTo(0, 0);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const y = scrollY.current;
      setOpen(null);
      requestAnimationFrame(() => window.scrollTo(0, y));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function openItem(item: OpenItem) {
    scrollY.current = window.scrollY;
    setOpen(item);
  }

  function closeItem() {
    const y = scrollY.current;
    setOpen(null);
    requestAnimationFrame(() => window.scrollTo(0, y));
  }

  const detailLabel = open?.kind === "project" ? "Work" : "Experience";

  const github = PROFILE.socials.find((item) => item.label === "GitHub");

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className="mx-auto min-h-screen w-full max-w-[520px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-page/75 px-4 py-1.5 backdrop-blur-xl">
          {open ? (
            <button
              type="button"
              onClick={closeItem}
              className="flex min-w-0 items-center gap-2 rounded-full py-1 text-left"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pill text-ink">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-semibold tracking-[-0.02em]">
                  {detailLabel}
                </span>
                <span className="block text-[12px] text-muted">Back to profile</span>
              </span>
            </button>
          ) : (
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h1 className="truncate text-[15px] font-semibold tracking-[-0.02em]">
                  {PROFILE.name}
                </h1>
                <VerifiedBadge className="h-4 w-4" />
              </div>
              <p className="text-[12px] text-muted">{POST_COUNT} posts</p>
            </div>
          )}
          <div className="ml-auto">
            <ThemeSwitch theme={theme} onChange={applyTheme} />
          </div>
        </header>

        {open ? (
          <Detail item={open} />
        ) : (
          <>

        <div className="px-4 pt-2">
          <div className="relative h-[108px] w-full overflow-hidden rounded-[18px] sm:h-[124px]">
            <Image
              src="/banner.jpg"
              alt="A torii gate standing in still water under a quiet sky"
              fill
              priority
              unoptimized
              quality={100}
              sizes="520px"
              className="object-cover"
              style={{ objectPosition: "center 42%" }}
            />
          </div>
        </div>

        <div className="relative px-4">
          <div className="absolute -top-10 left-5">
            <span className="relative block h-20 w-20 overflow-hidden rounded-full bg-page ring-[3px] ring-page">
              <Image
                src="/avatar.jpg"
                alt="Thirumalai"
                fill
                priority
                unoptimized
                quality={100}
                sizes="80px"
                className="object-cover"
                style={{ objectPosition: "center 16%" }}
              />
            </span>
          </div>

          <div className="flex justify-end gap-2 pb-1 pt-2">
            <a
              href={PROFILE.resumeUrl}
              download
              className="inline-flex items-center rounded-full bg-pill px-3 py-1 text-[13px] font-medium text-ink transition-colors hover:bg-card-hover"
            >
              Resume
            </a>
            <a
              href={PROFILE.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Book a call
            </a>
          </div>

          <div className="pb-2 pt-4">
            <div className="flex items-center gap-1">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
                {PROFILE.name}
              </h2>
              <VerifiedBadge className="h-[15px] w-[15px]" />
            </div>
            <p className="text-[13px] text-muted">{PROFILE.handle}</p>
            <p className="mt-3 max-w-[52ch] text-[13px] leading-6">{PROFILE.headline}</p>
            <p className="mt-2 text-[13px] leading-6 text-muted">
              {PROFILE.bioParagraphs[1]}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1 text-accent">
                <MapPin className="h-4 w-4" strokeWidth={1.75} />
                {PROFILE.location}
              </span>
              {github && (
                <a
                  href={github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  <Link2 className="h-4 w-4" strokeWidth={1.75} />
                  {github.handle}
                </a>
              )}
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
                {PROFILE.joined}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
              {PROFILE.socials
                .filter((item) => item.label !== "GitHub")
                .map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {item.label}
                  </a>
                ))}
            </div>

            <div className="mt-3 flex gap-5 text-[13px]">
              <span>
                <span className="font-bold text-ink">{PROFILE.stats.following}</span>{" "}
                <span className="text-muted">Following</span>
              </span>
              <span>
                <span className="font-bold text-ink">{PROFILE.stats.followers}</span>{" "}
                <span className="text-muted">Followers</span>
              </span>
            </div>
          </div>
        </div>

        <nav className="sticky top-[44px] z-20 flex bg-page/75 backdrop-blur-xl">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={active ? "page" : undefined}
                className="relative flex-1 py-2.5 text-[13px] transition-colors hover:bg-card-hover"
              >
                <span className={active ? "font-bold text-ink" : "font-medium text-muted"}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </nav>

        <section>
          {tab === "posts" && (
            <>
              <Post pinned date="Now" targetId="post:discord" stats={{ replies: 24, reposts: 41, likes: 318, views: "6.2K" }}>
                <p>
                  I&apos;m really active on Discord, talking about and distributing the
                  real-time web. Presence, sync, and the feeling that a product is still
                  alive while you&apos;re in it{" "}
                  <a
                    href={PROFILE.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline decoration-dotted underline-offset-4"
                  >
                    Discord
                  </a>.
                </p>
              </Post>
              <Post date="Creativity" targetId="post:creativity" stats={{ replies: 11, reposts: 16, likes: 142, views: "2.4K" }}>
                <p>
                  The other half is creativity. A desktop you can drag around, an image
                  from a sentence, a Pokédex you can poke. I like the systems, and I like
                  when they feel made by a person.
                </p>
              </Post>
              <Post date="Worldwide" targetId="post:clients" stats={{ replies: 8, reposts: 14, likes: 121, views: "2.2K" }}>
                <p>
                  Clients from all over. Same work, different coasts and time zones.
                </p>
                <ClientMap />
              </Post>
              <Post date="1,033 days" targetId="post:streak" stats={{ replies: 21, reposts: 36, likes: 290, views: "5.6K" }}>
                <p>
                  <span className="font-semibold">1,033+ day streak.</span> Top 4% on
                  LeetCode, Specialist on Codeforces, 4★ on CodeChef.
                </p>
                <div className="mt-3">
                  <CompetitiveHeatmap />
                </div>
              </Post>
            </>
          )}

          {tab === "work" && (
            <>
              {PROJECTS.map((project) => (
                <Post
                  key={project.id}
                  date={project.date}
                  targetId={`work:${project.id}`}
                  stats={project.stats}
                  onOpen={() => openItem({ kind: "project", id: project.id })}
                >
                  <ProjectBody project={project} />
                </Post>
              ))}
            </>
          )}

          {tab === "experience" && (
            <>
              {EXPERIENCES.map((role) => (
                <Post
                  key={role.slug}
                  date={role.period}
                  targetId={`experience:${role.slug}`}
                  stats={role.stats}
                  onOpen={() => openItem({ kind: "experience", slug: role.slug })}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-semibold">
                        {role.role}
                        {role.current && (
                          <span className="ml-2 rounded-full bg-pill px-2 py-0.5 text-[11px] font-semibold text-good">
                            Now
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[13px] text-muted">
                        {role.company} · {role.type}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-[13px] leading-6 text-muted">{role.preview}</p>
                  <p className="mt-2 text-[13px]">
                    <span className="font-medium text-accent">{role.location}</span>
                    {role.duration && <span className="text-faint"> · {role.duration}</span>}
                  </p>
                  {role.tech.length > 0 && (
                    <p className="mt-2 text-[13px] leading-5 text-muted">
                      {role.tech.join(" · ")}
                    </p>
                  )}
                </Post>
              ))}

              <Label>Education</Label>
              <Post date="2019 — 2025" targetId="education" stats={{ replies: 6, reposts: 9, likes: 98, views: "1.8K" }}>
                <ul className="divide-y divide-line-subtle">
                  {EDUCATION.map((item) => (
                    <li key={item.school} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold tracking-[-0.01em]">{item.school}</span>
                        <span className="shrink-0 text-[13px] text-faint">{item.period}</span>
                      </div>
                      <p className="mt-1 text-[14px] leading-5 text-muted">{item.degree}</p>
                      <p className="mt-1 text-[13px] font-medium text-accent">{item.location}</p>
                      <p className="mt-1 text-[13px] font-semibold text-accent">{item.highlight}</p>
                    </li>
                  ))}
                </ul>
              </Post>

              <Label>Toolkit</Label>
              <Post date="Stack" targetId="toolkit" stats={{ replies: 7, reposts: 11, likes: 104, views: "1.9K" }}>
                <p className="mb-2 text-muted">What I reach for when a system has to ship.</p>
                <ul>
                  {TOOLKIT.map((group) => (
                    <li
                      key={group.id}
                      className="grid gap-1 border-t border-line-subtle py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-4"
                    >
                      <span className="text-[14px] font-semibold">{group.category}</span>
                      <span className="text-[14px] leading-6 text-muted">
                        {group.items.join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </Post>

              <Post date="Open" targetId="reach-out" stats={{ replies: 4, reposts: 6, likes: 72, views: "1.1K" }}>
                <p className="text-[18px] font-semibold tracking-[-0.02em]">Reach out.</p>
                <p className="mt-1 text-muted">
                  Hard AI problems, production systems, or just a sharp conversation.
                </p>
                <a
                  href={PROFILE.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white"
                >
                  Book 30 minutes
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Post>
            </>
          )}

          {tab === "notes" &&
            ESSAYS.map((essay) => (
              <Post key={essay.slug} date={essay.date} targetId={`note:${essay.slug}`} stats={essay.stats}>
                <p className="text-[13px] text-muted">{essay.read}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Link
                    href={notePath(essay.slug)}
                    className="text-[16px] font-semibold tracking-[-0.02em] hover:underline"
                  >
                    {essay.title}
                  </Link>
                  {isLatestEssay(essay.slug) && (
                    <span className="rounded-full bg-pill px-2 py-0.5 text-[11px] font-semibold text-accent">
                      Latest
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[13px] leading-6 text-muted">{essay.excerpt}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {essay.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-pill px-2.5 py-0.5 text-[12px] text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </Post>
            ))}
        </section>

        <footer className="px-4 py-8 text-center text-[13px] text-faint">
          Designed and built by {PROFILE.name}.
        </footer>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => setDesignOpen((open) => !open)}
        aria-label={designOpen ? "Close design table" : "Open design table"}
        className="fixed bottom-5 right-5 z-[60] h-11 w-11 overflow-hidden rounded-full shadow-[0_8px_18px_rgba(0,0,0,0.28)] ring-2 ring-white"
      >
        <img
          src="/design/profile-mark.jpg?v=3"
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "center" }}
        />
      </button>
      {designOpen && <DesignDesk onClose={() => setDesignOpen(false)} />}
    </div>
  );
}
