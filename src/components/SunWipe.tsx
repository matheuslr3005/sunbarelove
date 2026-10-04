import { useCallback, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { Sun } from "./Sun";

const R = 3000;
const EASE = [0.7, 0, 0.2, 1] as const;

/**
 * Transição entre abas: um sol laranja nasce no botão clicado e cobre o painel,
 * o conteúdo troca por baixo e o sol se põe no centro. Sem movimento reduzido.
 */
export function useSunWipe<T extends string>(onSwap: (next: T) => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const reduce = useReducedMotion();

  const go = useCallback(
    async (next: T, text: string, origin?: Element | null) => {
      const box = containerRef.current;
      const overlay = overlayRef.current;
      if (busy.current) return;
      if (reduce || !box || !overlay) {
        onSwap(next);
        return;
      }
      busy.current = true;
      try {
        const rect = box.getBoundingClientRect();
        const o = origin?.getBoundingClientRect();
        const x = o ? o.left + o.width / 2 - rect.left : rect.width / 2;
        const y = o ? o.top + o.height / 2 - rect.top : 0;
        if (labelRef.current) labelRef.current.textContent = text;

        overlay.style.visibility = "visible";
        await animate(
          overlay,
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
          { duration: 0.55, ease: EASE },
        );
        onSwap(next);
        await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

        const after = box.getBoundingClientRect();
        const cx = after.width / 2;
        const cy = Math.min(after.height / 2, 320);
        await animate(
          overlay,
          { clipPath: [`circle(${R}px at ${x}px ${y}px)`, `circle(0px at ${cx}px ${cy}px)`] },
          { duration: 0.7, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] },
        );
        overlay.style.visibility = "hidden";
      } finally {
        busy.current = false;
      }
    },
    [onSwap, reduce],
  );

  return { containerRef, overlayRef, labelRef, go };
}

export function SunWipeOverlay({
  overlayRef,
  labelRef,
}: {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  labelRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-card bg-[linear-gradient(160deg,#f0286e,#ff6a2b_55%,#ffc21a)]"
      style={{ visibility: "hidden", clipPath: "circle(0px at 50% 0px)" }}
    >
      <Sun className="absolute left-1/2 top-[min(38%,320px)] w-[min(90vw,780px)] -translate-x-1/2 -translate-y-1/2 opacity-40" />
      <span
        ref={labelRef}
        className="wordmark absolute left-1/2 top-[min(38%,320px)] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(2.6rem,9vw,7rem)]"
      />
    </div>
  );
}
