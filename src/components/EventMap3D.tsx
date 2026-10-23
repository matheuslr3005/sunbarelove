import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowsClockwise, ImageSquare, Rows } from "@phosphor-icons/react";
import { asset } from "../asset";
import { Reveal } from "./Reveal";

/**
 * Mapa do evento em 3D, feito só com CSS (camadas empilhadas) sobre o desenho do cartaz.
 * Arraste para girar, use o controle de inclinação ou os botões de vista. As medidas são do "tabuleiro" de 1000x470.
 */
const BOARD = { w: 1000, h: 470 };

type GroupId = "entrada" | "palco" | "bar1" | "bar2" | "camarotes" | "mesas";

const INFO: Record<GroupId, { title: string; text: string }> = {
  entrada: { title: "Entrada", text: "Por aqui você chega ao evento. Fica na lateral direita do mapa, perto do Bar 1." },
  palco: { title: "Palco 360", text: "No centro da pista, com as mesas dos dois lados." },
  bar1: { title: "Bar 1", text: "Do lado da entrada, perto das mesas 4 a 9." },
  bar2: { title: "Bar 2", text: "No canto oposto à entrada, atrás das mesas 1, 2, 3, 10, 11 e 12." },
  camarotes: {
    title: "Camarotes 1 a 12",
    text: "Duas fileiras numeradas: os ímpares (1 a 11) na fileira de trás e os pares (2 a 12) na da frente.",
  },
  mesas: { title: "Mesas 1 a 12", text: "Círculos em volta do palco: 1, 2, 3, 10, 11 e 12 à esquerda, e 4 a 9 à direita." },
};

const LEGEND: { id: GroupId; label: string; color: string }[] = [
  { id: "entrada", label: "Entrada", color: "#f0286e" },
  { id: "palco", label: "Palco 360", color: "#ff4e5a" },
  { id: "bar1", label: "Bar 1", color: "#f0286e" },
  { id: "bar2", label: "Bar 2", color: "#f0286e" },
  { id: "camarotes", label: "Camarotes", color: "#19a7c9" },
  { id: "mesas", label: "Mesas", color: "#fff1d6" },
];

const BOOTHS_TOP = [1, 3, 5, 7, 9, 11];
const BOOTHS_BOTTOM = [2, 4, 6, 8, 10, 12];
const TABLES: { n: number; x: number; y: number }[] = [
  { n: 12, x: 240, y: 200 },
  { n: 1, x: 320, y: 180 },
  { n: 10, x: 212, y: 250 },
  { n: 2, x: 312, y: 238 },
  { n: 11, x: 262, y: 300 },
  { n: 3, x: 334, y: 296 },
  { n: 4, x: 570, y: 190 },
  { n: 7, x: 652, y: 200 },
  { n: 5, x: 594, y: 242 },
  { n: 9, x: 684, y: 248 },
  { n: 6, x: 580, y: 300 },
  { n: 8, x: 654, y: 296 },
];

interface BlockProps {
  group: GroupId;
  focus: GroupId | null;
  x: number;
  y: number;
  w: number;
  h: number;
  height: number;
  color: string;
  topColor?: string;
  round?: boolean;
  label?: string;
  labelColor?: string;
  fontSize?: number;
  vertical?: boolean;
  onFocus: (g: GroupId | null) => void;
}

