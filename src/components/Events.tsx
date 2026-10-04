import { useCallback, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, CalendarBlank, Check, Clock, MapPin, ShareNetwork, Ticket, WhatsappLogo } from "@phosphor-icons/react";
import { EVENTS, SITE, type SbEvent } from "../content";
import { eventDate, mapsLink, ticketLink, whatsappLink } from "../lib";
import { Button } from "./Button";
import { Countdown } from "./Countdown";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";

type Tab = "upcoming" | "past";
const TABS: { id: Tab; label: string }[] = [
  { id: "upcoming", label: "Próximos" },
  { id: "past", label: "Já rolou" },
];

/** Cartaz com inclinação 3D que segue o cursor. */
function TiltFlyer({ event, onOpen, priority }: { event: SbEvent; onOpen: () => void; priority?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-label={`Ver detalhes: ${event.title} no ${event.venue}`}
      className="group block w-full cursor-pointer rounded-card text-left [perspective:900px]"
      style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: "preserve-3d" }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.img
        layoutId={`flyer-${event.id}`}
        src={event.flyer}
        alt={`Cartaz: ${event.title}, ${event.venue}`}
        loading={priority ? "eager" : "lazy"}
        className="aspect-[6/7] w-full rounded-card object-cover shadow-[0_30px_70px_-25px_rgba(240,40,110,0.55)] ring-1 ring-cream/20"
      />
    </motion.button>
  );
}

