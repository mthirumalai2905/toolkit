"use client";

import type { WorkspaceState } from "@/components/discord-workspace/model";

export function ChapterSections({ state }: { state: WorkspaceState }) {
  const functional = state.requirements.filter((item) => item.bucket === "functional");
  const nonfunctional = state.requirements.filter((item) => item.bucket === "nonfunctional");

  return (
    <>
      <h2 className="pt-6 text-[20px] font-semibold tracking-[-0.02em]">Functional requirements</h2>
      <p className="text-[15px] leading-7 text-ink">
        These are the things a person can do. A hidden channel is a permission, not a missing row. A direct message uses the same room shape as a server channel.
      </p>
      {functional.map((item) => (
        <section key={item.id}>
          <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{item.title}</h3>
          <p className="mt-1 text-[15px] leading-7 text-ink">{item.description}</p>
          <p className="mt-1 text-[13px] italic leading-6 text-muted">{item.target}</p>
        </section>
      ))}

      <h2 className="pt-6 text-[20px] font-semibold tracking-[-0.02em]">Non-functional requirements</h2>
      <p className="text-[15px] leading-7 text-ink">
        The numbers below are proposed targets for this exercise. They are not a claim about Discord&apos;s service levels.
      </p>
      {nonfunctional.map((item) => (
        <section key={item.id}>
          <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{item.title}</h3>
          <p className="mt-1 text-[15px] leading-7 text-ink">{item.description}</p>
          <p className="mt-1 text-[13px] italic leading-6 text-muted">{item.target}</p>
        </section>
      ))}

      <h2 className="pt-6 text-[20px] font-semibold tracking-[-0.02em]">Detailed design</h2>
      <p className="text-[15px] leading-7 text-ink">
        The picture above is the split. These notes say how each part behaves once a message, a call, or a failure actually happens.
      </p>
      {state.topics.map((topic) => (
        <section key={topic.id}>
          <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{topic.title}</h3>
          <p className="mt-1 text-[15px] leading-7 text-ink">{topic.body}</p>
        </section>
      ))}

      <h2 className="pt-6 text-[20px] font-semibold tracking-[-0.02em]">Database</h2>
      <p className="text-[15px] leading-7 text-ink">
        People, places, and roles stay in a relational store because those links are read together. The message log is append-only and ordered inside a channel. Unread is a cursor, not a recount.
      </p>
      {state.tables.map((table) => (
        <section key={table.id}>
          <h3 className="font-mono text-[15px] font-semibold tracking-[-0.02em]">{table.name}</h3>
          <p className="mt-1 text-[13px] text-muted">{table.store}</p>
          <p className="mt-1 text-[15px] leading-7 text-ink">{table.columns}</p>
          <p className="text-[15px] leading-7 text-muted">{table.notes}</p>
        </section>
      ))}

      <h2 className="pt-6 text-[20px] font-semibold tracking-[-0.02em]">API</h2>
      <p className="text-[15px] leading-7 text-ink">
        Product actions go through HTTP. Live updates arrive on the socket only after the write has succeeded. A client does not learn about a message from the socket if the log does not have it.
      </p>
      {state.endpoints.map((endpoint) => (
        <section key={endpoint.id}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent">{endpoint.style}</p>
          <h3 className="mt-1 font-mono text-[15px] font-semibold tracking-[-0.02em]">{endpoint.name}</h3>
          <p className="mt-1 text-[15px] leading-7 text-ink">{endpoint.detail}</p>
        </section>
      ))}
    </>
  );
}
