import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

/** Velocidade da esteira, em px por segundo. */
const SPEED = 38;
/** Depois de arrastar, rolar ou usar as setas, a esteira espera esse tempo para voltar a andar. */
const RESUME_AFTER_MS = 3000;
/** Largura mínima (em px) que a faixa precisa ter para a esteira nunca mostrar vazio. */
const MIN_STRIP = 2400;

interface Props<T> {
  items: T[];
  getKey: (item: T) => string;
  /** Desenha um item. O elemento raiz precisa ter `data-start` quando `start` for true (a esteira mede por ele). `clone` = cópia usada só para o loop (fica fora do teclado/leitor de tela). */
  renderItem: (item: T, state: { clone: boolean; start: boolean }) => ReactNode;
  /** Largura aproximada de um item + espaço, em px: só serve para saber quantas cópias fazer. */
  stepGuess?: number;
  /** Pausa a esteira (ex.: modal aberto). */
  paused?: boolean;
  /** Nome da esteira para leitores de tela e botões das setas. */
  label: string;
  prevLabel?: string;
  nextLabel?: string;
}

/**
 * Esteira infinita: a lista é repetida e a faixa anda sozinha. Pausa com o mouse em cima, ao tocar,
 * com o foco no teclado, com um modal aberto e fora da tela. Também dá para arrastar e usar as setas.
 */
export function Conveyor<T>({ items, getKey, renderItem, stepGuess = 310, paused = false, label, prevLabel = "Anteriores", nextLabel = "Próximos" }: Props<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef({ hover: false, focus: false, visible: false, resumeAt: 0, modal: paused });
  const stepRef = useRef(stepGuess);
  const dragRef = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });
  const reduce = useReducedMotion();
  const copies = Math.max(3, Math.ceil(MIN_STRIP / Math.max(1, items.length * stepGuess)) + 2);

  useEffect(() => {
    pauseRef.current.modal = paused;
  }, [paused]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return;

    const starts = () => Array.from(el.querySelectorAll<HTMLElement>("[data-start]"));
    const measure = () => {
      const s = starts();
      if (s.length < 2) return 0;
      stepRef.current = s[0].nextElementSibling ? (s[0].nextElementSibling as HTMLElement).offsetLeft - s[0].offsetLeft : stepGuess;
      return s[1].offsetLeft - s[0].offsetLeft;
    };

    let w = measure();
    let pos = w;
    el.scrollLeft = w;
    let last = performance.now();
    let raf = 0;

    const io = new IntersectionObserver(([entry]) => {
      pauseRef.current.visible = entry.isIntersecting;
    });
    io.observe(el);

    const onResize = () => {
      const oldW = w;
      w = measure();
      if (oldW > 0 && w > 0) el.scrollLeft = (el.scrollLeft / oldW) * w;
    };
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = pauseRef.current;
      const idle = !reduce && p.visible && !p.hover && !p.focus && !p.modal && now > p.resumeAt && !dragRef.current.active && !document.hidden;
      if (idle) pos += SPEED * dt;
      else pos = el.scrollLeft;
      if (w > 0) {
        if (pos >= 2 * w) pos -= w;
        else if (pos < w) pos += w;
      }
      if (idle || Math.abs(el.scrollLeft - pos) > 1) el.scrollLeft = pos;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [items.length, copies, reduce, stepGuess]);

  const holdFor = (ms = RESUME_AFTER_MS) => {
    pauseRef.current.resumeAt = performance.now() + ms;
  };

  const nudge = (dir: 1 | -1) => {
    holdFor(RESUME_AFTER_MS + 600);
    trackRef.current?.scrollBy({ left: dir * stepRef.current, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active || !trackRef.current) return;
    d.moved = Math.max(d.moved, Math.abs(e.clientX - d.startX));
    trackRef.current.scrollLeft = d.startLeft - (e.clientX - d.startX);
  };
  const endDrag = () => {
    if (dragRef.current.active) holdFor();
    dragRef.current.active = false;
  };

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      className="relative"
      onFocus={(e) => {
        // só o foco do teclado pausa; clicar numa seta com o mouse não deve travar a esteira
        if (e.target.matches(":focus-visible")) pauseRef.current.focus = true;
      }}
      onBlur={() => (pauseRef.current.focus = false)}
    >
      <div className="mx-auto mb-6 flex max-w-6xl justify-end gap-2 px-5 md:px-8">
        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => nudge(-1)}
          className="flex size-11 items-center justify-center rounded-full border border-cream/30 text-cream transition hover:border-cream hover:bg-cream/10 active:scale-95"
        >
          <CaretLeft size={20} />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => nudge(1)}
          className="flex size-11 items-center justify-center rounded-full border border-cream/30 text-cream transition hover:border-cream hover:bg-cream/10 active:scale-95"
        >
          <CaretRight size={20} />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex cursor-grab gap-5 overflow-x-auto overscroll-x-contain px-5 pb-2 [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] [scrollbar-width:none] active:cursor-grabbing md:gap-8 md:px-8 [&::-webkit-scrollbar]:hidden"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") pauseRef.current.hover = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") pauseRef.current.hover = false;
          endDrag();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onTouchStart={() => holdFor(RESUME_AFTER_MS * 4)}
        onTouchEnd={() => holdFor()}
        onWheel={() => holdFor()}
        onClickCapture={(e) => {
          if (dragRef.current.moved > 6) {
            e.preventDefault();
            e.stopPropagation();
          }
          dragRef.current.moved = 0;
        }}
      >
        {Array.from({ length: copies }, (_, c) =>
          items.map((item, i) => (
            <Fragment key={`${c}-${getKey(item)}`}>{renderItem(item, { clone: c !== 1, start: i === 0 })}</Fragment>
          )),
        )}
      </div>
    </div>
  );
}
