import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowsClockwise, ImageSquare, MapPin, Rows } from "@phosphor-icons/react";
import { asset } from "../asset";
import { EVENTS, SPOTLIGHT_ID } from "../content";
import { mapsLink } from "../lib";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";
import { TicketButton } from "./TicketButton";

/**
 * Mapa do evento em 3D, feito só com CSS (camadas empilhadas), a partir da planta do Cenna.
 * Arraste para girar, use o controle de inclinação ou os botões de vista. As medidas são do "tabuleiro" de 1000x720.
 * As posições vêm da imagem do mapa (`mapa-cenna-dez.webp`): cada número é o centro da mesa no tabuleiro.
 */
const BOARD = { w: 1000, h: 720 };
const MAP_IMAGE = asset("media/mapa-cenna-dez.webp");

type GroupId = "dj" | "bar" | "mesasM" | "mesasA" | "parede" | "rio";

const INFO: Record<GroupId, { title: string; text: string }> = {
  dj: { title: "DJ", text: "No centro do espaço, com as mesas M1 a M8 em volta." },
  bar: { title: "Bar Drink", text: "No canto esquerdo do mapa, perto das mesas A1 a A3." },
  mesasM: {
    title: "Mesas M1 a M16",
    text: "Mesas com sofás: M1 a M8 em volta do DJ, M9 a M12 na fileira de baixo e M13 a M16 do lado do rio.",
  },
  mesasA: {
    title: "Mesas A1 a A13",
    text: "A1 a A3 na lateral do bar, A4 a A7 em diagonal até o DJ, A8 e A9 perto da parede e A10 a A13 ao longo do vidro.",
  },
  parede: { title: "Parede do Cenna", text: "Ao fundo do espaço, com o letreiro CENNA. As mesas M1 a M3 ficam logo à frente dela." },
  rio: { title: "Vidro e rio", text: "O guarda-corpo de vidro separa o espaço do terraço com vista para o rio." },
};

const LEGEND: { id: GroupId; label: string; color: string }[] = [
  { id: "dj", label: "DJ", color: "#0b1f26" },
  { id: "bar", label: "Bar Drink", color: "#f0286e" },
  { id: "mesasM", label: "Mesas M", color: "#19a7c9" },
  { id: "mesasA", label: "Mesas A", color: "#fff1d6" },
  { id: "parede", label: "Parede Cenna", color: "#4b5b63" },
  { id: "rio", label: "Vidro e rio", color: "#7fd3e8" },
];

