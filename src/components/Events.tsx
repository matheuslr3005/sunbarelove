import { useCallback, useState } from "react";
import { LayoutGroup } from "motion/react";
import { ArrowUpRight, Clock, MapPin, WhatsappLogo } from "@phosphor-icons/react";
import { track } from "../analytics";
import { EVENTS, SPOTLIGHT_ID, type SbEvent } from "../content";
import { atVenue, eventDate, hasWhatsapp, whatsappLink } from "../lib";
import { Button } from "./Button";
import { Countdown } from "./Countdown";
import { EventModalBody, FlyerButton } from "./EventModal";
import { Lineup } from "./Lineup";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";
import { SaleBadge } from "./SaleBadge";
import { TicketButton } from "./TicketButton";

function UpcomingFeature({ event, onOpen }: { event: SbEvent; onOpen: (e: SbEvent) => void }) {
  const date = eventDate(event);
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16">
      <div className="w-full max-w-[440px] lg:max-w-none">
        <FlyerButton event={event} onOpen={() => onOpen(event)} />
      </div>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">{date.weekday}</p>
          <h3 className="mt-2 font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[0.95] tracking-tight">
            {date.day}
          </h3>
        </div>
        <ul className="grid gap-3 text-cream/90">
          <li className="flex items-center gap-3">
            <Clock size={22} className="text-sun" /> {event.time ? `Abertura às ${event.time}` : "Horário em breve"}
          </li>
          <li className="flex items-center gap-3">
            <MapPin size={22} className="text-sun" />
            <span>
              {event.venue ? [event.venue, event.city].filter(Boolean).join(", ") : "Local em breve"}
            </span>
          </li>
        </ul>
        <div>
          <SaleBadge sale={event.sale} />
        </div>
        <Lineup groups={event.lineup} />
        {event.startsAt && <Countdown startsAt={event.startsAt} />}
        <div className="flex flex-wrap gap-3">
          <TicketButton event={event} location="evento" />
          <Button variant="ghost" onClick={() => onOpen(event)} icon={<ArrowUpRight size={18} />}>
            Detalhes
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Data já marcada, mas ainda sem venda: cartão horizontal (miniatura + data + local) dentro de "Novas datas". */
function SaveTheDateTile({ event, onOpen }: { event: SbEvent; onOpen: (e: SbEvent) => void }) {
  const date = eventDate(event);
  const place = [event.venue, event.city].filter(Boolean).join(" · ");
  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      aria-label={`Ver detalhes: ${date.weekday ? `${date.weekday}, ` : ""}${date.day}, ${place}`}
      className="group flex w-full items-center gap-4 rounded-card bg-deep p-3 pr-5 text-left text-cream shadow-[0_18px_40px_-18px_rgba(4,23,30,0.8)] transition duration-300 ease-out-expo hover:-translate-y-1 active:scale-[0.98]"
    >
      <img src={event.flyer} alt="" loading="lazy" className="size-20 shrink-0 rounded-[20px] object-cover ring-1 ring-cream/20" />
      <span className="grid gap-0.5">
        {date.weekday && <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sun">{date.weekday}</span>}
        <span className="font-display text-xl uppercase leading-tight md:text-2xl">{date.day}</span>
        <span className="text-sm text-cream/80">{place}</span>
        <span className="mt-1 text-xs font-semibold text-cream/60">Ingressos em breve</span>
      </span>
    </button>
  );
}

export function Events() {
  const [selected, setSelected] = useState<SbEvent | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const upcoming = EVENTS.filter((e) => e.status === "upcoming" && !e.saveTheDate && e.id !== SPOTLIGHT_ID);
  const saveTheDates = EVENTS.filter((e) => e.status === "upcoming" && e.saveTheDate);

  return (
    <section id="agenda" className="relative overflow-clip bg-[linear-gradient(to_bottom,#07232c,#0b3341_60%,#07232c)] px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">Próximos eventos</p>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Marca na <span className="text-rose">agenda</span>
          </h2>
        </Reveal>

        <LayoutGroup>
          <div className="mt-12 grid gap-16">
            {upcoming.map((e) => (
              <UpcomingFeature key={e.id} event={e} onOpen={setSelected} />
            ))}

            <div className="overflow-hidden rounded-card bg-[linear-gradient(120deg,#f0286e,#ff6a2b_60%,#ffc21a)] p-8 text-deep md:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-12">
                <div>
                  <h3 className="max-w-md font-display text-3xl uppercase leading-tight md:text-4xl">
                    Novas datas saem em breve
                  </h3>
                  <p className="mt-3 max-w-md text-deep/85">
                    {saveTheDates.length > 0 ? "Já pode marcar na agenda. " : ""}
                    {hasWhatsapp
                      ? "Chama no WhatsApp e seja o primeiro a saber."
                      : "Fique de olho: a gente avisa por aqui assim que tiver novidade."}
                  </p>
                  {hasWhatsapp && (
                    <div className="mt-6">
                      <a
                        href={whatsappLink("Oi! Quero ser avisado das próximas edições do Sun, Bar & Love.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("whatsapp_click", { location: "novas_datas" })}
                        className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-deep px-6 font-semibold text-cream transition hover:bg-night active:scale-[0.97]"
                      >
                        <WhatsappLogo size={20} weight="fill" /> Chamar no WhatsApp
                      </a>
                    </div>
                  )}
                </div>
                {saveTheDates.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {saveTheDates.map((e) => (
                      <SaveTheDateTile key={e.id} event={e} onOpen={setSelected} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Modal open={!!selected} onClose={close} label={selected ? `${selected.title}${atVenue(selected)}` : "Evento"}>
            {selected && <EventModalBody event={selected} onClose={close} />}
          </Modal>
        </LayoutGroup>
      </div>
    </section>
  );
}
