# Sun, Bar & Love

Site da festa: hero animado, próximos eventos (com detalhes e link de ingressos), vídeos das edições passadas e galeria de fotos.

Stack: Vite, React, TypeScript, Tailwind v4, Motion (`motion/react`) e Phosphor Icons.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera a pasta dist/
npm run preview  # testa o build
```

## Como editar o conteúdo

Tudo fica em `src/content.ts`.

- **Eventos** (`EVENTS`): `status: "upcoming"` aparece na aba "Próximos" com contagem regressiva; `"past"` aparece em "Já rolou". Preencha `ticketUrl` com o link da página de venda. Enquanto estiver vazio, o botão "Ingressos" abre o WhatsApp.
- **Lotes** (`sale` de cada evento): `{ status: "onsale" }` mostra "Ingressos à venda". Com `lot: "2º lote"` mostra "2º lote à venda", e com `lotEndsAt: "2026-10-09T12:00:00-03:00"` mostra também "Vira em 1d 04h". `status: "soldout"` mostra "Esgotado" e troca o botão por "Esgotado". Não há preço no site, de propósito.
- **Line-up** (`lineup` do evento): lista de nomes. Vazia, o bloco não aparece.
- **Vídeo de fundo do hero** (`HERO_VIDEO`): coloque um mp4 horizontal (H.264, 1280x720, 8 a 15 s, sem som, até 4 MB) em `public/media/videos/` e preencha `src` (e `poster`). Não toca com "reduzir movimento" nem com economia de dados.
- **Vídeos** (`VIDEOS`): `src` (mp4 em `public/media/videos/`) ou `youtube` (ID) para o vídeo completo, e `preview` (mp4 vertical curto e mudo) para o trecho que toca ao passar o mouse no card. Sem `src`/`youtube`, o modal mostra "Vídeo em breve". Use um `poster` vertical (9:16).
- **Fotos** (`GALLERIES`): cada edição é uma aba. `layout: "bento"` exige exatamente 6 fotos com `className`; `"masonry"` aceita qualquer quantidade. Imagens em `public/media/`.
- **Números** (`STATS`): o público (+2.500) é um valor de exemplo. Troque pelo real antes de divulgar.
- **Dúvidas** (`FAQ`): revise as respostas com a equipe (idade, entrada, lotes).
- **Parceiros** (`SPONSORS`): textos da faixa amarela. Para usar logos, troque o conteúdo de `src/components/Marquee.tsx`.
- **Contato** (`SITE`): WhatsApp, link do Instagram e ID do Google Analytics.

## Rastreamento de cliques

Os cliques importantes são enviados como eventos (`src/analytics.ts`):

| Evento | Quando | Dados |
| --- | --- | --- |
| `ticket_click` | clique em Ingressos | `location` (hero, nav, flutuante, evento, modal, final), `event_id`, `destination` |
| `whatsapp_click` | clique em WhatsApp | `location` |
| `maps_click`, `share_click` | Como chegar, Compartilhar | `event_id` |
| `video_play` | abrir um vídeo | `video_id` |
| `gallery_open` | ampliar uma foto | `gallery`, `photo_id` |
| `faq_open` | abrir uma pergunta | `question` |
| `tab_change` | trocar de aba | `area`, `tab` |

Para ver os números, preencha `SITE.analyticsId` com o ID do Google Analytics 4 (`G-...`). Sem ele, os eventos vão só para o `dataLayer` (prontos para o Google Tag Manager). Quando `ticketUrl` estiver preenchido, o link de venda recebe `utm_source=site`, `utm_medium=botao`, `utm_campaign=<id do evento>` e `utm_content=<botão>`, para a plataforma de vendas mostrar de onde veio cada compra.

## Estrutura

```
src/
  content.ts          textos, eventos, vídeos, fotos
  analytics.ts        rastreamento de cliques
  components/         Hero, Marquee, Manifesto, Proof, Events, Videos, Gallery, Faq, Finale...
  index.css           tokens da marca (cores, fontes) e wordmark
public/media/         logo, cartazes e fotos
```
