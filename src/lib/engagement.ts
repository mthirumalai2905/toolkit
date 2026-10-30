"use server";

import { randomUUID } from "crypto";
import { ensureSchema, sql } from "@/lib/db";

export type PublicComment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
  mine: boolean;
};

const TARGET = /^[a-z0-9:_-]{1,80}$/;
const VISITOR = /^[a-zA-Z0-9_-]{8,80}$/;

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function validPair(targetId: string, visitorId: string) {
  return TARGET.test(targetId) && VISITOR.test(visitorId);
}

export async function getEngagement(targetId: string, visitorId: string) {
  if (!validPair(targetId, visitorId)) {
    return { likes: 0, liked: false, comments: [] as PublicComment[] };
  }

  await ensureSchema();
  const db = sql();
  const [likeRows, mine, commentRows] = await Promise.all([
    db`SELECT count(*)::int AS count FROM likes WHERE target_id = ${targetId}`,
    db`SELECT 1 AS liked FROM likes WHERE target_id = ${targetId} AND visitor_id = ${visitorId} LIMIT 1`,
    db`
      SELECT id, visitor_id, name, body, created_at
      FROM comments
      WHERE target_id = ${targetId}
      ORDER BY created_at ASC
      LIMIT 80
    `,
  ]);

  const count = likeRows[0]?.count;
  return {
    likes: typeof count === "number" ? count : Number(count ?? 0),
    liked: mine.length > 0,
    comments: commentRows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      body: String(row.body),
      createdAt: new Date(String(row.created_at)).toISOString(),
      mine: String(row.visitor_id) === visitorId,
    })),
  };
}

function likeCount(count: unknown) {
  return typeof count === "number" ? count : Number(count ?? 0);
}

export async function addLike(targetId: string, visitorId: string) {
  if (!validPair(targetId, visitorId)) {
    return { likes: 0, liked: false };
  }

  await ensureSchema();
  const db = sql();
  await db`
    INSERT INTO likes (id, target_id, visitor_id)
    VALUES (${randomUUID()}, ${targetId}, ${visitorId})
  `;
  const likeRows = await db`SELECT count(*)::int AS count FROM likes WHERE target_id = ${targetId}`;
  return { likes: likeCount(likeRows[0]?.count), liked: true };
}

export async function addComment(targetId: string, visitorId: string, name: string, body: string) {
  if (!validPair(targetId, visitorId)) {
    return { ok: false as const, error: "Couldn't save that. Try again." };
  }

  const cleanName = clean(name).slice(0, 40);
  const cleanBody = body.replace(/\s+\n/g, "\n").trim().slice(0, 500);
  if (!cleanName) return { ok: false as const, error: "Add your name." };
  if (!cleanBody) return { ok: false as const, error: "Write a comment." };

  await ensureSchema();
  const db = sql();
  const existing = await db`
    SELECT count(*)::int AS count FROM comments
    WHERE target_id = ${targetId} AND visitor_id = ${visitorId}
  `;
  const soFar = Number(existing[0]?.count ?? 0);
  if (soFar >= 1) {
    return {
      ok: false as const,
      error: "Only one comment per person. Delete yours to write another.",
    };
  }

  const id = randomUUID();
  const inserted = await db`
    INSERT INTO comments (id, target_id, visitor_id, name, body)
    VALUES (${id}, ${targetId}, ${visitorId}, ${cleanName}, ${cleanBody})
    ON CONFLICT (target_id, visitor_id) DO NOTHING
    RETURNING id, name, body, created_at
  `;
  const row = inserted[0];
  if (!row) {
    return {
      ok: false as const,
      error: "Only one comment per person. Delete yours to write another.",
    };
  }
  return {
    ok: true as const,
    comment: {
      id: String(row.id),
      name: String(row.name),
      body: String(row.body),
      createdAt: new Date(String(row.created_at)).toISOString(),
      mine: true,
    },
  };
}

export async function deleteComment(targetId: string, visitorId: string, commentId: string) {
  if (!validPair(targetId, visitorId) || !/^[0-9a-f-]{36}$/i.test(commentId)) {
    return { ok: false as const, error: "Couldn't delete that." };
  }

  await ensureSchema();
  const db = sql();
  const removed = await db`
    DELETE FROM comments
    WHERE id = ${commentId}
      AND target_id = ${targetId}
      AND visitor_id = ${visitorId}
    RETURNING id
  `;
  if (removed.length === 0) {
    return { ok: false as const, error: "Couldn't delete that." };
  }
  return { ok: true as const };
}
