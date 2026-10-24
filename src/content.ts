import { asset } from "./asset";
import { CENNA_10_OUT_THUMBS, FROM_RIO_THUMBS, MADE_IN_BRASIL_THUMBS, QUINTAL_17_MAI_THUMBS, QUINTAL_20_SET_THUMBS, QUINTAL_29_MAR_THUMBS } from "./albumData";

/**
 * Todo o conteúdo editável do site mora aqui.
 * Troque textos, links, fotos e vídeos sem mexer nos componentes.
 */

export const SITE = {
  name: "Sun, Bar & Love",
  // TODO: número do WhatsApp com DDI e DDD, só dígitos, ex: "5551999999999". Enquanto estiver vazio,
  // todos os botões e links de WhatsApp somem do site e "Ingressos"/"Comprar" ficam como "em breve" até haver link de venda.
  whatsapp: "",
  // TODO: coloque o link do perfil quando tiver, ex: "https://instagram.com/seuperfil"
  instagram: "",
  // TODO: ID do Google Analytics 4 (ex: "G-ABC123XYZ"). Vazio = os cliques só são enviados
  // ao dataLayer (útil se o Google Tag Manager for instalado depois).
  analyticsId: "",
  // Quem produz o site/festa, citado no rodapé ("Produzido por Lax").
  // Link do Instagram do Lax. Vazio = o nome aparece sem link.
  producer: { name: "Lax", instagram: "https://www.instagram.com/laxassessoria/" },
};

export type EventStatus = "upcoming" | "past";

export interface Sale {
  /** "soon" = ingressos ainda não abriram, "onsale" = à venda, "soldout" = esgotado, "closed" = edição encerrada. */
  status: "soon" | "onsale" | "soldout" | "closed";
  /** Nome do lote atual, ex: "2º lote". Vazio = mostra só "Ingressos à venda". */
  lot?: string;
  /** Quando o lote vira (data com fuso). Se preenchido, aparece "Vira em ...". */
  lotEndsAt?: string;
}

/** Foto de álbum de uma edição que já rolou: abre e baixa em alta qualidade. */
export interface AlbumPhoto {
  id: string;
  /** Imagem leve para a grade. */
  thumb: string;
  /** Arquivo para ver e baixar (maior). */
  src: string;
  width: number;
  height: number;
}

/** Um bloco do line-up: um rótulo opcional (ex: "DJ Set Rayo") e os nomes. */
export interface LineupGroup {
  label?: string;
  names: string[];
}

export interface SbEvent {
  id: string;
  status: EventStatus;
  title: string;
  /** Data completa com fuso, usada na contagem regressiva. */
  startsAt?: string;
  /** Texto de data para exibir quando não há startsAt. */
  dateLabel?: string;
  /** true = aparece como cartão pequeno no bloco "Novas datas saem em breve" (save the date), em vez de destaque grande. */
  saveTheDate?: boolean;
  /** Linha pequena acima da data quando não há startsAt (no lugar do dia da semana), ex: "Sábado" ou "Carnaval". */
  kicker?: string;
  time?: string;
  /** Pode ficar vazio enquanto o local não for divulgado. */
  venue: string;
  address?: string;
  city: string;
  flyer: string;
  blurb: string;
  /** Link da página de venda. Vazio = o botão cai no WhatsApp (ou fica "Ingressos em breve" se também não houver WhatsApp). TODO: preencher. */
  ticketUrl: string;
  sale: Sale;
  /** Atrações em blocos. Vazio = o bloco não aparece. Ex: [{ label: "DJ Set", names: ["Fulano"] }]. */
  lineup?: LineupGroup[];
  /** Destaque de bebida/benefício, ex: open bar com horário e o que está incluso. */
  perk?: { title: string; items: string[] };
  /** Marcas de apoio da edição. */
  supporters?: string[];
  /** Só em edições que já rolaram: fotos do álbum (salve em public/media/albuns/<id-do-evento>/). Vazio = "Fotos em breve". */
  album?: AlbumPhoto[];
  /** Link para baixar o álbum inteiro (zip ou pasta compartilhada). Vazio = o botão não aparece. */
  albumUrl?: string;
  /** Quantas fotos existem no total na pasta do Drive. Se for maior que `album.length`, o álbum mostra um botão para ver o resto no Drive. */
  albumTotal?: number;
}

