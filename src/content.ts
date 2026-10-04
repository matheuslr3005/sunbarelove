import { asset } from "./asset";

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
  // TODO: ID do Google Analytics 4 (ex: "G-ABC123XYZ"). Vazio = os cliques só são enviados
  // ao dataLayer (útil se o Google Tag Manager for instalado depois).
  analyticsId: "",
};

export type EventStatus = "upcoming" | "past";

export interface Sale {
  /** "onsale" = à venda, "soldout" = esgotado, "closed" = edição encerrada. */
  status: "onsale" | "soldout" | "closed";
  /** Nome do lote atual, ex: "2º lote". Vazio = mostra só "Ingressos à venda". */
  lot?: string;
  /** Quando o lote vira (data com fuso). Se preenchido, aparece "Vira em ...". */
  lotEndsAt?: string;
}

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
  sale: Sale;
  /** Atrações. Vazio = o bloco não aparece. Ex: ["DJ Fulano", "Banda X"]. */
  lineup?: string[];
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
    flyer: asset("media/flyer-cenna.webp"),
    blurb:
      "Sábado de sol, música boa e o pôr do sol na beira do Guaíba. Chama a galera e garante o seu ingresso.",
    ticketUrl: "",
    // TODO: informar o lote atual e quando ele vira, ex: { status: "onsale", lot: "2º lote", lotEndsAt: "2026-10-09T12:00:00-03:00" }
    sale: { status: "onsale" },
    lineup: [],
  },
  {
    id: "quintal-13-set",
    status: "past",
    title: "Sun, Bar & Love",
    dateLabel: "13 de setembro",
    venue: "Quintal",
    city: "Porto Alegre, RS",
    flyer: asset("media/flyer-quintal.webp"),
    blurb: "Uma tarde de música, drinks e pôr do sol no Quintal.",
    ticketUrl: "",
    sale: { status: "closed" },
  },
  {
    id: "rio-melhor-dia",
    status: "past",
    title: "Melhor Dia: From Rio",
    dateLabel: "Edição From Rio",
    venue: "",
    city: "",
    flyer: asset("media/flyer-rio.webp"),
    blurb: "A edição que esgotou os ingressos antes do grande dia.",
    ticketUrl: "",
    sale: { status: "soldout" },
  },
];

/**
 * Vídeos de fundo (horizontais, sem som, em loop). Cada um é opcional.
 * Dica para trocar: mp4 H.264, até 1280x720, 5 a 15 segundos, até 4 MB, em public/media/videos/.
 */
export const BG_VIDEOS: Partial<Record<"hero" | "finale" | "videos", { src: string; poster?: string }>> = {
  hero: { src: asset("media/videos/hero.mp4"), poster: asset("media/hero-poster.webp") },
  finale: { src: asset("media/videos/finale.mp4"), poster: asset("media/finale-poster.webp") },
  videos: { src: asset("media/videos/fogos-fundo.mp4") },
};

export interface SbVideo {
  id: string;
  title: string;
  edition: string;
  poster: string;
  /** Vídeo completo: arquivo .mp4 em /public/media/videos/ (ex: asset("media/videos/quintal.mp4")). */
  src?: string;
  /** Alternativa: ID de vídeo do YouTube. */
  youtube?: string;
  /** Trecho curto, mudo e vertical que toca quando o mouse passa sobre o card. */
  preview?: string;
}

// Cortes verticais (9:16) dos takes de drone. `src` abre no modal; `preview` toca no card ao passar o mouse.
// TODO: confirmar a edição de cada vídeo e trocar o campo `edition`.
export const VIDEOS: SbVideo[] = [
  {
    id: "v-pista-palco",
    title: "Pista e palco no pôr do sol",
    edition: "Sun, Bar & Love",
    poster: asset("media/poster-pista-palco.webp"),
    src: asset("media/videos/pista-palco.mp4"),
    preview: asset("media/videos/pista-palco.mp4"),
  },
  {
    id: "v-chegada",
    title: "Da entrada ao pôr do sol",
    edition: "Sun, Bar & Love",
    poster: asset("media/poster-chegada.webp"),
    src: asset("media/videos/chegada.mp4"),
    preview: asset("media/videos/chegada.mp4"),
  },
  {
    id: "v-fogos",
    title: "Fogos para fechar",
    edition: "Sun, Bar & Love",
    poster: asset("media/poster-fogos.webp"),
    src: asset("media/videos/fogos.mp4"),
    preview: asset("media/videos/fogos.mp4"),
  },
];

export interface SbPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  /** Posição da célula no bento (desktop). Formato CSS grid-area: linha/coluna/linha/coluna. */
  className?: string;
  position?: string;
}

export interface Gallery {
  id: string;
  label: string;
  /** "bento" exige exatamente 6 fotos com className. "masonry" aceita qualquer quantidade. */
  layout: "bento" | "masonry";
  photos: SbPhoto[];
}

