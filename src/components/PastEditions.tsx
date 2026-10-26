import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGroup, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight, Images, MagnifyingGlass } from "@phosphor-icons/react";
import { track } from "../analytics";
import { EVENTS, SITE, type SbEvent } from "../content";
import { atVenue, eventDate } from "../lib";
import { EventModalBody, FlyerButton } from "./EventModal";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";

/** Velocidade da esteira, em px por segundo. */
const SPEED = 38;
/** Depois de arrastar, rolar ou usar as setas, a esteira espera esse tempo para voltar a andar. */
const RESUME_AFTER_MS = 3000;
/** Largura mínima (em px) que a faixa precisa ter para a esteira nunca mostrar vazio. */
const MIN_STRIP = 2400;
const CARD_STEP_FALLBACK = 310;

function EditionCard({ event, onOpen, clone, start }: { event: SbEvent; onOpen: (e: SbEvent) => void; clone: boolean; start: boolean }) {
  const date = eventDate(event);
  const total = event.albumTotal ?? event.album?.length ?? 0;
  return (
    <div data-start={start ? "" : undefined} className="flex w-[64vw] max-w-[280px] shrink-0 flex-col sm:w-[270px] lg:w-[290px]" aria-hidden={clone || undefined}>
      <FlyerButton event={event} onOpen={() => onOpen(event)} aspect="aspect-[4/5]" shared={false} tabIndex={clone ? -1 : undefined} />
      <div className="mt-4 flex flex-1 flex-col gap-3">
        <div>
          <h3 className="font-display text-xl uppercase leading-tight md:text-2xl">
            {event.title === SITE.name ? event.venue : event.title}
          </h3>
          <p className="mt-1 text-sm text-cream/75 md:text-base">{date.day}</p>
        </div>
        <button
          type="button"
          onClick={() => onOpen(event)}
          tabIndex={clone ? -1 : undefined}
          className="mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-sun px-4 text-[15px] font-semibold text-deep transition hover:brightness-105 active:scale-[0.97]"
        >
          <Images size={18} weight="fill" />
          {total > 0 ? `Ver ${total} fotos` : "Fotos em breve"}
        </button>
      </div>
    </div>
  );
}

/**
 * Esteira infinita: a lista é repetida e a faixa anda sozinha. Pausa com o mouse em cima, ao tocar,
 * com o foco no teclado, com o álbum aberto e fora da tela. Também dá para arrastar e usar as setas.
 */
function Conveyor({ events, onOpen, paused }: { events: SbEvent[]; onOpen: (e: SbEvent) => void; paused: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef({ hover: false, focus: false, visible: false, resumeAt: 0, modal: paused });
  const stepRef = useRef(CARD_STEP_FALLBACK);
  const dragRef = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });
  const reduce = useReducedMotion();
  const copies = Math.max(3, Math.ceil(MIN_STRIP / Math.max(1, events.length * CARD_STEP_FALLBACK)) + 2);

  useEffect(() => {
    pauseRef.current.modal = paused;
  }, [paused]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || events.length === 0) return;

    const starts = () => Array.from(el.querySelectorAll<HTMLElement>("[data-start]"));
    const measure = () => {
      const s = starts();
      if (s.length < 2) return 0;
      stepRef.current = s[0].nextElementSibling ? (s[0].nextElementSibling as HTMLElement).offsetLeft - s[0].offsetLeft : CARD_STEP_FALLBACK;
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
  }, [events.length, copies, reduce]);

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
      aria-label="Edições passadas"
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
          aria-label="Edições anteriores"
          onClick={() => nudge(-1)}
          className="flex size-11 items-center justify-center rounded-full border border-cream/30 text-cream transition hover:border-cream hover:bg-cream/10 active:scale-95"
        >
          <CaretLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Próximas edições"
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
          events.map((ev, i) => (
            <EditionCard key={`${c}-${ev.id}`} event={ev} onOpen={onOpen} clone={c !== 1} start={i === 0} />
          )),
        )}
      </div>
    </div>
  );
}

/** Edições passadas em seção própria, em esteira: a lista cresce a cada evento sem ocupar mais espaço na página. */
export function PastEditions() {
  const [selected, setSelected] = useState<SbEvent | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const past = EVENTS.filter((e) => e.status === "past");

  const open = (event: SbEvent) => {
    track("edition_open", { event_id: event.id });
    setSelected(event);
  };

  return (
    <section id="edicoes" className="relative overflow-clip bg-night py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-flame">
            <MagnifyingGlass size={18} weight="bold" /> Edições passadas
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Ache a <span className="text-sun">sua foto</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
            Veja as fotos dos últimos eventos, encontre você nelas e baixe em alta qualidade.
          </p>
        </Reveal>
      </div>

      <LayoutGroup>
        <div className="mt-12">
          <Conveyor events={past} onOpen={open} paused={!!selected} />
        </div>

        <Modal open={!!selected} onClose={close} label={selected ? `${selected.title}${atVenue(selected)}` : "Evento"}>
          {selected && <EventModalBody event={selected} onClose={close} />}
        </Modal>
      </LayoutGroup>
    </section>
  );
}
