import { useCallback, useState } from "react";
import { MagnifyingGlassPlus, MapPin } from "@phosphor-icons/react";
import { asset } from "../asset";
import { EVENTS, SPOTLIGHT_ID } from "../content";
import { mapsLink } from "../lib";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";
import { TicketButton } from "./TicketButton";

const event = EVENTS.find((e) => e.id === SPOTLIGHT_ID);
const MAP = asset("media/mapa-cenna-dez.webp");

/** Mapa do espaço do próximo evento: a imagem do mapa, com toque/clique para ampliar. */
export function EventMap() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  if (!event) return null;
  const place = [event.venue, event.address, event.city].filter(Boolean).join(", ");
  const alt = `Mapa do evento no ${event.venue}, com a numeração das mesas e áreas e o bar de drinks`;

  return (
    <section id="mapa" className="relative overflow-clip bg-[linear-gradient(to_bottom,#07232c,#0b3341_55%,#07232c)] px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">Logística do evento</p>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Mapa do <span className="text-sun">evento</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
            Veja a disposição do {event.venue} no dia da festa. Toque no mapa para ampliar.
          </p>
        </Reveal>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          <Reveal>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ampliar o mapa do evento"
              className="group relative mx-auto block w-full max-w-[380px] cursor-zoom-in overflow-hidden rounded-card ring-1 ring-cream/20 shadow-[0_30px_70px_-25px_rgba(4,23,30,0.9)]"
            >
              <img
                src={MAP}
                alt={alt}
                width={1080}
                height={1920}
                loading="lazy"
                className="h-auto w-full transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-deep/85 px-3.5 py-2 text-sm font-semibold text-cream backdrop-blur">
                <MagnifyingGlassPlus size={18} /> Ampliar
              </span>
            </button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-6">
              <div className="rounded-card bg-deep/60 p-6 ring-1 ring-cream/15">
                <h3 className="font-display text-2xl uppercase leading-tight text-sun">Onde é</h3>
                <p className="mt-2 flex items-start gap-3 leading-relaxed text-cream/90">
                  <MapPin size={22} className="mt-0.5 shrink-0 text-sun" /> {place}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <TicketButton event={event} location="mapa" />
                <Button
                  variant="ghost"
                  href={mapsLink(event)}
                  external
                  icon={<MapPin size={18} />}
                  trackEvent={["maps_click", { event_id: event.id }]}
                >
                  Como chegar
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Modal open={open} onClose={close} label="Mapa do evento" panelClass="max-w-xl">
        <img src={MAP} alt={alt} className="mx-auto block max-h-[88dvh] w-auto max-w-full" />
      </Modal>
    </section>
  );
}