// TODO: conferir a edição de cada foto e acrescentar mais (public/media/).
// As fotos de drone vêm de quadros dos vídeos, então são menores que fotos originais.
export const GALLERIES: Gallery[] = [
  {
    id: "destaques",
    label: "Destaques",
    layout: "bento",
    photos: [
      {
        id: "p-selfie",
        src: asset("media/foto-selfie.webp"),
        alt: "Duas amigas tirando selfie na pista, com o sol de palco ao fundo",
        caption: "Selfie na pista, com o sol de palco ao fundo.",
        className: "order-1 col-span-2 row-span-2 md:order-none md:col-span-1 md:row-span-1 md:[grid-area:1/1/4/3]",
        position: "50% 30%",
      },
      {
        id: "p-risada",
        src: asset("media/foto-risada.webp"),
        alt: "Detalhe das duas amigas sorrindo durante a selfie",
        caption: "Sorriso de quem chegou cedo para ver o pôr do sol.",
        className: "order-6 col-span-2 md:order-none md:col-span-1 md:[grid-area:4/1/5/3]",
      },
      {
        id: "p-arco",
        src: asset("media/foto-arco.webp"),
        alt: "Público chegando pela entrada com o letreiro Sun, Bar & Love ao pôr do sol",
        caption: "A chegada pelo letreiro, com o céu já alaranjado.",
        className: "order-2 md:order-none md:[grid-area:1/3/3/4]",
      },
      {
        id: "p-palco",
        src: asset("media/foto-palco.webp"),
        alt: "Detalhe do palco com um microfone gigante dentro de um sol",
        caption: "O microfone gigante dentro do sol, marca registrada do palco.",
        className: "order-4 md:order-none md:[grid-area:1/4/4/5]",
      },
      {
        id: "p-cantor",
        src: asset("media/foto-cantor.webp"),
        alt: "Cantor no palco cercado pela banda, com o painel colorido de olhos e luas",
        caption: "O palco em plena tarde, com o painel de olhos e luas.",
        className: "order-3 md:order-none md:[grid-area:3/3/5/4]",
      },
      {
        id: "p-sol",
        src: asset("media/foto-sol.webp"),
        alt: "Sol de palco aceso na beira do Guaíba com o sol de verdade se pondo ao fundo",
        caption: "O sol de palco aceso, com o sol de verdade se pondo atrás.",
        className: "order-5 md:order-none md:[grid-area:4/4/5/5]",
        position: "50% 50%",
      },
    ],
  },
  {
    id: "quintal",
    label: "Quintal",
    layout: "masonry",
    photos: [
      {
        id: "q-flyer",
        src: asset("media/flyer-quintal.webp"),
        alt: "Cartaz da edição no Quintal, 13 de setembro",
        caption: "Cartaz da edição no Quintal.",
      },
      {
        id: "q-selfie",
        src: asset("media/foto-quintal-selfie.webp"),
        alt: "Amigas fazendo selfie com o pôr do sol atrás, no Quintal",
        caption: "Selfie com o pôr do sol, no Quintal.",
      },
      {
        id: "q-palco",
        src: asset("media/foto-palco-amplo.webp"),
        alt: "Pista lotada diante do palco, com o pôr do sol atrás da cúpula",
        caption: "Pista lotada diante do palco, com o pôr do sol atrás da cúpula.",
      },
      {
        id: "q-tendas",
        src: asset("media/foto-tendas.webp"),
        alt: "Tendas e pista vistas de cima, com o sol baixo sobre o Guaíba",
        caption: "As tendas vistas de cima, com o sol baixo sobre o Guaíba.",
      },
    ],
  },
  {
    id: "rio",
    label: "From Rio",
    layout: "masonry",
    photos: [
      {
        id: "r-flyer",
        src: asset("media/flyer-rio.webp"),
        alt: "Cartaz da edição Melhor Dia: From Rio com ingressos esgotados",
        caption: "Cartaz da edição From Rio, com ingressos esgotados.",
      },
    ],
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

export interface Stat {
  value: number;
  /** Exibido antes do número, ex: "+". */
  prefix?: string;
  label: string;
  /** Texto para quando o valor é 1. */
  labelOne?: string;
}

// PLACEHOLDER: o primeiro número é um valor de exemplo. Troque pelo público real antes de divulgar.
// Os outros dois vêm dos próprios dados do site (edição esgotada e marcas parceiras).
export const STATS: Stat[] = [
  { value: 2500, prefix: "+", label: "pessoas nas últimas edições" },
  {
    value: EVENTS.filter((e) => e.sale.status === "soldout").length,
    label: "edições com ingressos esgotados",
    labelOne: "edição com ingressos esgotados",
  },
  { value: SPONSORS.length, label: "marcas parceiras" },
];

// TODO: revisar as respostas com a equipe (regras de idade e entrada, política de lotes).
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Onde compro os ingressos?",
    a: "Pelo botão Ingressos, que leva à página de venda da edição. Cada edição tem lotes, então vale garantir cedo.",
  },
  {
    q: "A que horas começa?",
    a: "A edição do Cenna abre às 17h, para você pegar o pôr do sol com a pista cheia.",
  },
  {
    q: "Onde fica o Cenna?",
    a: "Na Rua João Moreira Maciel, 470, Beira do Guaíba, em Porto Alegre. No detalhe do evento, o botão Como chegar abre a rota no Google Maps.",
  },
  {
    q: "O lote acabou. E agora?",
    a: "Chame no WhatsApp para saber se vai abrir um novo lote ou a próxima virada.",
  },
  {
    q: "Qual a idade mínima e o que levar na entrada?",
    a: "A regra de idade e de documentos é definida por edição. Confirme pelo WhatsApp antes de ir.",
  },
];
