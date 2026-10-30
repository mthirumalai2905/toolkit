"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { X } from "lucide-react";
import { DESK_ITEMS, type DeskItem } from "@/data/desk";
import { PROFILE } from "@/data/portfolio";

type Place = { x: number; y: number; z: number };

const LAYOUT_KEY = "portfolio-desk-layout-v5";

function cordSag(dist: number, restDrop: number, side: number) {
  const slack = restDrop - dist;
  const belly = slack >= 0 ? Math.min(170, 40 + slack * 0.75) : Math.max(10, 40 + slack * 0.16);
  return belly + Math.min(80, Math.abs(side) * 0.2);
}

function initialPlaces(): Record<string, Place> {
  const places: Record<string, Place> = {};
  DESK_ITEMS.forEach((item, index) => {
    places[item.id] = { x: item.x, y: item.y, z: index + 1 };
  });
  return places;
}

function readPlaces(): Record<string, Place> {
  const base = initialPlaces();
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Record<string, Place>;
    for (const item of DESK_ITEMS) {
      const place = saved[item.id];
      if (!place || typeof place.x !== "number" || typeof place.y !== "number") continue;
      base[item.id] = {
        x: place.x,
        y: place.y,
        z: typeof place.z === "number" ? place.z : base[item.id].z,
      };
    }
  } catch {
    return base;
  }
  return base;
}

