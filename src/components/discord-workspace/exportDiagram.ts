import type { ArchNode, WorkspaceState } from "@/components/discord-workspace/model";
import { GROUPS, KIND_LABEL } from "@/components/discord-workspace/model";

const INK: Record<ArchNode["kind"], string> = {
  client: "#8b9cb8",
  service: "#7aa2ff",
  infra: "#e2b15a",
  data: "#6dcaa5",
  note: "#c4b5fd",
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function diagramSvg(state: WorkspaceState) {
  const nodes = state.nodes;
  if (nodes.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#0c0f14"/></svg>`;
  }
  const minX = Math.min(...nodes.map((node) => node.x), 0) - 48;
  const minY = Math.min(...nodes.map((node) => node.y), 0) - 48;
  const maxX = Math.max(...nodes.map((node) => node.x + node.w), 640) + 48;
  const maxY = Math.max(...nodes.map((node) => node.y + node.h), 480) + 48;
  const width = maxX - minX;
  const height = maxY - minY;
  const byId = new Map(nodes.map((node) => [node.id, node]));

  const edges = state.edges
    .map((edge) => {
      const from = byId.get(edge.from);
      const to = byId.get(edge.to);
      if (!from || !to) return "";
      const x1 = from.x + from.w;
      const y1 = from.y + from.h / 2;
      const x2 = to.x;
      const y2 = to.y + to.h / 2;
      const dx = Math.max(48, Math.abs(x2 - x1) * 0.45);
      const caption = [edge.protocol, edge.label].filter(Boolean).join(" · ");
      return `<path d="M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}" fill="none" stroke="#8ea0c0" stroke-width="1.6" marker-end="url(#arrow)"/>
        <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 6}" text-anchor="middle" fill="#c5d0e0" font-size="11" font-family="ui-sans-serif, system-ui, sans-serif">${esc(caption)}</text>`;
    })
    .join("");

  const boxes = nodes
    .map((node) => {
      const group = GROUPS.find((entry) => entry.id === node.group)?.label ?? "";
      return `<g>
        <rect x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" rx="10" fill="#171c26" stroke="${INK[node.kind]}"/>
        <text x="${node.x + 12}" y="${node.y + 20}" fill="${INK[node.kind]}" font-size="10" font-family="ui-sans-serif, system-ui, sans-serif">${esc(KIND_LABEL[node.kind].toUpperCase())}${group ? ` · ${esc(group)}` : ""}</text>
        <text x="${node.x + 12}" y="${node.y + 42}" fill="#f4f1ea" font-size="14" font-family="ui-sans-serif, system-ui, sans-serif">${esc(node.name)}</text>
        <text x="${node.x + 12}" y="${node.y + 62}" fill="#b7c0ce" font-size="11" font-family="ui-sans-serif, system-ui, sans-serif">${esc(node.summary)}</text>
      </g>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}">
  <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="#0c0f14"/>
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#8ea0c0"/>
    </marker>
  </defs>
  ${edges}
  ${boxes}
</svg>`;
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadSvg(state: WorkspaceState) {
  downloadBlob(new Blob([diagramSvg(state)], { type: "image/svg+xml" }), "discord-hld.svg");
}

export function downloadPng(state: WorkspaceState) {
  const svg = diagramSvg(state);
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "discord-hld.png");
    }, "image/png");
  };
  image.src = url;
}
