import { motion } from "motion/react";
import { Clock, MapPin, MapTrifold } from "@phosphor-icons/react";
import { EVENTS, SPOTLIGHT_ID } from "../content";
import { eventDate, mapsLink } from "../lib";
import { Button } from "./Button";
import { Countdown } from "./Countdown";
import { Lineup } from "./Lineup";
import { Reveal } from "./Reveal";
import { SaleBadge } from "./SaleBadge";
import { TicketButton } from "./TicketButton";

const event = EVENTS.find((e) => e.id === SPOTLIGHT_ID);

/** Próximo evento em destaque, logo abaixo do Hero: cartaz, data, local, contagem, open bar, line-up e ingressos. */
export function EventSpotlight() {
  if (!event) return null;
  const date = eventDate(event);
  const place = [event.venue, event.city].filter(Boolean).join(", ");

  return (
    <section
      id="eventos"
      className="relative overflow-clip bg-[linear-gradient(to_bottom,#07232c,#0a4458_55%,#0b3341)] px-5 py-20 md:px-8 md:py-28"
    >
      {/* raios de sol atrás do cartaz */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-20%] top-1/2 size-[1400px] -translate-y-1/2 bg-[repeating-conic-gradient(from_0deg,rgba(255,194,26,0.1)_0_5deg,transparent_5deg_10deg)] [mask-image:radial-gradient(circle,#000_8%,transparent_62%)] lg:left-[-8%]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,430px)_1fr] lg:gap-16">
        <Reveal>
          <motion.figure
            className="relative mx-auto w-full max-w-[400px] lg:max-w-none"
            initial={{ rotate: -2.5 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div aria-hidden="true" className="absolute -inset-4 rounded-[36px] bg-[linear-gradient(135deg,#f0286e,#ff6a2b,#ffc21a)] opacity-70 blur-2xl" />
            <img
              src={event.flyer}
              alt="Cartaz da festa de 7 anos do Sun, Bar & Love, dia 7 de novembro, com o line-up completo"
              width={900}
              height={1600}
              className="relative aspect-[9/16] w-full rounded-card object-cover shadow-[0_40px_90px_-30px_rgba(4,23,30,0.95)] ring-4 ring-cream"
            />
          </motion.figure>
        </Reveal>

        <div className="grid gap-7">
          <Reveal>
            <p className="inline-flex rounded-full border border-sun/60 bg-night/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sun">
              Próximo evento · aniversário de 7 anos
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.5rem,5.6vw,4.6rem)] uppercase leading-[0.92] tracking-tight">
              <span className="block text-[0.34em] tracking-[0.14em] text-flame">{date.weekday}</span>
              {date.day}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="grid gap-3 text-lg text-cream/90">
              <li className="flex items-center gap-3">
                <MapPin size={24} className="shrink-0 text-sun" /> {place}
              </li>
              <li className="flex items-center gap-3">
                <Clock size={24} className="shrink-0 text-sun" /> {event.time ? `A partir das ${event.time}` : "Horário em breve"}
              </li>
            </ul>
          </Reveal>

          {event.startsAt && (
            <Reveal delay={0.12}>
              <Countdown startsAt={event.startsAt} />
            </Reveal>
          )}

          {event.perk && (
            <Reveal delay={0.16}>
              <div className="rounded-card bg-[linear-gradient(120deg,#f0286e,#ff6a2b_65%,#ffc21a)] p-6 text-deep md:p-7">
                <h3 className="font-display text-2xl uppercase leading-tight md:text-3xl">{event.perk.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {event.perk.items.map((item) => (
                    <li key={item} className="rounded-full bg-deep px-4 py-1.5 text-sm font-semibold text-cream">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.2}>
            <Lineup groups={event.lineup} large />
          </Reveal>

          <Reveal delay={0.24}>
            <div className="flex flex-wrap items-center gap-3">
              <TicketButton event={event} location="destaque" />
              <Button variant="ghost" href="#mapa" icon={<MapTrifold size={18} />}>
                Mapa do evento
              </Button>
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
            <div className="mt-4">
              <SaleBadge sale={event.sale} />
            </div>
            {event.supporters && (
              <p className="mt-6 text-sm uppercase tracking-[0.16em] text-cream/65">
                Apoio: <span className="font-semibold text-cream/90">{event.supporters.join(" · ")}</span>
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
