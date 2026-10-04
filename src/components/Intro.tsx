import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { asset } from "../asset";
import { Sun } from "./Sun";

type Phase = "playing" | "revealing" | "done";

interface IntroState {
  phase: Phase;
  /** Vira true quando o site começa a aparecer (ou logo de cara, sem abertura). */
  revealed: boolean;
  setPhase: (p: Phase) => void;
}

const IntroContext = createContext<IntroState>({ phase: "done", revealed: true, setPhase: () => undefined });
export const useIntro = () => useContext(IntroContext);

/** A abertura toca ao abrir o site. Não toca com "reduzir movimento" nem em links com #seção. */
function shouldPlay(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return !window.location.hash;
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhaseState] = useState<Phase>(() => (shouldPlay() ? "playing" : "done"));
  const setPhase = useCallback((p: Phase) => setPhaseState(p), []);
  const value = useMemo(() => ({ phase, revealed: phase !== "playing", setPhase }), [phase, setPhase]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

const EASE_IN = [0.7, 0, 0.84, 0] as const;
const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/**
 * Abertura: o logo aparece, vira o sol, a câmera entra no disco e o site abre de dentro dele.
 * Movimento: apenas transform e máscara, tudo por motion values (sem re-render).
 */
export function Intro() {
  const { phase, setPhase } = useIntro();
  const scale = useMotionValue(1);
  const logoOpacity = useMotionValue(0);
  const logoScale = useMotionValue(0.82);
  const sunOpacity = useMotionValue(0);
  const sunScale = useMotionValue(0.85);
  const glow = useMotionValue(0);
  const hole = useMotionValue(0);
  const skipped = useRef(false);
  const holeSize = useRef(0);

  const mask = useTransform(hole, (r) => `radial-gradient(circle at 50% 50%, transparent ${r}px, #000 ${r + 2}px)`);

  // largura do selo do logo; o sol de CSS é desenhado para o disco coincidir com o do logo
  const badge = typeof window === "undefined" ? 240 : Math.min(window.innerWidth * 0.58, 250);

  const reveal = useCallback(async () => {
    setPhase("revealing");
    await animate(hole, holeSize.current, { duration: skipped.current ? 0.55 : 0.95, ease: EASE_OUT });
    setPhase("done");
  }, [hole, setPhase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const diag = Math.hypot(vw, vh);
    holeSize.current = diag * 0.62;
    const disc = badge * 0.8 * 1.2 * 0.46; // diâmetro do disco do sol no fim do fade
    const zoom = (diag / disc) * 1.15;

    let alive = true;
    void (async () => {
      animate(glow, 1, { duration: 1.2, ease: "easeOut" });
      animate(logoScale, 1, { duration: 0.9, ease: EASE_OUT });
      await animate(logoOpacity, 1, { duration: 0.6, ease: "easeOut" });
      await wait(650);
      if (!alive || skipped.current) return;
      // o logo vira o sol: os raios abrem para fora do selo
      animate(sunScale, 1.2, { duration: 0.5, ease: EASE_OUT });
      animate(sunOpacity, 1, { duration: 0.4 });
      await animate(logoOpacity, 0, { duration: 0.4 });
      if (!alive || skipped.current) return;
      // a câmera entra no disco
      await animate(scale, zoom, { duration: 1.05, ease: EASE_IN });
      if (!alive || skipped.current) return;
      await reveal();
    })();

    return () => {
      alive = false;
      html.style.overflow = previous;
    };
  }, [phase, badge, glow, logoOpacity, logoScale, reveal, scale, sunOpacity, sunScale]);

  // devolve a rolagem quando a abertura termina
  useEffect(() => {
    if (phase !== "done") return;
    document.documentElement.style.overflow = "";
    if ("scrollRestoration" in history) history.scrollRestoration = "auto";
  }, [phase]);

  const skip = useCallback(() => {
    if (skipped.current) return;
    skipped.current = true;
    void reveal();
  }, [reveal]);

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, skip]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden bg-deep"
      style={{ zIndex: "var(--z-intro)", maskImage: mask, WebkitMaskImage: mask }}
      role="dialog"
      aria-label="Abertura do site"
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,106,43,0.16),transparent_70%)]"
        style={{ opacity: glow }}
      />

      <motion.div className="absolute left-1/2 top-1/2 will-change-transform" style={{ scale, x: "-50%", y: "-50%" }}>
        <div className="relative" style={{ width: badge, height: badge }}>
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{ width: badge * 0.8, x: "-50%", y: "-50%", scale: sunScale, opacity: sunOpacity }}
          >
            <Sun />
          </motion.div>
          <motion.img
            src={asset("media/logo.webp")}
            alt="Sun, Bar & Love"
            width={badge}
            height={badge}
            className="absolute inset-0 size-full rounded-full"
            style={{ opacity: logoOpacity, scale: logoScale }}
            fetchPriority="high"
          />
        </div>
      </motion.div>

      <button
        type="button"
        onClick={skip}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 h-11 -translate-x-1/2 rounded-full border border-cream/30 px-5 text-sm font-medium text-cream/80 transition hover:border-cream hover:text-cream"
      >
        Pular
      </button>
    </motion.div>
  );
}
