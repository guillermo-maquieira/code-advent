import { useEffect, useState } from "react";

const COLS = 16;
const ROWS = 10;
const SNAKE_LEN = 15;

// Closed, non-overlapping 56-cell retro arcade loop across the 16x10 grid.
const PATH: readonly (readonly [number, number])[] = [
  [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1],
  [9, 1], [10, 1], [11, 1], [12, 1], [13, 1], [14, 1],
  [14, 2], [14, 3], [14, 4],
  [13, 4], [12, 4], [11, 4], [10, 4], [9, 4], [8, 4], [7, 4], [6, 4],
  [6, 5], [6, 6],
  [7, 6], [8, 6], [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
  [14, 7], [14, 8],
  [13, 8], [12, 8], [11, 8], [10, 8], [9, 8], [8, 8], [7, 8], [6, 8],
  [5, 8], [4, 8], [3, 8], [2, 8], [1, 8],
  [1, 7], [1, 6], [1, 5], [1, 4], [1, 3], [1, 2],
] as const;

const TREATS: readonly { x: number; y: number; kind: "gift" | "tree" }[] = [
  { x: 4, y: 3, kind: "tree" },
  { x: 11, y: 2, kind: "gift" },
  { x: 10, y: 7, kind: "tree" },
  { x: 3, y: 6, kind: "gift" },
] as const;

const CELLS = Array.from({ length: ROWS * COLS }, (_, idx) => ({
  x: idx % COLS,
  y: Math.floor(idx / COLS),
}));

export function RetroChristmasSnake() {
  const [headIdx, setHeadIdx] = useState(14);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const timer = window.setInterval(() => {
      setHeadIdx((prev) => (prev + 1) % PATH.length);
    }, 165);
    return () => window.clearInterval(timer);
  }, []);

  const segmentMap = new Map<string, number>();
  for (let i = 0; i < SNAKE_LEN; i++) {
    const idx = (headIdx - i + PATH.length) % PATH.length;
    const pt = PATH[idx];
    if (pt) segmentMap.set(`${pt[0]},${pt[1]}`, i);
  }

  const treatMap = new Map<string, "gift" | "tree">();
  for (const t of TREATS) {
    treatMap.set(`${t.x},${t.y}`, t.kind);
  }

  return (
    <div
      className="retro-snake-frame overflow-hidden rounded-xl border-2 border-border bg-card shadow-sm"
      role="img"
      aria-label="Animación retro en rojo, blanco y verde de una serpiente navideña de Python"
    >
      <div className="flex items-center justify-between border-b border-border bg-surface px-3.5 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="size-2.5 rounded-full bg-evergreen" />
          <span className="size-2.5 rounded-full border border-border bg-card" />
        </div>
        <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          snake_navidad.py
        </span>
        <span className="font-mono text-[11px] font-semibold text-primary">12 DÍAS</span>
      </div>

      <div className="retro-snake-board p-3 sm:p-4">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {CELLS.map(({ x, y }) => {
            const key = `${x},${y}`;
            const seg = segmentMap.get(key);
            const treat = treatMap.get(key);

            if (seg === 0) {
              return (
                <div
                  key={key}
                  className="snake-cell snake-head relative aspect-square rounded-[3px]"
                >
                  <span className="snake-eye absolute top-[22%] left-[22%] size-[22%] rounded-full" />
                  <span className="snake-eye absolute top-[22%] right-[22%] size-[22%] rounded-full" />
                </div>
              );
            }

            if (seg !== undefined) {
              const stripe = seg % 3 === 1 ? "snake-red" : seg % 3 === 2 ? "snake-white" : "snake-green";
              return (
                <div
                  key={key}
                  className={`snake-cell ${stripe} aspect-square rounded-[3px]`}
                />
              );
            }

            if (treat === "gift") {
              return (
                <div
                  key={key}
                  className="snake-cell snake-gift aspect-square rounded-[2px]"
                />
              );
            }

            if (treat === "tree") {
              return (
                <div
                  key={key}
                  className="snake-cell snake-tree aspect-square rounded-[2px]"
                />
              );
            }

            return <div key={key} className="snake-cell snake-empty aspect-square rounded-[2px]" />;
          })}
        </div>
      </div>
    </div>
  );
}