import { neon } from "@neondatabase/serverless";

function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const parsed = new URL(url);
  parsed.searchParams.delete("channel_binding");
  return parsed.toString();
}

export function sql() {
  return neon(databaseUrl());
}

let ready: Promise<void> | null = null;

async function createSchema() {
  const db = sql();
  await ensureLikes(db);
  await db`
    CREATE TABLE IF NOT EXISTS comments (
      id text PRIMARY KEY,
      target_id text NOT NULL,
      visitor_id text NOT NULL,
      name text NOT NULL,
      body text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await db`
    CREATE INDEX IF NOT EXISTS comments_target_idx
    ON comments (target_id, created_at)
  `;
  await db`
    DELETE FROM comments
    WHERE id IN (
      SELECT id FROM (
        SELECT id, row_number() OVER (
          PARTITION BY target_id, visitor_id
          ORDER BY created_at ASC, id ASC
        ) AS rn
        FROM comments
      ) ranked
      WHERE rn > 1
    )
  `;
  await db`
    CREATE UNIQUE INDEX IF NOT EXISTS comments_one_per_visitor
    ON comments (target_id, visitor_id)
  `;
}

async function ensureLikes(db: ReturnType<typeof sql>) {
  const columns = await db`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'likes'
  `;
  const names = new Set(columns.map((row) => String(row.column_name)));

  if (names.size === 0) {
    await db`
      CREATE TABLE likes (
        id text PRIMARY KEY,
        target_id text NOT NULL,
        visitor_id text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  } else if (!names.has("id")) {
    await db`ALTER TABLE likes ADD COLUMN id text`;
    await db`UPDATE likes SET id = gen_random_uuid()::text WHERE id IS NULL`;
    await db`ALTER TABLE likes ALTER COLUMN id SET NOT NULL`;
    await db`ALTER TABLE likes DROP CONSTRAINT likes_pkey`;
    await db`ALTER TABLE likes ADD PRIMARY KEY (id)`;
  }

  await db`CREATE INDEX IF NOT EXISTS likes_target_idx ON likes (target_id)`;
}

export function ensureSchema() {
  if (!ready) {
    ready = createSchema().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}
