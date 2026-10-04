import { Ticket } from "@phosphor-icons/react";
import { track } from "../analytics";
import type { SbEvent } from "../content";
import { ticketLink } from "../lib";

interface Props {
  event: SbEvent;
  /** De onde veio o clique, para o rastreamento: hero, nav, flutuante, evento, modal, final. */
  location: string;
  size?: "md" | "sm";
  className?: string;
}

/** Botão único de ingressos: rastreia o clique e vira "Esgotado" quando não há vendas. */
export function TicketButton({ event, location, size = "md", className = "" }: Props) {
  const sizing = size === "sm" ? "h-10 px-5 text-sm" : "h-12 px-6 text-[15px]";
  const base = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold ${sizing} ${className}`;

  if (event.sale.status !== "onsale") {
    return (
      <span aria-disabled="true" className={`${base} cursor-not-allowed border border-cream/25 text-cream/60`}>
        {event.sale.status === "soldout" ? "Esgotado" : "Encerrado"}
      </span>
    );
  }

  return (
    <a
      href={ticketLink(event, location)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        track("ticket_click", {
          location,
          event_id: event.id,
          destination: event.ticketUrl ? "ingressos" : "whatsapp",
          lot: event.sale.lot,
        })
      }
      className={`${base} bg-sun text-deep shadow-[0_12px_32px_-12px_rgba(255,106,43,0.9)] transition-[background-color,box-shadow,transform] duration-300 ease-out-expo hover:bg-[#ffd24d] hover:shadow-[0_16px_40px_-10px_rgba(240,40,110,0.8)] active:scale-[0.97]`}
    >
      <Ticket size={size === "sm" ? 18 : 20} weight="fill" />
      Ingressos
    </a>
  );
}
