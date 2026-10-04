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
    flyer: "/media/flyer-cenna.webp",
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
    flyer: "/media/flyer-quintal.webp",
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
    flyer: "/media/flyer-rio.webp",
    blurb: "A edição que esgotou os ingressos antes do grande dia.",
    ticketUrl: "",
    sale: { status: "soldout" },
  },
];

/**
 * Vídeo de fundo do hero (horizontal, 8 a 15 segundos, sem som, em loop).
 * TODO: gravar/escolher o vídeo, salvar em public/media/videos/ e preencher.
 * Dica: mp4 H.264, 1280x720, até 4 MB.
 */
export const HERO_VIDEO: { src: string; poster?: string } | undefined = undefined;

export interface SbVideo {
  id: string;
  title: string;
  edition: string;
  poster: string;
  /** Vídeo completo: arquivo .mp4 em /public/media/videos/ (ex: "/media/videos/quintal.mp4"). */
  src?: string;
  /** Alternativa: ID de vídeo do YouTube. */
  youtube?: string;
  /** Trecho curto, mudo e vertical que toca quando o mouse passa sobre o card. */
  preview?: string;
}

// TODO: adicionar `src` (mp4) ou `youtube` em cada vídeo, e `preview` para o trecho do card.
// Sem `src`/`youtube` o modal mostra "Vídeo em breve".
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

// TODO: trocar por fotos reais de cada edição (public/media/) e acrescentar mais.
export const GALLERIES: Gallery[] = [
  {
    id: "destaques",
    label: "Destaques",
    layout: "bento",
    photos: [
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
    ],
  },
  {
    id: "quintal",
    label: "Quintal",
    layout: "masonry",
    photos: [
      {
        id: "q-flyer",
        src: "/media/flyer-quintal.webp",
        alt: "Cartaz da edição no Quintal, 13 de setembro",
        caption: "Cartaz da edição no Quintal.",
      },
      {
        id: "q-selfie",
        src: "/media/foto-quintal-selfie.webp",
        alt: "Amigas fazendo selfie com o pôr do sol atrás, no Quintal",
        caption: "Selfie com o pôr do sol, no Quintal.",
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
        src: "/media/flyer-rio.webp",
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
