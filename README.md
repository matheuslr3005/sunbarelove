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
- **Vídeos de fundo** (`BG_VIDEOS`): `hero`, `finale` e `videos` (atrás do título da seção de vídeos). Cada um tem um `mp4` (H.264, serve Safari e iPhone) e, de preferência, um `webm` (VP9, que o navegador usa primeiro e é bem mais leve), sem som e em loop, em `public/media/videos/`. O do hero também tem versão vertical para celular (`mobile`, 900x1600, com `mobilePoster`), e o celular só baixa a vertical. Só tocam enquanto estão na tela, e viram imagem parada com "reduzir movimento" ou economia de dados. Remova a chave para desligar.

  Hero e rodapé vêm de dois takes de drone em 4K, cortados com `ffmpeg` (recorte 16:9 que desce pelo quadro vertical, 2160x1215, reduzido a 1920x1080) e com um tratamento leve de nitidez, contraste e cor (`unsharp` e `eq`), porque o original é macio e apagado. Os arquivos 4K não ficam no repositório (28 MB cada).

  Autoplay no celular: o componente `BackgroundVideo` força o mudo, repete o play quando o vídeo carrega e tenta de novo no primeiro toque (o Modo de Pouca Energia do iPhone bloqueia a reprodução automática).
- **Vídeos** (`VIDEOS`): `src` (mp4 vertical em `public/media/videos/`) ou `youtube` (ID) para o vídeo completo, e `preview` (mp4 vertical curto e mudo) para o trecho que toca ao passar o mouse no card. Sem `src`/`youtube`, o modal mostra "Vídeo em breve". Use um `poster` vertical (9:16).

  Os vídeos atuais são cortes de gravações de tela de takes de drone. Os originais, sem gravação de tela, dariam mais qualidade (principalmente os horizontais).
- **Arquivos originais da marca** em `public/media/`: `logo-neon.webp` (logo neon com fundo transparente, ainda não usado no site) e `fundo-nuvens.webp` (fundo azul com nuvens e moldura, usado como capa da seção da banda).
- **Fotos** (`GALLERIES`): só fotos de verdade (sem quadros de vídeo). Com uma galeria só, as abas não aparecem; ao acrescentar uma segunda (por edição), elas aparecem sozinhas. `layout: "masonry"` aceita qualquer quantidade de fotos; `"bento"` exige exatamente 6, com `className`. Imagens em `public/media/`.
- **Números** (`STATS`): o público (+2.500) é um valor de exemplo. Troque pelo real antes de divulgar.
- **Dúvidas** (`FAQ`): revise as respostas com a equipe (idade, entrada, lotes).
- **Loja** (`PRODUCTS`, `SHOP_COLORS` e `SHOP`): a esteira de produtos. Cada produto tem `name`, `kind` (moletom, boné, camiseta ou óculos), `colors` (azul, laranja, branco, preto) e, quando houver, `price`, `url` (link do produto) e foto: `photo` (uma foto para qualquer cor) ou `images` (uma foto por cor, em `public/media/`). Sem foto, o card mostra um desenho da peça na cor escolhida. O seletor de cor só aparece com duas ou mais cores. Sem `url`, usa `SHOP.url` (link da loja, a Shopify quando existir), e sem esse abre o WhatsApp com o nome do produto (e a cor, quando há escolha). Fotos podem se repetir na esteira. Para trocar o sentido da esteira, mude o sinal em `Shop.tsx` (`next += ...`).
- **Banda** (`BAND`): a seção com o vídeo horizontal da banda de pagode. Preencha `src` (mp4 em `public/media/videos/`) ou `youtube` (ID), e `poster` se quiser uma capa própria; sem vídeo, mostra "Vídeo em breve" sobre a arte de nuvens da marca. O botão "Contratar a banda" abre o WhatsApp (remova em `src/components/Band.tsx` se não quiser).
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
| `shop_click` | clique em um produto | `product_id`, `color` |
| `band_play`, `band_booking_click` | abrir o vídeo da banda, ou Contratar a banda | `has_video` |
| `tab_change` | trocar de aba | `area`, `tab` |

Para ver os números, preencha `SITE.analyticsId` com o ID do Google Analytics 4 (`G-...`). Sem ele, os eventos vão só para o `dataLayer` (prontos para o Google Tag Manager). Quando `ticketUrl` estiver preenchido, o link de venda recebe `utm_source=site`, `utm_medium=botao`, `utm_campaign=<id do evento>` e `utm_content=<botão>`, para a plataforma de vendas mostrar de onde veio cada compra.

## Estrutura

```
src/
  content.ts          textos, eventos, vídeos, fotos
  analytics.ts        rastreamento de cliques
  components/         Hero, Marquee, Manifesto, Proof, Events, Videos, Gallery, Shop, Faq, Finale...
  index.css           tokens da marca (cores, fontes) e wordmark
public/media/         logo, cartazes e fotos
```