/** Centro de cada mesa no tabuleiro (px). */
const TABLES_M: { n: number; x: number; y: number }[] = [
  { n: 1, x: 349, y: 167 },
  { n: 2, x: 441, y: 160 },
  { n: 3, x: 524, y: 152 },
  { n: 4, x: 324, y: 271 },
  { n: 5, x: 515, y: 241 },
  { n: 6, x: 322, y: 328 },
  { n: 8, x: 509, y: 311 },
  { n: 9, x: 396, y: 536 },
  { n: 10, x: 488, y: 520 },
  { n: 11, x: 565, y: 506 },
  { n: 12, x: 642, y: 496 },
  { n: 13, x: 738, y: 481 },
  { n: 14, x: 792, y: 471 },
  { n: 15, x: 837, y: 460 },
  { n: 16, x: 882, y: 452 },
];
const TABLES_A: { n: number; x: number; y: number }[] = [
  { n: 1, x: 265, y: 566 },
  { n: 2, x: 271, y: 503 },
  { n: 3, x: 278, y: 442 },
  { n: 4, x: 359, y: 430 },
  { n: 5, x: 436, y: 419 },
  { n: 6, x: 511, y: 407 },
  { n: 7, x: 589, y: 384 },
  { n: 8, x: 604, y: 238 },
  { n: 9, x: 604, y: 176 },
  { n: 10, x: 795, y: 256 },
  { n: 11, x: 797, y: 303 },
  { n: 12, x: 798, y: 348 },
  { n: 13, x: 800, y: 397 },
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
  const event = EVENTS.find((e) => e.id === SPOTLIGHT_ID);
  const wrap = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(54);
  const rotZ = useMotionValue(-10);
  const scale = useMotionValue(0.7);
  const [focus, setFocus] = useState<GroupId | null>(null);
  const [pinned, setPinned] = useState<GroupId>("dj");
  const [tilt, setTilt] = useState(54);
  const [imageOpen, setImageOpen] = useState(false);
  const closeImage = useCallback(() => setImageOpen(false), []);
  // no celular o mapa fica em pé (girado 90°), para aproveitar a altura da tela
  const [portrait, setPortrait] = useState(false);
  const base = portrait ? 90 : 0;
  const autoplay = useRef<{ stop: () => void } | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const transform = useMotionTemplate`translate(-50%, -50%) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;

  // o tabuleiro acompanha o espaço disponível
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => {
      const narrow = window.matchMedia("(max-width: 639px)").matches;
      setPortrait(narrow);
      scale.set(narrow ? Math.min(el.clientWidth / 800, 1) : Math.min(el.clientWidth / 1080, 1.1));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scale]);

  // balanço lento até a pessoa mexer no mapa
  useEffect(() => {
    if (reduce) {
      rotZ.set(base - 10);
      return;
    }
    autoplay.current = animate(rotZ, [base - 22, base + 8], { duration: 9, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" });
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
            Arraste para girar e veja onde ficam o DJ, o bar, as mesas e o vidro com vista para o rio.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-card bg-[radial-gradient(circle_at_50%_40%,#12627a,#07232c_75%)] ring-1 ring-cream/15">
              <div
                ref={wrap}
                role="img"
                aria-label="Mapa do evento em 3D: parede do Cenna ao fundo, DJ no centro, mesas M1 a M16 e A1 a A13, Bar Drink à esquerda e o vidro com vista para o rio à direita"
                className="relative h-[clamp(320px,56vw,600px)] max-sm:h-[clamp(430px,125vw,620px)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
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
                  {/* água (rio) */}
                  <div className="absolute rounded-[28px] bg-[linear-gradient(90deg,#12627a,#19a7c9)] opacity-90" style={{ left: 930, top: 20, width: 70, height: 600 }} />
                  <div
                    className="absolute flex items-center justify-center font-display text-3xl uppercase tracking-[0.3em] text-cream/85 [writing-mode:vertical-rl]"
                    style={{ left: 930, top: 20, width: 70, height: 600, transform: "translateZ(2px)" }}
                  >
                    Rio
                  </div>
                  {/* terraço */}
                  <div className="absolute rounded-r-[40px] bg-[linear-gradient(135deg,#ffe3b0,#ffcf7f)] ring-[4px] ring-cream/80" style={{ left: 764, top: 58, width: 168, height: 520 }} />
                  {/* chão do espaço */}
                  <div
                    className="absolute rounded-l-[44px] bg-[linear-gradient(135deg,#ffb21a,#ff8a1f)] shadow-[0_60px_60px_-20px_rgba(4,23,30,0.8)] ring-[6px] ring-cream/90"
                    style={{ left: 20, top: 58, width: 748, height: 620 }}
                  />

                  {/* parede do Cenna (fundo e lateral esquerda) */}
                  <Block {...common} group="parede" x={262} y={32} w={510} h={28} height={42} color="#1b262b" topColor="#2c3b42" label="CENNA" labelColor="#fff1d6" fontSize={20} />
                  <Block {...common} group="parede" x={262} y={60} w={16} h={290} height={42} color="#1b262b" topColor="#2c3b42" />
                  {/* vidro ao longo do terraço */}
                  <Block {...common} group="rio" x={762} y={60} w={8} h={482} height={44} color="rgba(120,205,228,0.55)" topColor="rgba(205,244,255,0.9)" />
                  {/* vasos no terraço */}
                  <Block {...common} group="rio" x={814} y={137} w={70} h={70} height={26} color="#b9622b" topColor="#d9803c" round />
                  <Block {...common} group="rio" x={830} y={326} w={44} h={44} height={22} color="#b9622b" topColor="#d9803c" round />

                  <Block {...common} group="bar" x={26} y={384} w={150} h={118} height={32} color="#d81f5c" topColor="#f0286e" label="Bar Drink" fontSize={22} />
                  <Block {...common} group="dj" x={376} y={236} w={100} h={46} height={32} color="#0b1f26" topColor="#1d3b47" label="DJ" fontSize={26} />

                  {TABLES_M.map((t) => {
                    // M13 a M16 ficam bem juntas no mapa: mesas menores
                    const small = t.n >= 13;
                    const w = small ? 42 : 74;
                    const h = small ? 38 : 52;
                    return (
                      <Block {...common} key={`m${t.n}`} group="mesasM" x={t.x - w / 2} y={t.y - h / 2} w={w} h={h} height={20} color="#0b7f9a" topColor="#19a7c9" label={`M${t.n}`} fontSize={small ? 15 : 22} />
                    );
                  })}
                  {TABLES_A.map((t) => (
                    <Block {...common} key={`a${t.n}`} group="mesasA" x={t.x - 21} y={t.y - 21} w={42} h={42} height={14} color="#c9a46a" topColor="#fff1d6" label={`A${t.n}`} labelColor="#0b1f26" fontSize={17} />
                  ))}
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-cream/15 bg-deep/50 p-4">
                <button
                  type="button"
                  onClick={() => goTo(54, base - 10)}
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
                      <span className="size-3 shrink-0 rounded-full ring-1 ring-cream/40" style={{ background: l.color }} />
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="rounded-card bg-deep/60 p-6 ring-1 ring-cream/15" aria-live="polite">
                <h3 className="font-display text-2xl uppercase leading-tight text-sun">{INFO[shown].title}</h3>
                <p className="mt-2 leading-relaxed text-cream/85">{INFO[shown].text}</p>
              </div>
              <button
                type="button"
                onClick={() => setImageOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-cream/40 px-6 font-semibold transition hover:bg-cream/10 active:scale-[0.97]"
              >
                <ImageSquare size={20} /> Ver o mapa em imagem
              </button>
              {event && (
                <div className="flex flex-wrap items-center gap-3">
                  <TicketButton event={event} location="mapa" />
                  <Button variant="ghost" href={mapsLink(event)} external icon={<MapPin size={18} />} trackEvent={["maps_click", { event_id: event.id }]}>
                    Como chegar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      <Modal open={imageOpen} onClose={closeImage} label="Mapa do evento em imagem" panelClass="max-w-xl">
        <img
          src={MAP_IMAGE}
          alt="Mapa do evento no Cenna, com a numeração das mesas e áreas e o bar de drinks"
          className="mx-auto block max-h-[88dvh] w-auto max-w-full"
        />
      </Modal>
    </section>
  );
}