export const EVENTS: SbEvent[] = [
  {
    id: "aniversario-7-anos",
    status: "upcoming",
    title: "7 anos de Sun, Bar & Love",
    // O open bar começa às 15h; usamos esse horário como abertura. TODO: confirmar a abertura dos portões.
    startsAt: "2026-11-07T15:00:00-03:00",
    time: "15h",
    venue: "Quintal Lounge",
    // TODO: informar o endereço do Quintal Lounge.
    city: "Porto Alegre, RS",
    flyer: asset("media/flyer-7anos-oficial.webp"),
    blurb:
      "A festa de aniversário do Sun, Bar & Love: sete anos de pôr do sol, música boa e gente que a gente ama, com open bar, banda, DJs e palco 360.",
    ticketUrl: "https://www.bilheteriadigital.com/sun-bar-e-love-7-anos-07-de-novembro",
    // TODO: informar o lote atual e quando ele vira, ex: { status: "onsale", lot: "1º lote", lotEndsAt: "2026-11-05T12:00:00-03:00" }
    sale: { status: "onsale" },
    lineup: [
      { label: "Nasty by ATO", names: ["DJ Kessel"] },
      { label: "Banda Sun, Bar & Love, com participações", names: ["Sambary", "Jader Lewis", "Denilson", "Júnior Paixão"] },
      { names: ["Millbeatz", "Saulit"] },
      { label: "BDS Crew", names: ["Pava", "Santos", "Class"] },
      { label: "DJ Set Rayo", names: ["Gabriel R", "Nicky", "Thalles"] },
    ],
    perk: {
      title: "Open bar das 15h às 16h30",
      items: ["Cerveja Sol", "Caipa da Sun", "Drinks de vodka e gin", "Welcome shot de bananinha"],
    },
    supporters: ["Meep", "BDS", "ATO", "Rayo"],
  },
  {
    id: "deck22-9-jan",
    status: "upcoming",
    saveTheDate: true,
    title: "Sun, Bar & Love no Deck 22",
    dateLabel: "9 de janeiro",
    kicker: "Sábado",
    venue: "Deck 22",
    city: "Atlântida, RS",
    flyer: asset("media/flyer-deck22.webp"),
    blurb: "Save the date! O Sun, Bar & Love vai ao Deck 22, em Atlântida, no litoral gaúcho. Horário e ingressos saem em breve.",
    ticketUrl: "",
    // TODO: quando abrir a venda, troque para { status: "onsale", lot: "1º lote" } e preencha ticketUrl, time e endereço.
    sale: { status: "soon" },
  },
  {
    id: "deck22-7-fev",
    status: "upcoming",
    saveTheDate: true,
    title: "Sun, Bar & Love no Deck 22",
    dateLabel: "7 de fevereiro",
    kicker: "Carnaval",
    venue: "Deck 22",
    city: "Atlântida, RS",
    flyer: asset("media/flyer-deck22.webp"),
    blurb: "Save the date! O Sun, Bar & Love vai ao Deck 22, em Atlântida, no Carnaval. Horário e ingressos saem em breve.",
    ticketUrl: "",
    sale: { status: "soon" },
  },
  {
    id: "cenna-10-out",
    status: "past",
    title: "33º Sun, Bar & Love",
    dateLabel: "10 de outubro",
    venue: "Cenna",
    city: "Porto Alegre, RS",
    flyer: asset("media/flyer-cenna.webp"),
    blurb: "Um sábado de sol, música boa e pôr do sol na beira do Guaíba, no Cenna.",
    ticketUrl: "",
    sale: { status: "closed" },
    album: CENNA_10_OUT_THUMBS.map(([width, height], i) => {
      const n = String(i + 1).padStart(3, "0");
      return {
        id: `cenna-${n}`,
        thumb: asset(`media/albuns/cenna-10-out/t${n}.webp`),
        src: asset(`media/albuns/cenna-10-out/${n}.jpg`),
        width,
        height,
      };
    }),
    albumUrl: "https://drive.google.com/drive/folders/1Uf5xZ7E2oCO7J9X-AyWb0KmlfcQ4_LPh",
    albumTotal: 282,
  },
  {
    id: "quintal-20-set",
    status: "past",
    title: "32º Sun, Bar & Love",
    dateLabel: "20 de setembro",
    venue: "Quintal Lounge",
    city: "Porto Alegre, RS",
    flyer: asset("media/flyer-quintal-20-set.webp"),
    blurb: "A 32ª edição, no Quintal Lounge: música boa, drinks e o pôr do sol de sempre.",
    ticketUrl: "",
    sale: { status: "closed" },
    album: QUINTAL_20_SET_THUMBS.map(([width, height], i) => {
      const n = String(i + 1).padStart(3, "0");
      return {
        id: `q20-${n}`,
        thumb: asset(`media/albuns/quintal-20-set/t${n}.webp`),
        src: asset(`media/albuns/quintal-20-set/${n}.jpg`),
        width,
        height,
      };
    }),
    albumUrl: "https://drive.google.com/drive/folders/16UWWX_o9s8w-aLjYSiimArRB5KMMi50R",
    albumTotal: 454,
  },
  {
    id: "rio-melhor-dia",
    status: "past",
    title: "Melhor Dia: From Rio",
    dateLabel: "15 de agosto",
    venue: "Casa Vetro",
    city: "Porto Alegre, RS",
    flyer: asset("media/flyer-rio.webp"),
    blurb: "A edição com sotaque carioca, com Davi Quaresma e a vibe do Rio no pôr do sol. Os ingressos esgotaram antes do grande dia.",
    ticketUrl: "",
    sale: { status: "soldout" },
    album: FROM_RIO_THUMBS.map(([width, height], i) => {
      const n = String(i + 1).padStart(3, "0");
      return {
        id: `rio-${n}`,
        thumb: asset(`media/albuns/casa-vetro-15-ago/t${n}.webp`),
        src: asset(`media/albuns/casa-vetro-15-ago/${n}.jpg`),
        width,
        height,
      };
    }),
    albumUrl: "https://drive.google.com/drive/folders/1CHo_Ci5-8LXfSpoKYquL31k4nGPMD4AF",
    albumTotal: 308,
  },
  {
    id: "made-in-brasil-05-jul",
    status: "past",
    title: "30º Sun, Bar & Love: Made in Brasil",
    dateLabel: "5 de julho",
    venue: "Casa Vetro",
    city: "Porto Alegre, RS",
    flyer: asset("media/flyer-made-in-brasil.webp"),
    blurb: "A 30ª edição, Made in Brasil: um domingo verde e amarelo na Casa Vetro, com open bar, atrações e muito pôr do sol.",
    ticketUrl: "",
    sale: { status: "closed" },
    album: MADE_IN_BRASIL_THUMBS.map(([width, height], i) => {
      const n = String(i + 1).padStart(3, "0");
      return {
        id: `mib-${n}`,
        thumb: asset(`media/albuns/casa-vetro-05-jul/t${n}.webp`),
        src: asset(`media/albuns/casa-vetro-05-jul/${n}.jpg`),
        width,
        height,
      };
    }),
    // Pasta do Drive com as fotos originais em alta resolução (precisa estar com "qualquer pessoa com o link").
    albumUrl: "https://drive.google.com/drive/folders/1XVxPLfvxeBTmzx9yAHjDL1UrnYf698rW",
    albumTotal: 399,
  },
  {
    id: "quintal-17-mai",
    status: "past",
    title: "29º Sun, Bar & Love",
    dateLabel: "17 de maio",
    venue: "Quintal Lounge",
    city: "Porto Alegre, RS",
    flyer: asset("media/flyer-quintal-17-mai.webp"),
    blurb: "A 29ª edição do Sun, Bar & Love, num domingo de pôr do sol no Quintal Lounge.",
    ticketUrl: "",
    sale: { status: "closed" },
    album: QUINTAL_17_MAI_THUMBS.map(([width, height], i) => {
      const n = String(i + 1).padStart(3, "0");
      return {
        id: `q17-${n}`,
        thumb: asset(`media/albuns/quintal-17-mai/t${n}.webp`),
        src: asset(`media/albuns/quintal-17-mai/${n}.jpg`),
        width,
        height,
      };
    }),
    // Pasta do Drive com as fotos originais em alta resolução (precisa estar com "qualquer pessoa com o link").
    albumUrl: "https://drive.google.com/drive/folders/1at6qPA6rbL8dUhg_pwOjJaAVznIoJFIz",
    albumTotal: 90,
  },
  {
    id: "quintal-29-mar",
    status: "past",
    title: "28º Sun, Bar & Love",
    dateLabel: "29 de março",
    venue: "Quintal Lounge",
    city: "Porto Alegre, RS",
    flyer: asset("media/flyer-quintal-29-mar.webp"),
    blurb: "A 28ª edição do Sun, Bar & Love, no Quintal Lounge, com pôr do sol, música boa e gente que a gente ama.",
    ticketUrl: "",
    sale: { status: "closed" },
    album: QUINTAL_29_MAR_THUMBS.map(([width, height], i) => {
      const n = String(i + 1).padStart(3, "0");
      return {
        id: `q29-${n}`,
        thumb: asset(`media/albuns/quintal-29-mar/t${n}.webp`),
        src: asset(`media/albuns/quintal-29-mar/${n}.jpg`),
        width,
        height,
      };
    }),
    // Pasta do Drive com as fotos originais em alta resolução (precisa estar com "qualquer pessoa com o link").
    albumUrl: "https://drive.google.com/drive/folders/1ceJnpa9Kc0peJ6T3zdBDzFuIzVaDkgIH",
    albumTotal: 453,
  },
];

