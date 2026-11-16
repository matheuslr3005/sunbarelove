import { useCallback, useState } from "react";
import { LayoutGroup } from "motion/react";
import { ArrowUpRight, Images, MagnifyingGlass } from "@phosphor-icons/react";
import { track } from "../analytics";
import { EVENTS, SITE, type SbEvent } from "../content";
import { atVenue, eventDate } from "../lib";
import { Conveyor } from "./Conveyor";
import { EventModalBody, FlyerButton } from "./EventModal";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";

function EditionCard({ event, onOpen, clone, start }: { event: SbEvent; onOpen: (e: SbEvent) => void; clone: boolean; start: boolean }) {
  const date = eventDate(event);
  const total = event.albumTotal ?? event.album?.length ?? 0;
  return (
    <div data-start={start ? "" : undefined} className="flex w-[64vw] max-w-[280px] shrink-0 flex-col sm:w-[270px] lg:w-[290px]" aria-hidden={clone || undefined}>
      <div className="relative">
        <FlyerButton event={event} onOpen={() => onOpen(event)} aspect="aspect-[4/5]" shared={false} tabIndex={clone ? -1 : undefined} />
        {event.featured && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-rose px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-cream shadow-[0_8px_20px_-6px_rgba(240,40,110,0.9)]">
            Novo
          </span>
        )}
      </div>
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

/** Álbum de comemoração em destaque: banner grande no topo da seção, antes da esteira. */
function FeaturedAlbum({ event, onOpen }: { event: SbEvent; onOpen: (e: SbEvent) => void }) {
  const date = eventDate(event);
  const total = event.albumTotal ?? event.album?.length ?? 0;
  return (
    <div className="relative overflow-hidden rounded-card bg-[linear-gradient(120deg,#f0286e,#ff6a2b_60%,#ffc21a)] p-6 text-deep md:p-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-16 select-none font-display text-[clamp(14rem,34vw,26rem)] leading-none text-cream/20"
      >
        7
      </span>
      <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,220px)_1fr] md:gap-12">
        <button
          type="button"
          onClick={() => onOpen(event)}
          aria-label={`Ver as fotos: ${event.title}`}
          className="mx-auto block w-full max-w-[220px] -rotate-2 overflow-hidden rounded-card ring-4 ring-cream shadow-[0_30px_60px_-20px_rgba(4,23,30,0.8)] transition-transform duration-500 ease-out-expo hover:rotate-0 hover:scale-[1.02]"
        >
          <img src={event.flyer} alt={`Cartaz: ${event.title}`} draggable={false} className="aspect-[4/5] w-full object-cover object-[50%_40%]" />
        </button>
        <div>
          <p className="inline-flex rounded-full bg-deep px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-sun">
            Novo · Álbum de comemoração
          </p>
          <h3 className="mt-4 font-display text-[clamp(2rem,5vw,3.6rem)] uppercase leading-[0.98] tracking-tight">{event.title}</h3>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-deep/90">
            Reviva a festa de aniversário: {total > 0 ? `${total} fotos` : "as fotos"} do dia {date.day}
            {event.venue ? `, no ${event.venue}` : ""}. Ache a sua e baixe em alta qualidade.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpen(event)}
              className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-deep px-6 text-[15px] font-semibold text-cream transition hover:bg-night active:scale-[0.97]"
            >
              <Images size={20} weight="fill" /> Ver as fotos
            </button>
            {event.albumUrl && (
              <a
                href={event.albumUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("album_drive_open", { event_id: event.id, from: "destaque" })}
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-deep/60 px-6 text-[15px] font-semibold transition hover:bg-deep/10 active:scale-[0.97]"
              >
                Álbum completo no Drive <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Edições passadas em seção própria, em esteira: a lista cresce a cada evento sem ocupar mais espaço na página. */
export function PastEditions() {
  const [selected, setSelected] = useState<SbEvent | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const past = EVENTS.filter((e) => e.status === "past");
  const featured = past.find((e) => e.featured && e.album?.length);

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
        {featured && (
          <div className="mx-auto mt-12 max-w-6xl px-5 md:px-8">
            <Reveal>
              <FeaturedAlbum event={featured} onOpen={open} />
            </Reveal>
          </div>
        )}
        <div className="mt-12">
          <Conveyor
            items={past}
            getKey={(e) => e.id}
            renderItem={(e, { clone, start }) => <EditionCard event={e} onOpen={open} clone={clone} start={start} />}
            paused={!!selected}
            label="Edições passadas"
            prevLabel="Edições anteriores"
            nextLabel="Próximas edições"
          />
        </div>

        <Modal open={!!selected} onClose={close} label={selected ? `${selected.title}${atVenue(selected)}` : "Evento"}>
          {selected && <EventModalBody event={selected} onClose={close} />}
        </Modal>
      </LayoutGroup>
    </section>
  );
}
