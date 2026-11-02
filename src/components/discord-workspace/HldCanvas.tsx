"use client";

import { useEffect, useRef, useState, type Dispatch, type PointerEvent as ReactPointerEvent, type ReactNode, type SetStateAction } from "react";
import { Download, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { downloadPng, downloadSvg } from "@/components/discord-workspace/exportDiagram";
import {
  GROUPS,
  KIND_LABEL,
  PALETTE,
  WORLD_H,
  WORLD_W,
  createNode,
  type ArchEdge,
  type ArchNode,
  type NodeKind,
  type WorkspaceState,
} from "@/components/discord-workspace/model";

const INK: Record<NodeKind, string> = {
  client: "#8b9cb8",
  service: "#7aa2ff",
  infra: "#e2b15a",
  data: "#6dcaa5",
  note: "#c4b5fd",
};

type Selection = { kind: "node"; id: string } | { kind: "edge"; id: string } | null;

export function HldCanvas({
  state,
  onChange,
  framed = false,
}: {
  state: WorkspaceState;
  onChange: Dispatch<SetStateAction<WorkspaceState>>;
  framed?: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const panRef = useRef({ x: 24, y: 16 });
  const zoomRef = useRef(0.85);
  const [pan, setPan] = useState(panRef.current);
  const [zoom, setZoom] = useState(zoomRef.current);
  const [selected, setSelected] = useState<Selection>(null);
  const [draft, setDraft] = useState<{ from: string; x: number; y: number } | null>(null);
  const [ghost, setGhost] = useState<{ name: string; x: number; y: number } | null>(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  function commitPan(next: { x: number; y: number }) {
    panRef.current = next;
    setPan(next);
  }

  function commitZoom(next: number) {
    zoomRef.current = next;
    setZoom(next);
  }

  function toWorld(clientX: number, clientY: number) {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - panRef.current.x) / zoomRef.current,
      y: (clientY - rect.top - panRef.current.y) / zoomRef.current,
    };
  }

  useEffect(() => {
    if (!framed) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const frame = requestAnimationFrame(() => {
      const rect = viewport.getBoundingClientRect();
      if (rect.width < 40) return;
      const next = Math.min(0.9, Math.max(0.5, (rect.width - 32) / 760));
      commitZoom(next);
      commitPan({ x: 16 - 48 * next, y: 8 });
    });
    return () => cancelAnimationFrame(frame);
  }, [framed]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      const prev = zoomRef.current;
      const next = Math.min(1.8, Math.max(0.28, prev * (event.deltaY < 0 ? 1.08 : 0.92)));
      const wx = (mx - panRef.current.x) / prev;
      const wy = (my - panRef.current.y) / prev;
      commitZoom(next);
      commitPan({ x: mx - wx * next, y: my - wy * next });
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!selected) return;
      event.preventDefault();
      if (selected.kind === "node") removeNode(selected.id);
      else removeEdge(selected.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function updateNode(id: string, patch: Partial<ArchNode>) {
    onChange((current) => ({
      ...current,
      nodes: current.nodes.map((node) => (node.id === id ? { ...node, ...patch } : node)),
    }));
  }

  function updateEdge(id: string, patch: Partial<ArchEdge>) {
    onChange((current) => ({
      ...current,
      edges: current.edges.map((edge) => (edge.id === id ? { ...edge, ...patch } : edge)),
    }));
  }

  function removeNode(id: string) {
    onChange((current) => ({
      ...current,
      nodes: current.nodes.filter((node) => node.id !== id),
      edges: current.edges.filter((edge) => edge.from !== id && edge.to !== id),
    }));
    setSelected(null);
  }

  function removeEdge(id: string) {
    onChange((current) => ({ ...current, edges: current.edges.filter((edge) => edge.id !== id) }));
    setSelected(null);
  }

  function startPan(event: ReactPointerEvent) {
    const origin = { ...panRef.current };
    const sx = event.clientX;
    const sy = event.clientY;
    const move = (ev: PointerEvent) => {
      commitPan({ x: origin.x + ev.clientX - sx, y: origin.y + ev.clientY - sy });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startDrag(event: ReactPointerEvent, node: ArchNode) {
    event.stopPropagation();
    setSelected({ kind: "node", id: node.id });
    const start = toWorld(event.clientX, event.clientY);
    const ox = node.x;
    const oy = node.y;
    const move = (ev: PointerEvent) => {
      const point = toWorld(ev.clientX, ev.clientY);
      updateNode(node.id, {
        x: Math.max(0, ox + point.x - start.x),
        y: Math.max(0, oy + point.y - start.y),
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startConnect(event: ReactPointerEvent, node: ArchNode) {
    event.stopPropagation();
    const move = (ev: PointerEvent) => {
      const point = toWorld(ev.clientX, ev.clientY);
      setDraft({ from: node.id, x: point.x, y: point.y });
    };
    const up = (ev: PointerEvent) => {
      const hit = document.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-node-id]");
      const target = hit?.getAttribute("data-node-id");
      setDraft(null);
        if (target && target !== node.id) {
          const id = `${node.id}>${target}`;
          onChange((current) => {
            const existing = current.edges.find((edge) => edge.from === node.id && edge.to === target);
            if (existing) return current;
            return {
              ...current,
              edges: [...current.edges, { id, from: node.id, to: target, protocol: "internal", label: "" }],
            };
          });
          setSelected({ kind: "edge", id });
        }
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    const point = toWorld(event.clientX, event.clientY);
    setDraft({ from: node.id, x: point.x, y: point.y });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startPaletteDrag(
    event: ReactPointerEvent,
    item: { kind: NodeKind; name: string; group: string; summary: string },
  ) {
    setGhost({ name: item.name, x: event.clientX, y: event.clientY });
    const move = (ev: PointerEvent) => setGhost({ name: item.name, x: ev.clientX, y: ev.clientY });
    const up = (ev: PointerEvent) => {
      const rect = viewportRef.current?.getBoundingClientRect();
      setGhost(null);
      if (rect && ev.clientX >= rect.left && ev.clientX <= rect.right && ev.clientY >= rect.top && ev.clientY <= rect.bottom) {
        const point = toWorld(ev.clientX, ev.clientY);
        const created = createNode(item.kind, item.name, item.group, item.summary, point.x - 110, point.y - 40);
        onChange((current) => ({ ...current, nodes: [...current.nodes, created] }));
        setSelected({ kind: "node", id: created.id });
      }
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function fit() {
    const viewport = viewportRef.current;
    if (!viewport || state.nodes.length === 0) return;
    const minX = Math.min(...state.nodes.map((node) => node.x));
    const minY = Math.min(...state.nodes.map((node) => node.y));
    const maxX = Math.max(...state.nodes.map((node) => node.x + node.w));
    const maxY = Math.max(...state.nodes.map((node) => node.y + node.h));
    const rect = viewport.getBoundingClientRect();
    const next = Math.min(1, Math.max(0.28, Math.min((rect.width - 48) / (maxX - minX + 80), (rect.height - 48) / (maxY - minY + 80))));
    commitZoom(next);
    commitPan({
      x: (rect.width - (maxX - minX) * next) / 2 - minX * next,
      y: 28 - minY * next,
    });
  }

  const byId = new Map(state.nodes.map((node) => [node.id, node]));
  const selectedNode = selected?.kind === "node" ? byId.get(selected.id) : undefined;
  const selectedEdge = selected?.kind === "edge" ? state.edges.find((edge) => edge.id === selected.id) : undefined;
  const frames = groupFrames(state.nodes);

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1">
      <aside className={`${leftOpen ? "absolute inset-y-0 left-0 z-20 flex" : "hidden"} w-[232px] shrink-0 flex-col border-r border-[#2a3140] bg-[#12161d] ${framed ? "" : "lg:static lg:flex"}`}>
        <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b95a8]">
          Components
        </p>
        <p className="px-3 pb-2 text-[12px] leading-5 text-[#8b95a8]">Drag one onto the canvas.</p>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
          {PALETTE.map((item) => (
            <button
              key={item.name}
              type="button"
              onPointerDown={(event) => startPaletteDrag(event, item)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-[#1c2330]"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: INK[item.kind] }} />
              <span className="min-w-0">
                <span className="block truncate text-[13px]">{item.name}</span>
                <span className="block text-[11px] text-[#8b95a8]">{KIND_LABEL[item.kind]}</span>
              </span>
            </button>
          ))}
          <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b95a8]">
            On the canvas
          </p>
          {state.nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelected({ kind: "node", id: node.id })}
              className={`block w-full truncate rounded-lg px-2 py-1.5 text-left text-[12px] ${
                selected?.kind === "node" && selected.id === node.id ? "bg-[#1c2330]" : "hover:bg-[#1c2330]"
              }`}
            >
              {node.name}
            </button>
          ))}
        </div>
      </aside>

      <div className="relative min-w-0 flex-1">
        <div
          ref={viewportRef}
          className="absolute inset-0 cursor-grab overflow-hidden active:cursor-grabbing"
          onPointerDown={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("[data-node-id]") || target.closest("[data-edge-id]")) return;
            setSelected(null);
            startPan(event);
          }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: WORLD_W,
              height: WORLD_H,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              backgroundImage:
                "linear-gradient(#1c2430 1px, transparent 1px), linear-gradient(90deg, #1c2430 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            {frames.map((frame) => (
              <div
                key={frame.id}
                className="absolute rounded-2xl border border-dashed border-[#314056]"
                style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h }}
              >
                <span className="absolute left-3 top-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f8ba0]">
                  {frame.label}
                </span>
              </div>
            ))}
            <svg className="absolute left-0 top-0" width={WORLD_W} height={WORLD_H}>
              <defs>
                <marker id="hld-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#8ea0c0" />
                </marker>
              </defs>
              {state.edges.map((edge) => {
                const from = byId.get(edge.from);
                const to = byId.get(edge.to);
                if (!from || !to) return null;
                const path = curve(from, to);
                const active = selected?.kind === "edge" && selected.id === edge.id;
                const caption = [edge.protocol, edge.label].filter(Boolean).join(" · ");
                return (
                  <g key={edge.id} data-edge-id={edge.id}>
                    <path
                      d={path.d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={14}
                      className="cursor-pointer"
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        setSelected({ kind: "edge", id: edge.id });
                      }}
                    />
                    <path
                      d={path.d}
                      fill="none"
                      stroke={active ? "#f4f1ea" : "#8ea0c0"}
                      strokeWidth={active ? 2.4 : 1.6}
                      markerEnd="url(#hld-arrow)"
                      pointerEvents="none"
                    />
                    <text
                      x={(path.x1 + path.x2) / 2}
                      y={(path.y1 + path.y2) / 2 - 8}
                      textAnchor="middle"
                      fill="#c5d0e0"
                      fontSize="11"
                      pointerEvents="none"
                    >
                      {caption}
                    </text>
                  </g>
                );
              })}
              {draft && byId.get(draft.from) && (
                <path
                  d={`M ${byId.get(draft.from)!.x + byId.get(draft.from)!.w} ${byId.get(draft.from)!.y + byId.get(draft.from)!.h / 2} L ${draft.x} ${draft.y}`}
                  fill="none"
                  stroke="#f4f1ea"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  pointerEvents="none"
                />
              )}
            </svg>
            {state.nodes.map((node) => {
              const active = selected?.kind === "node" && selected.id === node.id;
              return (
                <article
                  key={node.id}
                  data-node-id={node.id}
                  onPointerDown={(event) => startDrag(event, node)}
                  className="absolute cursor-grab rounded-[10px] border bg-[#171c26] px-3 py-2 active:cursor-grabbing"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: node.w,
                    height: node.h,
                    borderColor: active ? "#f4f1ea" : "#2c3548",
                    boxShadow: `inset 3px 0 0 ${INK[node.kind]}`,
                  }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: INK[node.kind] }}>
                    {KIND_LABEL[node.kind]}
                  </p>
                  <h3 className="truncate text-[13px] font-semibold leading-5">{node.name}</h3>
                  <p className="truncate text-[11px] text-[#9aa3b5]">{node.summary}</p>
                  <button
                    type="button"
                    aria-label={`Connect ${node.name}`}
                    onPointerDown={(event) => startConnect(event, node)}
                    className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-[#d7deea] bg-[#0c0f14]"
                  />
                </article>
              );
            })}
          </div>
        </div>

        <div className={`absolute left-3 top-3 z-20 flex gap-1 ${framed ? "" : "lg:hidden"}`}>
          <button type="button" onClick={() => setLeftOpen((open) => !open)} className="rounded-lg bg-[#12161d] px-2 py-1 text-[12px]">
            Components
          </button>
          <button type="button" onClick={() => setRightOpen((open) => !open)} className="rounded-lg bg-[#12161d] px-2 py-1 text-[12px]">
            Properties
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-xl border border-[#2a3140] bg-[#12161d] p-1">
          <IconButton label="Zoom out" onClick={() => commitZoom(Math.max(0.28, zoom - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </IconButton>
          <button type="button" onClick={fit} className="px-2 text-[12px] tabular-nums text-[#c5d0e0]">
            {Math.round(zoom * 100)}%
          </button>
          <IconButton label="Zoom in" onClick={() => commitZoom(Math.min(1.8, zoom + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </IconButton>
          <IconButton label="Export SVG" onClick={() => downloadSvg(state)}>
            <Download className="h-4 w-4" />
            <span className="text-[12px]">SVG</span>
          </IconButton>
          <IconButton label="Export PNG" onClick={() => downloadPng(state)}>
            <Download className="h-4 w-4" />
            <span className="text-[12px]">PNG</span>
          </IconButton>
        </div>
        {ghost && (
          <div className="pointer-events-none fixed z-[90] rounded-lg bg-[#171c26] px-3 py-2 text-[12px] shadow-lg" style={{ left: ghost.x + 12, top: ghost.y + 12 }}>
            {ghost.name}
          </div>
        )}
      </div>

      <aside className={`${rightOpen ? "absolute inset-y-0 right-0 z-20 flex" : "hidden"} w-[280px] shrink-0 flex-col border-l border-[#2a3140] bg-[#12161d] ${framed ? "" : "lg:static lg:flex"}`}>
        <p className="px-4 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b95a8]">
          Properties
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {selectedNode && (
            <div className="space-y-3">
              <Field label="Name">
                <input value={selectedNode.name} onChange={(event) => updateNode(selectedNode.id, { name: event.target.value })} className={fieldClass} />
              </Field>
              <Field label="Summary">
                <input value={selectedNode.summary} onChange={(event) => updateNode(selectedNode.id, { summary: event.target.value })} className={fieldClass} />
              </Field>
              <Field label="Description">
                <textarea value={selectedNode.description} onChange={(event) => updateNode(selectedNode.id, { description: event.target.value })} rows={5} className={fieldClass} />
              </Field>
              <Field label="Technology">
                <input value={selectedNode.technology} onChange={(event) => updateNode(selectedNode.id, { technology: event.target.value })} className={fieldClass} />
              </Field>
              <Field label="Kind">
                <select value={selectedNode.kind} onChange={(event) => updateNode(selectedNode.id, { kind: event.target.value as NodeKind })} className={fieldClass}>
                  {(Object.keys(KIND_LABEL) as NodeKind[]).map((kind) => (
                    <option key={kind} value={kind}>{KIND_LABEL[kind]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Group">
                <select value={selectedNode.group} onChange={(event) => updateNode(selectedNode.id, { group: event.target.value })} className={fieldClass}>
                  <option value="">None</option>
                  {GROUPS.map((group) => (
                    <option key={group.id} value={group.id}>{group.label}</option>
                  ))}
                </select>
              </Field>
              <button type="button" onClick={() => removeNode(selectedNode.id)} className="inline-flex items-center gap-2 text-[13px] text-[#f0a0a0]">
                <Trash2 className="h-3.5 w-3.5" /> Delete component
              </button>
            </div>
          )}
          {selectedEdge && (
            <div className="space-y-3">
              <Field label="Protocol">
                <input value={selectedEdge.protocol} onChange={(event) => updateEdge(selectedEdge.id, { protocol: event.target.value })} className={fieldClass} />
              </Field>
              <Field label="Label">
                <input value={selectedEdge.label} onChange={(event) => updateEdge(selectedEdge.id, { label: event.target.value })} className={fieldClass} />
              </Field>
              <p className="text-[12px] leading-5 text-[#8b95a8]">
                {byId.get(selectedEdge.from)?.name} → {byId.get(selectedEdge.to)?.name}
              </p>
              <button type="button" onClick={() => removeEdge(selectedEdge.id)} className="inline-flex items-center gap-2 text-[13px] text-[#f0a0a0]">
                <Trash2 className="h-3.5 w-3.5" /> Delete connection
              </button>
            </div>
          )}
          {!selectedNode && !selectedEdge && (
            <p className="text-[13px] leading-5 text-[#8b95a8]">
              Select a component or a connection. Each box should own one job. Technologies stay replaceable.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function groupFrames(nodes: ArchNode[]) {
  const grouped = new Map<string, ArchNode[]>();
  for (const node of nodes) {
    if (!node.group) continue;
    const list = grouped.get(node.group) ?? [];
    list.push(node);
    grouped.set(node.group, list);
  }
  return [...grouped].map(([id, list]) => {
    const x = Math.min(...list.map((node) => node.x)) - 16;
    const y = Math.min(...list.map((node) => node.y)) - 26;
    const right = Math.max(...list.map((node) => node.x + node.w)) + 16;
    const bottom = Math.max(...list.map((node) => node.y + node.h)) + 14;
    return {
      id,
      label: GROUPS.find((group) => group.id === id)?.label ?? id,
      x,
      y,
      w: right - x,
      h: bottom - y,
    };
  });
}

function curve(from: ArchNode, to: ArchNode) {
  const x1 = from.x + from.w;
  const y1 = from.y + from.h / 2;
  const x2 = to.x;
  const y2 = to.y + to.h / 2;
  const dx = Math.max(48, Math.abs(x2 - x1) * 0.45);
  return { d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, x1, y1, x2, y2 };
}

const fieldClass =
  "w-full rounded-lg border border-[#2a3140] bg-[#0c0f14] px-2 py-1.5 text-[13px] outline-none focus:border-[#7aa2ff]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[#8b95a8]">{label}</span>
      {children}
    </label>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[#e8e6e3] hover:bg-[#1c2330]">
      {children}
    </button>
  );
}
