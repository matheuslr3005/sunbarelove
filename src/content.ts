/**
 * Todo o conteúdo editável do site mora aqui.
 * Troque textos, links, fotos e vídeos sem mexer nos componentes.
 */

export const SITE = {
  name: "Sun, Bar & Love",
  // WhatsApp que aparece nos cartazes: (51) 98206-0372
  whatsapp: "5551982060372",
  // TODO: coloque o link do perfil quando tiver, ex: "https://instagram.com/seuperfil"
  instagram: "",
};

export type EventStatus = "upcoming" | "past";

export interface SbEvent {
  id: string;
  status: EventStatus;
  title: string;
  /** Data completa com fuso, usada na contagem regressiva. */
  startsAt?: string;
  /** Texto de data para exibir quando não há startsAt. */
  dateLabel?: string;
  time?: string;
  venue: string;
  address?: string;
  city: string;
  flyer: string;
  blurb: string;
  /** Link da página de venda. Vazio = o botão cai no WhatsApp. TODO: preencher. */
  ticketUrl: string;
  soldOut?: boolean;
}

export const EVENTS: SbEvent[] = [
  {
    id: "cenna-10-out",
    status: "upcoming",
    title: "Sun, Bar & Love",
    startsAt: "2026-10-10T17:00:00-03:00",
    time: "17h",
    venue: "Cenna",
    address: "Rua João Moreira Maciel, 470, Beira do Guaíba",
    city: "Porto Alegre, RS",
    flyer: "/media/flyer-cenna.webp",
    blurb:
      "Sábado de sol, música boa e o pôr do sol na beira do Guaíba. Chama a galera e garante o seu ingresso.",
    ticketUrl: "",
  },
  {
    id: "quintal-13-set",
    status: "past",
    title: "Sun, Bar & Love",
    dateLabel: "13 de setembro",
    venue: "Quintal",
    city: "Porto Alegre, RS",
    flyer: "/media/flyer-quintal.webp",
    blurb: "Uma tarde de música, drinks e pôr do sol no Quintal.",
    ticketUrl: "",
  },
  {
    id: "rio-melhor-dia",
    status: "past",
    title: "Melhor Dia: From Rio",
    dateLabel: "Edição From Rio",
    venue: "",
    city: "",
    flyer: "/media/flyer-rio.webp",
    blurb: "A edição que esgotou os ingressos antes do grande dia.",
    ticketUrl: "",
    soldOut: true,
  },
];

export interface SbVideo {
  id: string;
  title: string;
  edition: string;
  poster: string;
  /** Arquivo .mp4 em /public/media/videos/ (ex: "/media/videos/quintal.mp4"). */
  src?: string;
  /** Alternativa: ID de vídeo do YouTube. */
  youtube?: string;
}

// TODO: adicionar `src` (mp4) ou `youtube` em cada vídeo. Sem isso o modal mostra "em breve".
export const VIDEOS: SbVideo[] = [
  {
    id: "v-quintal",
    title: "Tarde no Quintal",
    edition: "Quintal, 13 de setembro",
    poster: "/media/flyer-quintal.webp",
  },
  {
    id: "v-selfie",
    title: "Melhores momentos",
    edition: "Sun, Bar & Love",
    poster: "/media/foto-selfie.webp",
  },
  {
    id: "v-rio",
    title: "Melhor Dia: From Rio",
    edition: "Edição esgotada",
    poster: "/media/flyer-rio.webp",
  },
];

export interface SbPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  /** Posição da célula no bento (desktop). Formato CSS grid-area: linha/coluna/linha/coluna. */
  className: string;
  position?: string;
}

// Seis fotos = seis células. Se trocar a quantidade, ajuste o grid em Gallery.tsx.
export const PHOTOS: SbPhoto[] = [
  {
    id: "p-selfie",
    src: "/media/foto-selfie.webp",
    alt: "Duas amigas tirando selfie na pista, com o sol de palco ao fundo",
    caption: "Selfie na pista, com o sol de palco ao fundo.",
    className: "col-span-2 row-span-2 md:col-span-1 md:row-span-1 md:[grid-area:1/1/4/3]",
    position: "50% 30%",
  },
  {
    id: "p-risada",
    src: "/media/foto-risada.webp",
    alt: "Detalhe das duas amigas sorrindo durante a selfie",
    caption: "Sorriso de quem chegou cedo para ver o pôr do sol.",
    className: "col-span-2 md:col-span-1 md:[grid-area:4/1/5/3]",
  },
  {
    id: "p-quintal",
    src: "/media/flyer-quintal.webp",
    alt: "Cartaz da edição no Quintal, 13 de setembro",
    caption: "Cartaz da edição no Quintal.",
    className: "md:[grid-area:1/3/3/4]",
  },
  {
    id: "p-palco",
    src: "/media/foto-palco.webp",
    alt: "Detalhe do palco com um microfone gigante dentro de um sol",
    caption: "O microfone gigante dentro do sol, marca registrada do palco.",
    className: "md:[grid-area:1/4/4/5]",
  },
  {
    id: "p-rio",
    src: "/media/flyer-rio.webp",
    alt: "Cartaz da edição Melhor Dia: From Rio com ingressos esgotados",
    caption: "Cartaz da edição From Rio, com ingressos esgotados.",
    className: "md:[grid-area:3/3/5/4]",
  },
  {
    id: "p-cenna",
    src: "/media/flyer-cenna.webp",
    alt: "Cartaz da edição no Cenna, sábado 10 de outubro às 17h",
    caption: "Cartaz da próxima edição, no Cenna.",
    className: "md:[grid-area:4/4/5/5]",
    position: "50% 62%",
  },
];

export const SPONSORS = [
  "Aperol Spritz",
  "Bar Mate",
  "Belvedere",
  "Chandon",
  "FYS",
  "Don Julio",
  "Heineken",
  "Johnnie Walker",
  "Mamba Water",
  "Moët & Chandon",
  "Tanqueray",
  "Laghetto Hotel",
];