function UpcomingFeature({ event, onOpen }: { event: SbEvent; onOpen: (e: SbEvent) => void }) {
  const date = eventDate(event);
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16">
      <TiltFlyer event={event} onOpen={() => onOpen(event)} priority />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">{date.weekday}</p>
        <h3 className="mt-2 font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[0.95] tracking-tight text-balance">
          {date.day}
        </h3>
        <ul className="mt-6 grid gap-3 text-cream/90">
          <li className="flex items-center gap-3">
            <Clock size={22} className="text-sun" /> Abertura às {event.time}
          </li>
          <li className="flex items-center gap-3">
            <MapPin size={22} className="text-sun" />
            <span>
              {event.venue}, {event.city}
            </span>
          </li>
        </ul>
        {event.startsAt && (
          <div className="mt-8">
            <Countdown startsAt={event.startsAt} />
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={ticketLink(event)} external icon={<Ticket size={20} weight="fill" />}>
            Ingressos
          </Button>
          <Button variant="ghost" onClick={() => onOpen(event)} icon={<ArrowUpRight size={18} />}>
            Detalhes
          </Button>
        </div>
      </div>
    </div>
  );
}

function PastCard({ event, onOpen }: { event: SbEvent; onOpen: (e: SbEvent) => void }) {
  const date = eventDate(event);
  return (
    <div>
      <TiltFlyer event={event} onOpen={() => onOpen(event)} />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl uppercase leading-tight">{event.title === SITE.name ? event.venue : event.title}</h3>
          <p className="mt-1 text-cream/75">{date.day}</p>
        </div>
        {event.soldOut && (
          <span className="shrink-0 rounded-full bg-rose px-3 py-1 text-xs font-bold uppercase tracking-wider text-cream">
            Esgotado
          </span>
        )}
      </div>
    </div>
  );
}

function EventModalBody({ event, onClose }: { event: SbEvent; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const date = eventDate(event);
  const upcoming = event.status === "upcoming";

  const share = async () => {
    const data = { title: event.title, text: `${event.title} no ${event.venue}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* usuário cancelou */
    }
  };

  return (
    <div className="grid md:grid-cols-[minmax(0,380px)_1fr]">
      <motion.img
        layoutId={`flyer-${event.id}`}
        src={event.flyer}
        alt={`Cartaz: ${event.title}, ${event.venue}`}
        className="aspect-[6/7] w-full object-cover md:aspect-auto md:h-full"
      />
      <div className="flex flex-col justify-center gap-6 p-6 md:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">
            {upcoming ? "Próximo evento" : event.soldOut ? "Ingressos esgotados" : "Edição encerrada"}
          </p>
          <h3 className="mt-2 font-display text-4xl uppercase leading-[0.98] tracking-tight md:text-5xl">
            {event.title}
          </h3>
        </div>

        <p className="max-w-prose leading-relaxed text-cream/85">{event.blurb}</p>

        <ul className="grid gap-3">
          <li className="flex items-start gap-3">
            <CalendarBlank size={22} className="mt-0.5 shrink-0 text-sun" />
            <span>
              {date.weekday ? `${date.weekday}, ` : ""}
              {date.day}
              {event.time ? `, ${event.time}` : ""}
            </span>
          </li>
          {(event.venue || event.city) && (
            <li className="flex items-start gap-3">
              <MapPin size={22} className="mt-0.5 shrink-0 text-sun" />
              <span>{[event.venue, event.address, event.city].filter(Boolean).join(". ")}</span>
            </li>
          )}
        </ul>

        {upcoming && event.startsAt && <Countdown startsAt={event.startsAt} />}

        <div className="flex flex-wrap gap-3">
          {upcoming ? (
            <>
              <Button href={ticketLink(event)} external icon={<Ticket size={20} weight="fill" />}>
                Ingressos
              </Button>
              <Button variant="ghost" href={mapsLink(event)} external icon={<MapPin size={18} />}>
                Como chegar
              </Button>
              <Button variant="ghost" onClick={share} icon={copied ? <Check size={18} /> : <ShareNetwork size={18} />}>
                {copied ? "Link copiado" : "Compartilhar"}
              </Button>
            </>
          ) : (
            <>
              <Button href="#videos" onClick={onClose} icon={<ArrowUpRight size={18} />}>
                Ver vídeos
              </Button>
              <Button
                variant="ghost"
                href={whatsappLink("Oi! Quero saber da próxima edição do Sun, Bar & Love.")}
                external
                icon={<WhatsappLogo size={18} />}
              >
                Próxima edição
              </Button>
            </>
          )}
        </div>
        {!upcoming && (
          <button type="button" onClick={onClose} className="self-start text-sm text-cream/60 underline-offset-4 hover:underline">
            Voltar aos eventos
          </button>
        )}
      </div>
    </div>
  );
}

export function Events() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [selected, setSelected] = useState<SbEvent | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const upcoming = EVENTS.filter((e) => e.status === "upcoming");
  const past = EVENTS.filter((e) => e.status === "past");

  return (
    <section id="eventos" className="relative overflow-clip bg-[linear-gradient(to_bottom,#07232c,#0b3341_60%,#07232c)] px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Marca na <span className="text-rose">agenda</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div role="tablist" aria-label="Eventos" className="inline-flex rounded-full border border-cream/20 bg-deep/50 p-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className="relative h-11 rounded-full px-6 text-[15px] font-semibold"
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="events-tab"
                    className="absolute inset-0 rounded-full bg-sun"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative transition-colors ${tab === t.id ? "text-deep" : "text-cream/80"}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <LayoutGroup>
          <div className="mt-12" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            <AnimatePresence mode="wait" initial={false}>
              {tab === "upcoming" ? (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="grid gap-16"
                >
                  {upcoming.map((e) => (
                    <UpcomingFeature key={e.id} event={e} onOpen={setSelected} />
                  ))}

                  <div className="relative overflow-hidden rounded-card bg-[linear-gradient(120deg,#f0286e,#ff6a2b_60%,#ffc21a)] p-8 text-deep md:p-12">
                    <h3 className="max-w-md font-display text-3xl uppercase leading-tight md:text-4xl">
                      Novas datas saem em breve
                    </h3>
                    <p className="mt-3 max-w-md text-deep/85">Chama no WhatsApp e seja o primeiro a saber.</p>
                    <div className="mt-6">
                      <a
                        href={whatsappLink("Oi! Quero ser avisado das próximas edições do Sun, Bar & Love.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-deep px-6 font-semibold text-cream transition hover:bg-night active:scale-[0.97]"
                      >
                        <WhatsappLogo size={20} weight="fill" /> Chamar no WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="past"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="grid gap-10 sm:grid-cols-2 md:max-w-3xl"
                >
                  {past.map((e) => (
                    <PastCard key={e.id} event={e} onOpen={setSelected} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Modal open={!!selected} onClose={close} label={selected ? `${selected.title} no ${selected.venue}` : "Evento"}>
            {selected && <EventModalBody event={selected} onClose={close} />}
          </Modal>
        </LayoutGroup>
      </div>
    </section>
  );
}