/** Um volume: camadas empilhadas (as de baixo mais escuras) e a face de cima com o número. */
function Block({ group, focus, x, y, w, h, height, color, topColor, round, label, labelColor = "#fff1d6", fontSize = 26, vertical, onFocus }: BlockProps) {
  const lifted = focus === group;
  const layers = Math.max(2, Math.round(height / 5));
  const radius = round ? "50%" : "10px";
  return (
    <div
      className="absolute [transform-style:preserve-3d] transition-transform duration-300 ease-out"
      style={{ left: x, top: y, width: w, height: h, transform: `translateZ(${lifted ? 16 : 0}px)` }}
      onPointerEnter={() => onFocus(group)}
      onPointerLeave={() => onFocus(null)}
    >
      {Array.from({ length: layers }, (_, i) => {
        const top = i === layers - 1;
        return (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              borderRadius: radius,
              transform: `translateZ(${(height / layers) * (i + 1)}px)`,
              background: top ? topColor ?? color : color,
              filter: top ? undefined : `brightness(${0.55 + (i / layers) * 0.3})`,
              boxShadow: top && lifted ? "0 0 0 4px #ffc21a, 0 0 28px 6px rgba(255,194,26,0.7)" : top ? "inset 0 0 0 3px rgba(255,241,214,0.85)" : undefined,
            }}
          >
            {top && label && (
              <span
                className="font-display uppercase leading-none"
                style={{
                  color: labelColor,
                  fontSize,
                  writingMode: vertical ? "vertical-rl" : undefined,
                  textShadow: labelColor === "#fff1d6" ? "0 2px 0 rgba(4,23,30,0.35)" : undefined,
                }}
              >
                {label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function EventMap3D() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(56);
  const rotZ = useMotionValue(-14);
  const scale = useMotionValue(0.7);
  const [focus, setFocus] = useState<GroupId | null>(null);
  const [pinned, setPinned] = useState<GroupId>("palco");
  const [tilt, setTilt] = useState(56);
  // no celular o mapa fica em pé (girado 90°), para aproveitar a altura da tela
  const [portrait, setPortrait] = useState(false);
  const base = portrait ? 90 : 0;
  const autoplay = useRef<{ stop: () => void } | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const transform = useMotionTemplate`translate(-50%, -50%) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;

  // o tabuleiro acompanha a largura do espaço disponível
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => {
      const narrow = window.matchMedia("(max-width: 639px)").matches;
      setPortrait(narrow);
      scale.set(narrow ? Math.min(el.clientWidth / 720, 1) : Math.min(el.clientWidth / 1120, 1.15));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scale]);

  // balanço lento até a pessoa mexer no mapa
  useEffect(() => {
    if (reduce) {
      rotZ.set(base - 14);
      return;
    }
    autoplay.current = animate(rotZ, [base - 26, base + 10], { duration: 9, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" });
    return () => autoplay.current?.stop();
  }, [reduce, rotZ, base]);

  const stopAuto = () => autoplay.current?.stop();

  const goTo = (x: number, z: number) => {
    stopAuto();
    setTilt(x);
    void animate(rotX, x, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    void animate(rotZ, z, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    stopAuto();
    drag.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    rotZ.set(rotZ.get() + (e.clientX - drag.current.x) * 0.45);
    if (e.pointerType === "mouse") {
      const next = Math.min(80, Math.max(0, rotX.get() - (e.clientY - drag.current.y) * 0.3));
      rotX.set(next);
      setTilt(Math.round(next));
    }
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => {
    drag.current = null;
  };

  const shown = focus ?? pinned;
  const common = { focus, onFocus: setFocus };

  return (
    <section id="mapa" className="relative overflow-clip bg-[linear-gradient(to_bottom,#07232c,#0b3341_55%,#07232c)] px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">Logística do evento</p>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Mapa do <span className="text-sun">evento</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
            Arraste para girar e veja onde ficam o palco, os bares, os camarotes, as mesas e a entrada.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-card bg-[radial-gradient(circle_at_50%_40%,#12627a,#07232c_75%)] ring-1 ring-cream/15">
              <div
                ref={wrap}
                role="img"
                aria-label="Mapa do evento em 3D: palco 360 no centro, bares 1 e 2, camarotes de 1 a 12, mesas de 1 a 12 e a entrada"
                className="relative h-[clamp(300px,62vw,620px)] max-sm:h-[clamp(440px,132vw,640px)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
                style={{ perspective: "1500px", perspectiveOrigin: "50% 38%" } as CSSProperties}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              >
                <motion.div
                  className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                  style={{ width: BOARD.w, height: BOARD.h, transform }}
                >
                  {/* chão */}
                  <div className="absolute inset-0 rounded-[48px] bg-[linear-gradient(135deg,#ffb21a,#ff8a1f)] shadow-[0_60px_60px_-20px_rgba(4,23,30,0.8)] ring-[6px] ring-cream/90" />
                  <div className="absolute inset-x-8 top-1/2 h-24 -translate-y-1/2 rounded-[999px] bg-[linear-gradient(90deg,#f0286e,#ff6a2b)] opacity-80" style={{ transform: "translateZ(1px) rotate(-3deg)" }} />

                  <Block {...common} group="bar2" x={24} y={34} w={130} h={104} height={30} color="#d81f5c" topColor="#f0286e" label="Bar 2" fontSize={30} />
                  {BOOTHS_TOP.map((n, i) => (
                    <Block {...common} key={n} group="camarotes" x={190 + i * 98} y={34} w={84} h={60} height={18} color="#0b7f9a" topColor="#19a7c9" label={String(n)} labelColor="#fff1d6" fontSize={30} />
                  ))}
                  {BOOTHS_BOTTOM.map((n, i) => (
                    <Block {...common} key={n} group="camarotes" x={190 + i * 98} y={376} w={84} h={60} height={18} color="#0b7f9a" topColor="#19a7c9" label={String(n)} labelColor="#fff1d6" fontSize={30} />
                  ))}
                  <Block {...common} group="entrada" x={924} y={140} w={44} h={190} height={22} color="#d81f5c" topColor="#f0286e" label="Entrada" fontSize={22} vertical />
                  <Block {...common} group="bar1" x={738} y={188} w={120} h={100} height={30} color="#d81f5c" topColor="#f0286e" label="Bar 1" fontSize={30} />
                  <Block {...common} group="palco" x={393} y={165} w={150} h={150} height={44} color="#a3123f" topColor="#f0286e" round label="Palco 360" fontSize={24} />
                  {TABLES.map((t) => (
                    <Block {...common} key={t.n} group="mesas" x={t.x} y={t.y} w={46} h={46} height={20} color="#c9a46a" topColor="#f0286e" round label={String(t.n)} fontSize={22} />
                  ))}
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-cream/15 bg-deep/50 p-4">
                <button
                  type="button"
                  onClick={() => goTo(56, base - 14)}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-sun px-5 text-sm font-semibold text-deep transition hover:bg-[#ffd24d] active:scale-[0.97]"
                >
                  <ArrowsClockwise size={18} /> Vista 3D
                </button>
                <button
                  type="button"
                  onClick={() => goTo(0, base)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-cream/40 px-5 text-sm font-semibold transition hover:bg-cream/10 active:scale-[0.97]"
                >
                  <Rows size={18} /> De cima
                </button>
                <label className="ml-auto flex items-center gap-3 text-sm text-cream/80">
                  Inclinação
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={tilt}
                    onChange={(e) => {
                      stopAuto();
                      setTilt(Number(e.target.value));
                      rotX.set(Number(e.target.value));
                    }}
                    className="h-11 w-32 accent-[#ffc21a] md:w-40"
                  />
                </label>
              </div>
            </div>

            <div className="grid content-start gap-4">
              <ul className="flex flex-wrap gap-2 lg:grid lg:grid-cols-2" aria-label="Legenda do mapa">
                {LEGEND.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => setPinned(l.id)}
                      onPointerEnter={() => setFocus(l.id)}
                      onPointerLeave={() => setFocus(null)}
                      aria-pressed={pinned === l.id}
                      className={`inline-flex h-11 w-full items-center gap-2 rounded-full border px-4 text-sm font-semibold transition active:scale-[0.97] ${
                        shown === l.id ? "border-sun bg-sun/15 text-sun" : "border-cream/25 text-cream/90 hover:border-cream/60"
                      }`}
                    >
                      <span className="size-3 shrink-0 rounded-full" style={{ background: l.color }} />
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="rounded-card bg-deep/60 p-6 ring-1 ring-cream/15" aria-live="polite">
                <h3 className="font-display text-2xl uppercase leading-tight text-sun">{INFO[shown].title}</h3>
                <p className="mt-2 leading-relaxed text-cream/85">{INFO[shown].text}</p>
              </div>
              <a
                href={asset("media/mapa-evento.webp")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-cream/40 px-6 font-semibold transition hover:bg-cream/10 active:scale-[0.97]"
              >
                <ImageSquare size={20} /> Ver o mapa em imagem
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