/** Evento em destaque logo abaixo do Hero (some da agenda para não repetir). */
export const SPOTLIGHT_ID = "aniversario-7-anos";

/**
 * Coleção de roupas em parceria com a Approve, em destaque abaixo do evento.
 * TODO: quando o link de compra existir, preencha `url` (o botão vira "Ver a coleção").
 */
export const COLLAB = {
  partner: "Approve",
  blurb: "Uma coleção de roupas feita em parceria com a Approve.",
  image: asset("media/collab-approve.webp"),
  imageAlt: "Proposta da collab Sun, Bar & Love × Approve: camiseta e cropped, frente e costas, em off-white com o sol amarelo e as marcas em azul",
  launch: "Lançamento em breve",
  url: "",
};

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

// After Movies verticais (9:16, com som) da pasta "after moovies" do Drive. `src` abre no modal; `preview` é um trecho mudo de 5 s que toca no card ao passar o mouse.
// TODO: confirmar o nome e a edição de cada vídeo (os títulos abaixo vieram dos nomes dos arquivos).
export const VIDEOS: SbVideo[] = [
  {
    id: "v-aftermovie-v2",
    title: "After Movie V2",
    edition: "Sun, Bar & Love",
    poster: asset("media/poster-aftermovie-sbl-v2.webp"),
    src: asset("media/videos/aftermovie-sbl-v2.mp4"),
    preview: asset("media/videos/aftermovie-sbl-v2-preview.mp4"),
  },
  {
    id: "v-aftermovie-sbl6",
    title: "After Movie SBL 6",
    edition: "Sun, Bar & Love",
    poster: asset("media/poster-aftermovie-sbl6.webp"),
    src: asset("media/videos/aftermovie-sbl6.mp4"),
    preview: asset("media/videos/aftermovie-sbl6-preview.mp4"),
  },
  {
    id: "v-aftermovie-29-mar",
    title: "After Movie 29 de março",
    edition: "Sun, Bar & Love",
    poster: asset("media/poster-aftermovie-29-mar.webp"),
    src: asset("media/videos/aftermovie-29-mar.mp4"),
    preview: asset("media/videos/aftermovie-29-mar-preview.mp4"),
  },
];

