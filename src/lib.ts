import { SITE, type SbEvent } from "./content";

/** Polígono de estrela (raios pontudos) para usar em clip-path. */
export function starClip(rays: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < rays * 2; i++) {
    const angle = (i * Math.PI) / rays - Math.PI / 2;
    const r = i % 2 === 0 ? 50 : inner;
    pts.push(`${(50 + r * Math.cos(angle)).toFixed(2)}% ${(50 + r * Math.sin(angle)).toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")})`;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Link de ingressos do evento, ou WhatsApp como alternativa enquanto não houver link.
 * Na página de venda, acrescenta UTMs para a plataforma de vendas saber de qual botão veio a compra.
 */
export function ticketLink(event: SbEvent, location = "site"): string {
  if (!event.ticketUrl) return whatsappLink(`Oi! Quero ingressos para o ${event.title} no ${event.venue}.`);
  try {
    const url = new URL(event.ticketUrl);
    url.searchParams.set("utm_source", "site");
    url.searchParams.set("utm_medium", "botao");
    url.searchParams.set("utm_campaign", event.id);
    url.searchParams.set("utm_content", location);
    return url.toString();
  } catch {
    return event.ticketUrl;
  }
}

export function mapsLink(event: SbEvent): string {
  const q = [event.venue, event.address, event.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

const dayFmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: "America/Sao_Paulo" });
const weekdayFmt = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "America/Sao_Paulo" });

export function eventDate(event: SbEvent): { weekday?: string; day: string } {
  if (event.startsAt) {
    const d = new Date(event.startsAt);
    const weekday = weekdayFmt.format(d);
    return { weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1), day: dayFmt.format(d) };
  }
  return { day: event.dateLabel ?? "" };
}
