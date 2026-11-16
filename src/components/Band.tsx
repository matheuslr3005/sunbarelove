import { useCallback, useState } from "react";
import { ArrowUpRight, ChatCircleText, Play } from "@phosphor-icons/react";
import { asset } from "../asset";
import { track } from "../analytics";
import { BAND, type BandBlock } from "../content";
import { hasWhatsapp, whatsappLink } from "../lib";
import { Conveyor } from "./Conveyor";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";
import { Sun } from "./Sun";
import { VideoPlayer } from "./VideoPlayer";

const FALLBACK_POSTER = asset("media/fundo-nuvens.webp");
const HIRE_MESSAGE = "Oi! Quero contratar a Banda Sun, Bar & Love.";

/** Link do botão "Contrate aqui": o contato da banda, ou o WhatsApp do site, ou nada ainda. */
function hireLink(): string {
  if (BAND.contactUrl) return BAND.contactUrl;
  return hasWhatsapp ? whatsappLink(HIRE_MESSAGE) : "";
}

function HireButton({ location, className = "" }: { location: string; className?: string }) {
  const href = hireLink();
  const base = `inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-semibold ${className}`;
  if (!href) {
    return (
      <span aria-disabled="true" title="Contato para contratação em breve" className={`${base} cursor-not-allowed bg-cream/15 text-cream/70`}>
        <ChatCircleText size={20} weight="fill" /> Contrate aqui · contato em breve
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("band_booking_click", { location })}
      className={`${base} bg-rose text-cream shadow-[0_12px_32px_-12px_rgba(240,40,110,0.9)] transition hover:brightness-110 active:scale-[0.97]`}
    >
      <ChatCircleText size={20} weight="fill" /> Contrate aqui
    </a>
  );
}

function BlockCard({ block, onOpen, clone, start }: { block: BandBlock; onOpen: (b: BandBlock) => void; clone: boolean; start: boolean }) {
  return (
    <button
      type="button"
      data-start={start ? "" : undefined}
      onClick={() => onOpen(block)}
      tabIndex={clone ? -1 : undefined}
      aria-hidden={clone || undefined}
      aria-label={`Assistir ${block.title}`}
      className="group relative block aspect-video w-[78vw] max-w-[400px] shrink-0 overflow-hidden rounded-card text-left ring-1 ring-cream/20 sm:w-[360px] lg:w-[380px]"
    >
      <img
        src={block.poster}
        alt=""
        loading="lazy"
        draggable={false}
        className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/10 to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose text-cream shadow-[0_14px_40px_-8px_rgba(240,40,110,0.9)] transition-transform duration-300 group-hover:scale-110">
        <Play size={30} weight="fill" />
      </span>
      <span className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
        <span className="font-display text-2xl uppercase leading-none">{block.title}</span>
        {block.duration && <span className="rounded-full bg-deep/80 px-3 py-1 text-xs font-semibold text-cream/90 backdrop-blur">Completo {block.duration}</span>}
      </span>
    </button>
  );
}

/** A banda de pagode da marca: vídeo principal, blocos do show em esteira e o botão para contratar. */
export function Band() {
  const [mainOpen, setMainOpen] = useState(false);
  const [block, setBlock] = useState<BandBlock | null>(null);
  const closeMain = useCallback(() => setMainOpen(false), []);
  const closeBlock = useCallback(() => setBlock(null), []);
  const hasVideo = Boolean(BAND.src || BAND.youtube);
  const blocks = BAND.blocks ?? [];

  return (
    <section id="banda" className="relative overflow-clip bg-night-2 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">Pagode ao vivo</p>
              <h2 className="mt-3 font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
                Agora tem <span className="text-rose">banda</span>
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/85">
                Pagode com o clima do Sun, Bar &amp; Love. <span className="whitespace-nowrap">Aperte o play e escute.</span>
              </p>
            </div>
            <HireButton location="banda_topo" />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <button
            type="button"
            onClick={() => {
              track("band_play", { has_video: hasVideo });
              setMainOpen(true);
            }}
            aria-label={hasVideo ? "Assistir à banda tocando" : "Vídeo da banda, em breve"}
            className="group relative block aspect-video w-full overflow-hidden rounded-card ring-1 ring-cream/15"
          >
            <img
              src={BAND.poster ?? FALLBACK_POSTER}
              alt=""
              loading="lazy"
              draggable={false}
              className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
            />
            {!BAND.poster && (
              <span className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 opacity-90">
                <Sun />
              </span>
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose text-cream shadow-[0_14px_40px_-8px_rgba(240,40,110,0.9)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 md:size-24">
              <Play size={40} weight="fill" />
            </span>
            {!hasVideo && (
              <span className="absolute bottom-4 left-4 rounded-full bg-deep/80 px-4 py-1.5 text-sm font-semibold text-sun backdrop-blur">
                Vídeo em breve
              </span>
            )}
          </button>
        </Reveal>
      </div>

      {blocks.length > 0 && (
        <div className="mt-14">
          <div className="mx-auto mb-6 max-w-6xl px-5 md:px-8">
            <Reveal>
              <h3 className="font-display text-3xl uppercase leading-tight md:text-4xl">Blocos do show</h3>
              <p className="mt-2 max-w-xl text-cream/80">Passe pelos blocos, toque para assistir e escolha o repertório da sua festa.</p>
            </Reveal>
          </div>
          <Conveyor
            items={blocks}
            getKey={(b) => b.id}
            renderItem={(b, { clone, start }) => <BlockCard block={b} onOpen={setBlock} clone={clone} start={start} />}
            stepGuess={420}
            paused={!!block || mainOpen}
            label="Blocos do show da banda"
            prevLabel="Blocos anteriores"
            nextLabel="Próximos blocos"
          />
        </div>
      )}

      <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 md:px-8">
        <p className="max-w-md font-display text-2xl uppercase leading-tight md:text-3xl">Nossa banda</p>
        <HireButton location="banda_rodape" />
      </div>

      <Modal open={mainOpen} onClose={closeMain} label={BAND.title} panelClass="max-w-4xl">
        {mainOpen && <VideoPlayer title={BAND.title} poster={BAND.poster ?? FALLBACK_POSTER} src={BAND.src} youtube={BAND.youtube} landscape />}
      </Modal>

      <Modal open={!!block} onClose={closeBlock} label={block ? `${BAND.title}: ${block.title}` : BAND.title} panelClass="max-w-4xl">
        {block && (
          <div>
            <VideoPlayer title={`${BAND.title}: ${block.title}`} poster={block.poster} src={block.src} landscape />
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
              <p className="font-display text-2xl uppercase leading-tight">{block.title}</p>
              <div className="flex flex-wrap items-center gap-3">
                {block.fullUrl && (
                  <a
                    href={block.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("band_block_full_click", { block: block.id })}
                    className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-cream/40 px-6 text-[15px] font-semibold transition hover:bg-cream/10 active:scale-[0.97]"
                  >
                    Assistir o bloco completo <ArrowUpRight size={18} />
                  </a>
                )}
                <HireButton location="banda_bloco" />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
