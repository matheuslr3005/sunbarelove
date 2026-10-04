import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { starClip } from "../lib";

const RAYS = starClip(10, 40);

/** Solzinho que segue o mouse. Só em telas com mouse e sem movimento reduzido. */
export function SunCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.35 });
  const scale = useSpring(1, { stiffness: 320, damping: 22 });
  const opacity = useSpring(1, { stiffness: 240, damping: 26 });

  useEffect(() => {
    setEnabled(!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      // sobre algo clicável o sol cresce um pouco e fica translúcido, para não esconder o texto
      const interactive = Boolean(el?.closest("a, button, [role='tab'], input, textarea"));
      scale.set(interactive ? 1.5 : 1);
      opacity.set(interactive ? 0.5 : 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [enabled, x, y, scale, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0"
      style={{ x: sx, y: sy, opacity, zIndex: "var(--z-cursor)" }}
    >
      <motion.div className="-translate-x-1/2 -translate-y-1/2" style={{ scale }}>
        <div className="sun-cursor relative size-7">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle,#ff8a1f_0%,#ffc21a_70%)]"
            style={{ clipPath: RAYS }}
          />
          <div className="absolute inset-[30%] rounded-full bg-rose" />
        </div>
      </motion.div>
    </motion.div>
  );
}