export function DesignDesk({ onClose }: { onClose: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [places, setPlaces] = useState<Record<string, Place>>(initialPlaces);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<DeskItem | null>(null);
  const [hint, setHint] = useState(true);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const topZ = useRef(DESK_ITEMS.length + 1);
  const hangRef = useRef({
    x: 16,
    y: 120,
    vx: 0,
    vy: 0,
    phase: 0,
    amp: 0,
    sag: 18,
    pulling: false,
    moved: false,
    placed: false,
    pointerId: -1,
    grabX: 0,
    grabY: 0,
    startX: 0,
    startY: 0,
  });
  const metrics = useRef({
    cardWidth: 110,
    stringLength: 460,
    anchorX: 72,
    restDrop: 150,
    holeOffset: 4,
    stageW: 0,
    stageH: 0,
  });
  const startHang = useRef<() => void>(() => {});
  const [hangTick, setHangTick] = useState(0);
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });
  const cardItem = DESK_ITEMS.find((item) => item.kind === "card");
  const looseItems = DESK_ITEMS.filter((item) => item.kind !== "card");

  const cardWidth = Math.max(96, stageSize.w * 0.135);
  const holeOffset = cardWidth * 0.028;
  const restDrop = stageSize.h ? Math.max(136, Math.min(196, stageSize.h * 0.24)) : 156;
  const stringLength = stageSize.h
    ? Math.max(restDrop + 260, Math.min(stageSize.h * 0.9, Math.hypot(stageSize.w * 0.92, stageSize.h * 0.84)))
    : 480;
  const anchorX = cardWidth * 0.58 + 10;
  metrics.current = {
    cardWidth,
    stringLength,
    anchorX,
    restDrop,
    holeOffset,
    stageW: stageSize.w,
    stageH: stageSize.h,
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setStageSize({ w: rect.width, h: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const step = () => {
      const hang = hangRef.current;
      const { cardWidth: width, stringLength: length, anchorX: pinX, restDrop, holeOffset: hole, stageW, stageH } =
        metrics.current;
      const restX = pinX - width / 2;
      const restY = restDrop - hole;
      if (!hang.pulling) {
        hang.x += (restX - hang.x) * 0.16;
        hang.y += (restY - hang.y) * 0.16;
        hang.vx = 0;
        hang.vy = 0;
        hang.phase += 0.22;
        hang.amp *= 0.9;
        if (stageW) {
          hang.x = Math.min(stageW - width * 0.35, Math.max(-width * 0.12, hang.x));
          hang.y = Math.min(stageH - width * 0.45, Math.max(0, hang.y));
        }
      }
      let holeX = hang.x + width / 2;
      let holeY = hang.y + hole;
      const dx = holeX - pinX;
      const dy = holeY;
      const dist = Math.hypot(dx, dy) || 1;
      if (!hang.pulling && dist > length) {
        const scale = length / dist;
        holeX = pinX + dx * scale;
        holeY = Math.max(hole, dy * scale);
        hang.x = holeX - width / 2;
        hang.y = holeY - hole;
        hang.vx *= 0.4;
        hang.vy *= 0.4;
      }
      hang.sag = cordSag(Math.min(dist, length), restDrop, holeX - pinX) + Math.sin(hang.phase) * hang.amp;
      setHangTick((tick) => (tick + 1) % 100000);
      const fromRest = Math.hypot(restX - hang.x, restY - hang.y);
      const moving = hang.pulling || fromRest > 0.8 || Math.hypot(hang.vx, hang.vy) > 0.2 || hang.amp > 0.8;
      if (moving) frame = requestAnimationFrame(step);
    };
    startHang.current = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(step);
    };
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!stageSize.w) return;
    const hang = hangRef.current;
    const { cardWidth: width, anchorX: pinX, restDrop, holeOffset: hole } = metrics.current;
    if (!hang.placed) {
      hang.placed = true;
      hang.x = pinX - width / 2;
      hang.y = restDrop - hole;
      hang.vx = 0;
      hang.vy = 0;
      hang.amp = 12;
    }
    if (!hang.pulling) startHang.current();
  }, [stageSize.w, stageSize.h]);

  useEffect(() => {
    const move = (event: globalThis.PointerEvent | globalThis.MouseEvent) => {
      const hang = hangRef.current;
      if (!hang.pulling) return;
      if (event.cancelable) event.preventDefault();
      const stage = stageRef.current?.getBoundingClientRect();
      if (!stage) return;
      const { cardWidth: width, stringLength: length, anchorX: pinX, restDrop, holeOffset: hole } = metrics.current;
      let nextX = event.clientX - stage.left - hang.grabX;
      let nextY = event.clientY - stage.top - hang.grabY;
      nextX = Math.min(stage.width - width * 0.2, Math.max(-width * 0.15, nextX));
      nextY = Math.min(stage.height - width * 0.5, Math.max(0, nextY));
      let holeX = nextX + width / 2;
      let holeY = nextY + hole;
      const dx = holeX - pinX;
      const dy = holeY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist > length) {
        const scale = length / dist;
        holeX = pinX + dx * scale;
        holeY = Math.max(hole, dy * scale);
        nextX = holeX - width / 2;
        nextY = holeY - hole;
      }
      hang.vx = nextX - hang.x;
      hang.vy = nextY - hang.y;
      hang.x = nextX;
      hang.y = Math.max(0, nextY);
      hang.sag = cordSag(Math.min(dist, length), restDrop, holeX - pinX);
      if (Math.hypot(event.clientX - hang.startX, event.clientY - hang.startY) > 7) hang.moved = true;
      setHangTick((tick) => (tick + 1) % 100000);
    };
    const end = () => {
      const hang = hangRef.current;
      if (!hang.pulling) return;
      hang.pulling = false;
      if (!hang.moved) {
        if (cardItem) setActive(cardItem);
      } else {
        hang.amp = 64;
        hang.phase = 0;
      }
      startHang.current();
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("mousemove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("mouseup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [cardItem]);

  useEffect(() => {
    setPlaces(readPlaces());
    setReady(true);
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(places));
  }, [places, ready]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (active) setActive(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);

  function bringToFront(id: string) {
    setPlaces((current) => {
      let next = { ...current };
      const max = Object.values(next).reduce((highest, place) => Math.max(highest, place.z), 0);
      if (max >= 40) {
        const ranked = Object.entries(next).sort((a, b) => a[1].z - b[1].z);
        next = {};
        ranked.forEach(([key, place], index) => {
          next[key] = { ...place, z: index + 1 };
        });
      }
      const z = Object.values(next).reduce((highest, place) => Math.max(highest, place.z), 0) + 1;
      next[id] = { ...next[id], z };
      topZ.current = z;
      return next;
    });
  }

  function beginPull(event: PointerEvent<HTMLButtonElement | SVGPathElement>) {
    if (active) return;
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;
    event.preventDefault();
    const hang = hangRef.current;
    hang.pulling = true;
    hang.moved = false;
    hang.amp = 0;
    hang.vx = 0;
    hang.vy = 0;
    hang.pointerId = event.pointerId;
    hang.grabX = event.clientX - stage.left - hang.x;
    hang.grabY = event.clientY - stage.top - hang.y;
    hang.startX = event.clientX;
    hang.startY = event.clientY;
    const node = event.currentTarget;
    if (node && "setPointerCapture" in node) {
      try {
        node.setPointerCapture(event.pointerId);
      } catch {
        /* window listeners still follow the pointer */
      }
    }
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>, item: DeskItem) {
    if (active) return;
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* the move listener still follows the pointer */
    }
    bringToFront(item.id);
    dragRef.current = {
      id: item.id,
      offsetX: event.clientX - event.currentTarget.getBoundingClientRect().left,
      offsetY: event.clientY - event.currentTarget.getBoundingClientRect().top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>, item: DeskItem) {
    const drag = dragRef.current;
    const stage = stageRef.current?.getBoundingClientRect();
    if (!drag || drag.id !== item.id || !stage) return;
    const travel = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (travel > 6) drag.moved = true;
    if (!drag.moved) return;
    const x = ((event.clientX - drag.offsetX - stage.left) / stage.width) * 100;
    const y = ((event.clientY - drag.offsetY - stage.top) / stage.height) * 100;
    setPlaces((current) => ({
      ...current,
      [item.id]: {
        ...current[item.id],
        x: Math.min(100 - item.w * 0.45, Math.max(-item.w * 0.35, x)),
        y: Math.min(92, Math.max(-6, y)),
      },
    }));
    setHint(false);
  }

  function onPointerUp(item: DeskItem) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.id !== item.id) return;
    if (!drag.moved) setActive(item);
  }

  const holeX = hangRef.current.x + cardWidth / 2;
  const holeY = hangRef.current.y + holeOffset;
  const cord = `M ${anchorX} 0 Q ${(anchorX + holeX) / 2} ${holeY / 2 + hangRef.current.sag} ${holeX} ${holeY}`;
  const tilt = Math.atan2(holeX - anchorX, Math.max(holeY, 12)) * (180 / Math.PI) * 0.22;

  return (
    <div
      ref={stageRef}
      role="dialog"
      aria-modal="true"
      aria-label={active ? active.label : "Design table"}
      style={{ position: "fixed", inset: 0, zIndex: 50, touchAction: "none", background: "#133e9a" }}
    >
      <img
        src="/design/desk.jpg?v=screen"
        alt=""
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {hint && !active && (
        <p className="pointer-events-none absolute right-4 top-4 z-[70] rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium text-[#1d1d1f]">
          Pull the ID card. Drag the rest.
        </p>
      )}

      <button
        ref={closeRef}
        type="button"
        aria-label={active ? "Back" : "Close"}
        onClick={() => (active ? setActive(null) : onClose())}
        className="absolute left-4 top-4 z-[70] flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1d1d1f] shadow-[0_6px_16px_rgba(0,0,0,0.16)]"
      >
        <X className="h-4 w-4" strokeWidth={2.4} />
      </button>

      {cardItem && !active && stageSize.w > 0 && (
        <>
          <svg className="absolute inset-0 z-[55] h-full w-full" style={{ pointerEvents: "none" }} aria-hidden="true">
            <path d={cord} stroke="rgba(30, 24, 18, 0.28)" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d={cord} stroke="#f4efe6" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx={anchorX} cy={5} r={4.5} fill="#f7f3ec" stroke="#d9d0c4" />
            <path
              d={cord}
              stroke="transparent"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
              style={{ pointerEvents: "stroke", cursor: "grab" }}
              onPointerDown={beginPull}
            />
          </svg>
          <button
            type="button"
            aria-label="Pull or open ID card"
            onPointerDown={beginPull}
            className="absolute cursor-grab touch-none active:cursor-grabbing"
            style={{
              left: hangRef.current.x,
              top: hangRef.current.y,
              width: cardWidth,
              zIndex: 60,
              transform: `rotate(${tilt}deg)`,
              transformOrigin: "50% 2%",
              filter: "drop-shadow(0 10px 12px rgba(12, 36, 64, 0.24))",
            }}
          >
            <img src={cardItem.src} alt="" draggable={false} className="pointer-events-none w-full select-none" />
          </button>
          <span className="sr-only">{hangTick}</span>
        </>
      )}

      {looseItems.map((item) => {
        const place = places[item.id];
        if (!place || active) return null;
        return (
          <button
            key={item.id}
            type="button"
            aria-label={`Open ${item.label}`}
            onPointerDown={(event) => onPointerDown(event, item)}
            onPointerMove={(event) => onPointerMove(event, item)}
            onPointerUp={() => onPointerUp(item)}
            onPointerCancel={() => {
              dragRef.current = null;
            }}
            className="absolute cursor-grab touch-none active:cursor-grabbing"
            style={{
              left: `${place.x}%`,
              top: `${place.y}%`,
              width: `${item.w}%`,
              zIndex: place.z,
              transform: `rotate(${item.rotate}deg)`,
              filter: "drop-shadow(0 8px 10px rgba(12, 36, 64, 0.22))",
            }}
          >
            <img src={item.src} alt="" draggable={false} className="pointer-events-none w-full" />
          </button>
        );
      })}

      {active && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center px-5"
          onClick={() => setActive(null)}
        >
          <div
            className="flex w-full max-w-[440px] flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            {active.kind === "resume" ? (
              <div className="max-h-[82vh] w-full max-w-[640px] overflow-auto pb-16">
                <img
                  src="/design/resume-page-1.png"
                  alt="Resume, page 1"
                  className="w-full bg-white shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                />
                <img
                  src="/design/resume-page-2.png"
                  alt="Resume, page 2"
                  className="mt-4 w-full bg-white shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                />
              </div>
            ) : (
              <img
                src={active.src}
                alt=""
                className="w-full max-w-[360px]"
                style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.35))" }}
              />
            )}
            {active.kind === "resume" && (
              <a
                href={PROFILE.resumeUrl}
                download
                className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#1d1d1f]"
              >
                Download resume
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
