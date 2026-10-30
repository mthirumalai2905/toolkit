"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { BarChart3, Heart, MessageCircle, Repeat2 } from "lucide-react";
import {
  addComment,
  addLike,
  deleteComment,
  getEngagement,
  type PublicComment,
} from "@/lib/engagement";

const VISITOR_KEY = "portfolio-visitor";
let memoryVisitor = "";

function visitorId() {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, created);
    return created;
  } catch {
    if (!memoryVisitor) memoryVisitor = crypto.randomUUID();
    return memoryVisitor;
  }
}

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const CONFETTI_COLORS = [
  "var(--accent-pink)",
  "var(--accent-blue)",
  "var(--accent-green)",
  "#ffd60a",
];

type ConfettiBit = {
  id: number;
  x: number;
  y: number;
  rot: number;
  color: string;
  delay: number;
  round: boolean;
  size: number;
};

function confettiBits(): ConfettiBit[] {
  return Array.from({ length: 9 }, (_, index) => {
    const angle = -Math.PI + (index / 8) * Math.PI + (Math.random() - 0.5) * 0.3;
    const distance = 28 + Math.random() * 22;
    return {
      id: index,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rot: Math.round((Math.random() - 0.5) * 160),
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      delay: Math.round(Math.random() * 40),
      round: index % 2 === 0,
      size: index % 3 === 0 ? 7 : 5,
    };
  });
}

export function EngagementBar({
  targetId,
  reposts,
  views,
}: {
  targetId: string;
  reposts: number;
  views: string;
}) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<"repost" | "views" | null>(null);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const likeQueue = useRef(Promise.resolve());
  const likesInFlight = useRef(0);
  const burstId = useRef(0);
  const [bursts, setBursts] = useState<{ id: number; bits: ConfettiBit[] }[]>([]);
  const hasMine = comments.some((comment) => comment.mine);

  useEffect(() => {
    let cancelled = false;
    getEngagement(targetId, visitorId())
      .then((result) => {
        if (cancelled) return;
        setLikes(result.likes);
        setLiked(result.liked);
        setComments(result.comments);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [targetId]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function onLike() {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = burstId.current++;
      setBursts((current) => [...current, { id, bits: confettiBits() }]);
      window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id));
      }, 900);
    }
    likesInFlight.current += 1;
    setLikes((count) => count + 1);
    setLiked(true);
    likeQueue.current = likeQueue.current
      .catch(() => undefined)
      .then(async () => {
        try {
          const result = await addLike(targetId, visitorId());
          likesInFlight.current -= 1;
          if (likesInFlight.current === 0) setLikes(result.likes);
          setLiked(true);
        } catch {
          likesInFlight.current -= 1;
          setLikes((count) => Math.max(0, count - 1));
        }
      });
  }

  async function onComment(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result = await addComment(targetId, visitorId(), name, body);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setComments((current) => [...current, result.comment]);
      setBody("");
      setOpen(false);
    } catch {
      setError("Couldn't save that. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function onDelete(commentId: string) {
    setError("");
    setDeletingId(commentId);
    try {
      const result = await deleteComment(targetId, visitorId(), commentId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } catch {
      setError("Couldn't delete that.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="mt-2" onClick={(event) => event.stopPropagation()}>
      <div className="flex max-w-md items-center justify-between text-[12px] text-muted">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-1.5 rounded-full py-1 hover:text-ink"
          aria-expanded={open}
          aria-label="Comments"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
          <span className="tabular-nums">{comments.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setNotice("repost")}
          className="relative inline-flex items-center gap-1.5 rounded-full py-1 hover:text-ink"
          aria-label="Reposts"
        >
          <Repeat2 className="h-4 w-4" strokeWidth={1.75} />
          <span className="tabular-nums">{reposts}</span>
          {notice === "repost" && <Oops />}
        </button>
        <button
          type="button"
          onClick={onLike}
          className={`inline-flex items-center gap-1.5 rounded-full py-1 hover:text-ink ${
            liked ? "text-love" : ""
          }`}
          aria-label="Like"
        >
          <span className="relative inline-flex">
            <Heart className="h-4 w-4" strokeWidth={1.75} fill={liked ? "currentColor" : "none"} />
            {bursts.map((burst) =>
              burst.bits.map((bit) => (
                <span
                  key={`${burst.id}-${bit.id}`}
                  aria-hidden
                  className="like-confetti"
                  style={
                    {
                      "--x": `${bit.x}px`,
                      "--y": `${bit.y}px`,
                      "--rot": `${bit.rot}deg`,
                      backgroundColor: bit.color,
                      width: bit.size,
                      height: bit.round ? bit.size : bit.size + 2,
                      borderRadius: bit.round ? 999 : 1,
                      animationDelay: `${bit.delay}ms`,
                    } as CSSProperties
                  }
                />
              )),
            )}
          </span>
          <span className="tabular-nums">{likes}</span>
        </button>
        <button
          type="button"
          onClick={() => setNotice("views")}
          className="relative inline-flex items-center gap-1.5 rounded-full py-1 hover:text-ink"
          aria-label="Views"
        >
          <BarChart3 className="h-4 w-4" strokeWidth={1.75} />
          <span className="tabular-nums">{views}</span>
          {notice === "views" && <Oops />}
        </button>
      </div>

      {open && (
        <div className="mt-3">
          {comments.length > 0 && (
            <ul className="space-y-2">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-2xl bg-pill px-3 py-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] font-semibold text-ink">{comment.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] text-faint">{when(comment.createdAt)}</span>
                      {comment.mine && (
                        <button
                          type="button"
                          onClick={() => onDelete(comment.id)}
                          disabled={deletingId === comment.id}
                          className="text-[11px] font-medium text-faint hover:text-love disabled:opacity-60"
                        >
                          {deletingId === comment.id ? "Deleting" : "Delete"}
                        </button>
                      )}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-5 text-ink">{comment.body}</p>
                </li>
              ))}
            </ul>
          )}
          {hasMine ? (
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Only one comment per person. Delete yours to write another.
            </p>
          ) : (
            <form onSubmit={onComment} className="mt-2 space-y-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={40}
                placeholder="Name"
                aria-label="Name"
                className="w-full rounded-xl bg-pill px-3 py-2 text-[13px] text-ink outline-none placeholder:text-faint"
              />
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Say something"
                aria-label="Comment"
                className="w-full resize-none rounded-xl bg-pill px-3 py-2 text-[13px] leading-5 text-ink outline-none placeholder:text-faint"
              />
              {error && <p className="text-[12px] text-love">{error}</p>}
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-accent px-3 py-1 text-[13px] font-semibold text-white disabled:opacity-60"
              >
                {pending ? "Sending" : "Comment"}
              </button>
            </form>
          )}
          {hasMine && error && <p className="mt-2 text-[12px] text-love">{error}</p>}
        </div>
      )}
    </div>
  );
}

function Oops() {
  return (
    <span
      role="status"
      className="absolute bottom-[calc(100%+8px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-page"
    >
      Oops, this isn&apos;t Twitter.
    </span>
  );
}
