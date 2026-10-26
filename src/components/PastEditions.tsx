import { useCallback, useState } from "react";
import { LayoutGroup } from "motion/react";
import { Images, MagnifyingGlass } from "@phosphor-icons/react";
import { track } from "../analytics";
import { EVENTS, SITE, type SbEvent } from "../content";
import { atVenue, eventDate } from "../lib";
import { EventModalBody, FlyerButton } from "./EventModal";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";

function EditionCard({ event, onOpen }: { event: SbEvent; onOpen: (e: SbEvent) => void }) {
  const date = eventDate(event);
  const total = event.albumTotal ?? event.album?.length ?? 0;
  return (
    <div className="flex flex-col">
      <FlyerButton event={event} onOpen={() => onOpen(event)} aspect="aspect-[4/5]" />
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
          className="mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-sun px-4 text-[15px] font-semibold text-deep transition hover:brightness-105 active:scale-[0.97]"
        >
          <Images size={18} weight="fill" />
          {total > 0 ? `Ver ${total} fotos` : "Fotos em breve"}
        </button>
      </div>
    </div>
  );
}

/** Edições passadas, em seção própria: a pessoa chega, acha o evento dela e abre o álbum sem trocar de aba. */
export function PastEditions() {
  const [selected, setSelected] = useState<SbEvent | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const past = EVENTS.filter((e) => e.status === "past");

  const open = (event: SbEvent) => {
    track("edition_open", { event_id: event.id });
    setSelected(event);
  };

  return (
    <section id="edicoes" className="relative overflow-clip bg-night px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
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

        <LayoutGroup>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 lg:grid-cols-3">
            {past.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 5) * 0.05}>
                <EditionCard event={e} onOpen={open} />
              </Reveal>
            ))}
          </div>

          <Modal open={!!selected} onClose={close} label={selected ? `${selected.title}${atVenue(selected)}` : "Evento"}>
            {selected && <EventModalBody event={selected} onClose={close} />}
          </Modal>
        </LayoutGroup>
      </div>
    </section>
  );
}
