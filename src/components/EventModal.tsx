import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarBlank, Check, MapPin, ShareNetwork, WhatsappLogo } from "@phosphor-icons/react";
import { track } from "../analytics";
import { type SbEvent } from "../content";
import { atVenue, eventDate, hasWhatsapp, mapsLink, whatsappLink } from "../lib";
import { Album } from "./Album";
import { Button } from "./Button";
import { Countdown } from "./Countdown";
import { Lineup } from "./Lineup";
import { SaleBadge } from "./SaleBadge";
import { TicketButton } from "./TicketButton";

export function FlyerButton({ event, onOpen, aspect = "aspect-[6/7]" }: { event: SbEvent; onOpen: () => void; aspect?: string }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ver detalhes: ${event.title}${atVenue(event)}`}
      className="group block w-full cursor-pointer rounded-card text-left"
    >
      <motion.img
        layoutId={`flyer-${event.id}`}
        src={event.flyer}
        alt={`Cartaz: ${event.title}${event.venue ? `, ${event.venue}` : ""}`}
        className={`${aspect} w-full rounded-card object-cover object-[50%_45%] shadow-[0_30px_70px_-25px_rgba(240,40,110,0.55)] ring-1 ring-cream/20 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1.5`}
      />
    </button>
  );
}

export function EventModalBody({ event, onClose }: { event: SbEvent; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const date = eventDate(event);
  const upcoming = event.status === "upcoming";

  const share = async () => {
    track("share_click", { event_id: event.id });
    const data = { title: event.title, text: `${event.title}${atVenue(event)}`, url: window.location.href };
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
        alt={`Cartaz: ${event.title}${event.venue ? `, ${event.venue}` : ""}`}
        className="aspect-[6/7] w-full object-cover max-md:aspect-auto max-md:h-[30dvh] max-md:object-[50%_42%] md:sticky md:top-0 md:aspect-auto md:h-auto md:max-h-[92dvh] md:self-start"
      />
      <div className="flex flex-col justify-center gap-6 p-6 md:p-10">
        <div className="max-md:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">
            {upcoming ? "Próximo evento" : event.sale.status === "soldout" ? "Ingressos esgotados" : "Edição encerrada"}
          </p>
          <h3 className="mt-2 font-display text-4xl uppercase leading-[0.98] tracking-tight md:text-5xl">
            {event.title}
          </h3>
        </div>

        <p className="max-w-prose leading-relaxed text-cream/85 max-md:order-3">{event.blurb}</p>

        <ul className="grid gap-3 max-md:order-4">
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

        {upcoming && (
          <div className="max-md:order-5">
            <SaleBadge sale={event.sale} />
          </div>
        )}
        <div className="max-md:order-5">
          <Lineup groups={event.lineup} />
        </div>
        {upcoming && event.startsAt && (
          <div className="max-md:order-5">
            <Countdown startsAt={event.startsAt} />
          </div>
        )}
        {!upcoming && (
          <div className="max-md:order-5">
            <Album event={event} />
          </div>
        )}

        <div className="flex flex-wrap gap-2 md:gap-3 max-md:order-2">
          {upcoming ? (
            <>
              <TicketButton event={event} location="modal" />
              {(event.venue || event.address) && (
                <Button
                  variant="ghost"
                  href={mapsLink(event)}
                  external
                  className="max-md:px-4"
                  icon={<MapPin size={18} />}
                  trackEvent={["maps_click", { event_id: event.id }]}
                >
                  Como chegar
                </Button>
              )}
              <Button variant="ghost" onClick={share} className="max-md:px-4" icon={copied ? <Check size={18} /> : <ShareNetwork size={18} />}>
                {copied ? "Link copiado" : "Compartilhar"}
              </Button>
            </>
          ) : (
            <>
              <Button href="#videos" onClick={onClose} icon={<ArrowUpRight size={18} />}>
                Ver vídeos
              </Button>
              {hasWhatsapp && (
                <Button
                  variant="ghost"
                  href={whatsappLink("Oi! Quero saber da próxima edição do Sun, Bar & Love.")}
                  external
                  icon={<WhatsappLogo size={18} />}
                  trackEvent={["whatsapp_click", { location: "evento_encerrado" }]}
                >
                  Próxima edição
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
