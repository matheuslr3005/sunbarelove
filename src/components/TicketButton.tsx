import { Ticket } from "@phosphor-icons/react";
import { track } from "../analytics";
import type { SbEvent } from "../content";
import { ticketLink } from "../lib";

interface Props {
  event: SbEvent;
  /** De onde veio o clique, para o rastreamento: hero, nav, flutuante, evento, modal, final. */
  location: string;
  size?: "md" | "sm";
  /** "light" = botão branco, para destacar sobre imagens e o sol. */
  tone?: "sun" | "light";
  className?: string;
}

/** Botão único de ingressos: rastreia o clique e vira "Esgotado" quando não há vendas. */
export function TicketButton({ event, location, size = "md", tone = "sun", className = "" }: Props) {
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
      className={`${base} text-deep transition-[background-color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.97] ${
        tone === "light"
          ? "bg-paper shadow-[0_14px_36px_-10px_rgba(4,23,30,0.7)] hover:bg-white hover:shadow-[0_18px_44px_-10px_rgba(4,23,30,0.85)]"
          : "bg-sun shadow-[0_12px_32px_-12px_rgba(255,106,43,0.9)] hover:bg-[#ffd24d] hover:shadow-[0_16px_40px_-10px_rgba(240,40,110,0.8)]"
      }`}
    >
      <Ticket size={size === "sm" ? 18 : 20} weight="fill" />
      Ingressos
    </a>
  );
}