export interface SbPhoto {
  id: string;
  src: string;
  alt: string;
  /** Medidas do arquivo: reservam o espaço antes de a foto carregar e evitam a grade pular. */
  width: number;
  height: number;
}

export interface Gallery {
  id: string;
  label: string;
  photos: SbPhoto[];
}

// Só fotos de verdade (nada de quadros de vídeo). Com mais de uma galeria, as abas por edição aparecem.
// TODO: acrescentar as demais fotos (public/media/) e, depois, separar por edição.
export const GALLERIES: Gallery[] = [
  {
    id: "destaques",
    label: "Destaques",
    photos: [
      { id: "g01", src: asset("media/galeria/g01.webp"), alt: "Palco ao pôr do sol com a pista cheia", width: 1400, height: 933 },
      { id: "g02", src: asset("media/galeria/g02.webp"), alt: "Duas amigas brindando diante do letreiro Vibe Infinita e do pôr do sol", width: 1024, height: 1024 },
      { id: "g03", src: asset("media/galeria/g03.webp"), alt: "Escadaria de madeira até o letreiro Vibe Infinita, com o céu em chamas", width: 1024, height: 1024 },
      { id: "g04", src: asset("media/galeria/g04.webp"), alt: "Amigas brindando em contraluz com o sol ao fundo", width: 1120, height: 1400 },
      { id: "g05", src: asset("media/galeria/g05.webp"), alt: "Moça posando na moldura de neon Sun, Bar & Love com girassóis", width: 933, height: 1400 },
      { id: "g06", src: asset("media/galeria/g06.webp"), alt: "Banda tocando em silhueta com o sol atrás", width: 933, height: 1400 },
      { id: "g07", src: asset("media/galeria/g07.webp"), alt: "Palco com painel de LED colorido e luzes azuis", width: 1400, height: 933 },
      { id: "g08", src: asset("media/galeria/g08.webp"), alt: "Público em silhueta diante do arco Sol Cerveza ao pôr do sol", width: 933, height: 1400 },
      { id: "g09", src: asset("media/galeria/g09.webp"), alt: "Amigas se abraçando diante do sol de luz", width: 933, height: 1400 },
      { id: "g10", src: asset("media/galeria/g10.webp"), alt: "Três amigas rindo com glitter no ar", width: 1400, height: 933 },
      { id: "g11", src: asset("media/galeria/g11.webp"), alt: "Grupo de amigos brindando com copos amarelos", width: 1000, height: 668 },
      { id: "g12", src: asset("media/galeria/g12.webp"), alt: "Copos erguidos em brinde com o sol dourado ao fundo", width: 934, height: 1400 },
      { id: "g13", src: asset("media/galeria/g13.webp"), alt: "Moça na moldura de girassóis à beira do Guaíba", width: 933, height: 1400 },
      { id: "g14", src: asset("media/galeria/g14.webp"), alt: "DJ no palco em arco com luzes e o lago ao fundo", width: 1400, height: 933 },
      { id: "g15", src: asset("media/galeria/g15.webp"), alt: "Show ao pôr do sol no palco em arco", width: 1400, height: 933 },
      { id: "g16", src: asset("media/galeria/g16.webp"), alt: "Moça soprando glitter sob o neon Sun, Bar & Love", width: 933, height: 1400 },
      { id: "g17", src: asset("media/galeria/g17.webp"), alt: "Pista com bandeiras e fumaça diante do DJ", width: 1400, height: 933 },
      { id: "g18", src: asset("media/galeria/g18.webp"), alt: "Moça bebendo no copo da festa diante de um mural colorido", width: 853, height: 1280 },
      { id: "g19", src: asset("media/galeria/g19.webp"), alt: "Letreiro Sun, Bar & Love ao pôr do sol, em lente olho de peixe", width: 1400, height: 933 },
      { id: "g20", src: asset("media/galeria/g20.webp"), alt: "Quatro amigas fazendo selfie com o céu alaranjado", width: 933, height: 1400 },
    ],
  },
  {
    id: "mais",
    label: "Mais fotos",
    photos: [
      { id: "g21", src: asset("media/galeria/g21.webp"), alt: "Moça bebendo no copo diante do painel azul Sun, Bar & Love", width: 1400, height: 933 },
      { id: "g22", src: asset("media/galeria/g22.webp"), alt: "Músicos tocando pandeiro em silhueta no pôr do sol", width: 1400, height: 933 },
      { id: "g23", src: asset("media/galeria/g23.webp"), alt: "Banda tocando no palco com o lago ao fundo", width: 1400, height: 933 },
      { id: "g24", src: asset("media/galeria/g24.webp"), alt: "Duas amigas sorrindo sob luzes quentes à noite", width: 933, height: 1400 },
      { id: "g25", src: asset("media/galeria/g25.webp"), alt: "Brinde com copos coloridos entre amigos", width: 1400, height: 933 },
      { id: "g26", src: asset("media/galeria/g26.webp"), alt: "Duas amigas bebendo drinks vermelhos diante do letreiro Vibe Infinita", width: 933, height: 1400 },
      { id: "g27", src: asset("media/galeria/g27.webp"), alt: "Moça de braços para o alto à noite", width: 933, height: 1400 },
      { id: "g28", src: asset("media/galeria/g28.webp"), alt: "Moça posando na estrutura azul com flores amarelas", width: 1400, height: 933 },
      { id: "g29", src: asset("media/galeria/g29.webp"), alt: "Três amigas de óculos escuros sorrindo", width: 1400, height: 933 },
      { id: "g30", src: asset("media/galeria/g30.webp"), alt: "Duas amigas posando diante do painel de nuvens", width: 1400, height: 932 },
      { id: "g31", src: asset("media/galeria/g31.webp"), alt: "Amigas pulando no pôr do sol diante do mural", width: 933, height: 1400 },
      { id: "g32", src: asset("media/galeria/g32.webp"), alt: "Moça de rabo de cavalo ao pôr do sol", width: 933, height: 1400 },
      { id: "g33", src: asset("media/galeria/g33.webp"), alt: "Pista cheia ao pôr do sol com o palco ao fundo", width: 1400, height: 933 },
      { id: "g34", src: asset("media/galeria/g34.webp"), alt: "Casal dançando diante das letras coloridas Sun, Bar & Love", width: 1400, height: 933 },
      { id: "g35", src: asset("media/galeria/g35.webp"), alt: "Brinde em silhueta com o sol por trás", width: 933, height: 1400 },
      { id: "g36", src: asset("media/galeria/g36.webp"), alt: "Moça de jaqueta posando diante do mural colorido", width: 933, height: 1400 },
      { id: "g37", src: asset("media/galeria/g37.webp"), alt: "Moça de braço erguido com o copo na pista", width: 933, height: 1400 },
      { id: "g38", src: asset("media/galeria/g38.webp"), alt: "Duas amigas caminhando pelo deck da festa", width: 933, height: 1400 },
      { id: "g39", src: asset("media/galeria/g39.webp"), alt: "Moça fazendo selfie sob o sol de luz", width: 933, height: 1400 },
      { id: "g40", src: asset("media/galeria/g40.webp"), alt: "Quatro amigas brindando à beira do lago", width: 933, height: 1400 },
      { id: "g41", src: asset("media/galeria/g41.webp"), alt: "Pista cheia com bandeiras sob luzes azuis", width: 1400, height: 933 },
      { id: "g42", src: asset("media/galeria/g42.webp"), alt: "Bandeira Sun, Bar & Love balançando sobre a pista", width: 1400, height: 933 },
      { id: "g43", src: asset("media/galeria/g43.webp"), alt: "Moça posando diante do sol amarelo Sol Cerveza", width: 933, height: 1400 },
      { id: "g44", src: asset("media/galeria/g44.webp"), alt: "Três amigas de mãos dadas entre as luzinhas", width: 1400, height: 932 },
      { id: "g45", src: asset("media/galeria/g45.webp"), alt: "Amigos abraçados vendo o sol se pôr", width: 668, height: 1000 },
      { id: "g46", src: asset("media/galeria/g46.webp"), alt: "Amigos brindando de frente para o lago", width: 1400, height: 933 },
      { id: "g47", src: asset("media/galeria/g47.webp"), alt: "Moça com o copo erguido diante do sol colorido", width: 933, height: 1400 },
      { id: "g48", src: asset("media/galeria/g48.webp"), alt: "Duas amigas erguendo copos sob a cobertura", width: 933, height: 1400 },
      { id: "g49", src: asset("media/galeria/g49.webp"), alt: "Moça dançando diante da banda de pagode", width: 933, height: 1400 },
      { id: "g50", src: asset("media/galeria/g50.webp"), alt: "Grupo de amigas se abraçando e rindo", width: 933, height: 1400 },
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

// TODO: revisar as respostas com a equipe (regras de idade e entrada, política de lotes).
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Onde compro os ingressos?",
    a: "Pelo botão Ingressos, que leva à página de venda da edição. Cada edição tem lotes, então vale garantir cedo.",
  },
  {
    q: "A que horas começa?",
    a: "A festa de 7 anos é no sábado, 7 de novembro. O open bar rola das 15h às 16h30, então chegue cedo para aproveitar.",
  },
  {
    q: "Onde vai ser?",
    a: "No Quintal Lounge, em Porto Alegre. No detalhe do evento, o botão Como chegar abre a rota no Google Maps.",
  },
  {
    q: "O lote acabou. E agora?",
    a: "Fique de olho no site: é por aqui que a gente avisa quando abrir um novo lote ou a próxima virada.",
  },
  {
    q: "Qual a idade mínima e o que levar na entrada?",
    a: "A regra de idade e de documentos é definida por edição e sai junto com as informações do evento. Confira aqui antes de ir.",
  },
];
