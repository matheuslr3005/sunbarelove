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
 * Dica para trocar: mp4 H.264 (e, se puder, um webm VP9 mais leve) em public/media/videos/, sem som, de 5 a 15 segundos.
 */
/** Arquivos de um mesmo vídeo: o webm (VP9) é mais leve e vai primeiro; o mp4 (H.264) serve o Safari e o iPhone. */
export interface VideoFiles {
  mp4: string;
  webm?: string;
}

export interface BgVideo extends VideoFiles {
  poster?: string;
  /** Versão vertical para celular (telas até 767 px). Sem ela, o celular usa o vídeo principal. */
  mobile?: VideoFiles;
  mobilePoster?: string;
}

export const BG_VIDEOS: Partial<Record<"hero" | "finale" | "videos", BgVideo>> = {
  hero: {
    // Takes de drone em 4K: 1920x1080 no computador e 900x1600 no celular, com nitidez e cor reforçadas.
    mp4: asset("media/videos/hero-fpv.mp4"),
    webm: asset("media/videos/hero-fpv.webm"),
    poster: asset("media/hero-poster.webp"),
    mobile: {
      mp4: asset("media/videos/hero-fpv-vertical.mp4"),
      webm: asset("media/videos/hero-fpv-vertical.webm"),
    },
    mobilePoster: asset("media/hero-poster-vertical.webp"),
  },
  finale: {
    mp4: asset("media/videos/finale-fpv.mp4"),
    webm: asset("media/videos/finale-fpv.webm"),
    poster: asset("media/finale-poster.webp"),
  },
  videos: { mp4: asset("media/videos/fogos-fundo.mp4") },
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
  /** "bento": grade de 4 colunas e 2 linhas (4 fotos com className + o cartão de "mais fotos"). "masonry" aceita qualquer quantidade. */
  layout: "bento" | "masonry";
  photos: SbPhoto[];
}

// Só fotos de verdade (nada de quadros de vídeo). Com mais de uma galeria, as abas por edição aparecem.
// TODO: acrescentar as demais fotos (public/media/) e, depois, separar por edição.
export const GALLERIES: Gallery[] = [
  {
    id: "destaques",
    label: "Destaques",
    layout: "masonry",
    photos: [
      {
        id: "p-brinde",
        src: asset("media/foto-brinde.webp"),
        alt: "Grupo de amigos rindo e brindando com copos amarelos da festa",
        caption: "Brinde com os copos amarelos da festa.",
      },
      {
        id: "p-copos",
        src: asset("media/foto-copos.webp"),
        alt: "Dois copos azuis da festa brindando com respingo, com o pôr do sol ao fundo",
        caption: "Brinde com o pôr do sol ao fundo.",
      },
      {
        id: "p-bone-vermelho",
        src: asset("media/foto-bone-vermelho.webp"),
        alt: "Mulher sorrindo com o boné vermelho do Sun, Bar & Love sob luzes rosa",
        caption: "O boné vermelho da festa.",
      },
      {
        id: "p-pandeiro",
        src: asset("media/foto-pandeiro.webp"),
        alt: "Silhueta de músicos tocando pandeiro contra o sol dourado",
        caption: "Roda de pandeiro contra o sol.",
      },
      {
        id: "p-camiseta",
        src: asset("media/foto-camiseta-branca.webp"),
        alt: "Camiseta branca com a estampa do sol da festa pendurada na arara",
        caption: "Camiseta com a estampa do sol.",
      },
      {
        id: "p-mural",
        src: asset("media/foto-mural.webp"),
        alt: "Mulher segurando um copo diante do painel do sol com o nome da festa",
        caption: "Foto no painel do sol.",
      },
      {
        id: "p-bones",
        src: asset("media/foto-bones-mesa.webp"),
        alt: "Bonés azul-claro, azul-marinho e vermelho com o sol bordado sobre uma mesa laranja",
        caption: "Os bonés na mesa da loja.",
      },
      {
        id: "p-arara",
        src: asset("media/foto-arara.webp"),
        alt: "Arara ao ar livre com camisetas e jaqueta jeans da festa penduradas",
        caption: "A arara com as camisetas da festa.",
      },
    ],
  },
];

export type ShopColor = "azul" | "laranja" | "branco" | "preto";

/** Cor da peça e do fundo do card (o fundo muda junto com a cor escolhida). */
export const SHOP_COLORS: Record<ShopColor, { label: string; garment: string; backdrop: string }> = {
  azul: { label: "Azul", garment: "#19a7c9", backdrop: "#fff1d6" },
  laranja: { label: "Laranja", garment: "#ff6a2b", backdrop: "#0b3341" },
  branco: { label: "Branco", garment: "#fffaf0", backdrop: "#f0286e" },
  preto: { label: "Preto", garment: "#0b0f12", backdrop: "#ffc21a" },
};

export interface SbProduct {
  id: string;
  name: string;
  /** Preço para exibir, ex: "R$ 189". Vazio = não mostra preço. */
  price?: string;
  /** Link do produto na loja. Vazio = usa SHOP.url, e se esse também estiver vazio, abre o WhatsApp. */
  url?: string;
  kind: "hoodie" | "tshirt" | "glasses" | "cap";
  /** Cores disponíveis, na ordem em que aparecem. Com menos de duas, o seletor de cor não aparece. */
  colors: ShopColor[];
  /** Foto única do produto (public/media/), igual para qualquer cor. */
  photo?: string;
  /** Foto por cor. Sem foto, o card mostra um desenho da peça na cor escolhida. */
  images?: Partial<Record<ShopColor, string>>;
}

export const SHOP = {
  // TODO: link da loja da marca (Shopify, quando existir).
  url: "",
};

// TODO: trocar pelos produtos reais: preço, link e foto de cada peça e cor.
// As fotos de camiseta e boné são de exemplo (peças do evento) e podem se repetir na esteira.
// Moletom e óculos ainda não têm foto: o card mostra um desenho da peça nas cores da marca.
const ALL_COLORS: ShopColor[] = ["azul", "laranja", "branco", "preto"];
export const PRODUCTS: SbProduct[] = [
  {
    id: "camiseta",
    name: "Camiseta",
    kind: "tshirt",
    colors: ["branco", "preto"],
    images: {
      branco: asset("media/prod-camiseta-branca.webp"),
      preto: asset("media/prod-camiseta-preta.webp"),
    },
  },
  { id: "moletom", name: "Moletom", kind: "hoodie", colors: ALL_COLORS },
  { id: "bone-modelo", name: "Boné", kind: "cap", colors: [], photo: asset("media/prod-bone-modelo.webp") },
  { id: "oculos", name: "Óculos", kind: "glasses", colors: ALL_COLORS },
  { id: "bone-trio", name: "Boné", kind: "cap", colors: [], photo: asset("media/prod-bones.webp") },
];

export interface BandInfo {
  title: string;
  /** Imagem de capa horizontal (public/media/). Sem ela, usa a arte de nuvens da marca. */
  poster?: string;
  /** Vídeo da banda: arquivo mp4 horizontal em public/media/videos/ (ex: "/media/videos/banda.mp4")... */
  src?: string;
  /** ...ou ID de vídeo do YouTube. Sem nenhum dos dois, o vídeo mostra "em breve". */
  youtube?: string;
}

// TODO: gravar o vídeo da banda tocando (horizontal, 16:9), colocar em public/media/videos/ e preencher `src`.
export const BAND: BandInfo = {
  title: "Banda do Sun, Bar & Love ao vivo",
};

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
