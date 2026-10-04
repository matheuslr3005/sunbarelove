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
- **Vídeos** (`VIDEOS`): coloque o arquivo em `public/media/videos/` e preencha `src: "/media/videos/arquivo.mp4"`, ou use `youtube: "ID_DO_VIDEO"`. Sem nenhum dos dois, o modal mostra "Vídeo em breve". Use um `poster` vertical (9:16).
- **Fotos** (`PHOTOS`): coloque as imagens em `public/media/`. O grid é um bento de 4 colunas com 6 células; ao mudar a quantidade, ajuste o `className` de cada foto e o grid em `src/components/Gallery.tsx`.
- **Parceiros** (`SPONSORS`): textos da faixa amarela. Para usar logos, troque o conteúdo de `src/components/Marquee.tsx`.
- **Contato** (`SITE`): WhatsApp e link do Instagram (o ícone só aparece quando `instagram` estiver preenchido).

## Estrutura

```
src/
  content.ts          textos, eventos, vídeos, fotos
  components/         Hero, Marquee, Manifesto, Events, Videos, Gallery, Finale...
  index.css           tokens da marca (cores, fontes) e wordmark
public/media/         logo, cartazes e fotos
```
