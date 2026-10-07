import { useCallback, useState } from "react";
import { Play, WhatsappLogo } from "@phosphor-icons/react";
import { asset } from "../asset";
import { track } from "../analytics";
import { BAND } from "../content";
import { whatsappLink } from "../lib";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";
import { Sun } from "./Sun";
import { VideoPlayer } from "./VideoPlayer";

const FALLBACK_POSTER = asset("media/fundo-nuvens.webp");

/** A banda de pagode da marca: um vídeo horizontal grande, que abre com som ao clicar. */
export function Band() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const hasVideo = Boolean(BAND.src || BAND.youtube);

  return (
    <section id="banda" className="relative overflow-clip bg-night-2 px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Agora tem <span className="text-rose">banda</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/85">
            Pagode com o clima do Sun, Bar &amp; Love. <span className="whitespace-nowrap">Aperte o play e escute.</span>
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <button
            type="button"
            onClick={() => {
              track("band_play", { has_video: hasVideo });
              setOpen(true);
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

        <Reveal delay={0.15} className="mt-8">
          <a
            href={whatsappLink("Oi! Quero saber mais sobre a banda do Sun, Bar & Love.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("band_booking_click")}
            className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border border-cream/45 px-6 font-semibold transition hover:border-cream hover:bg-cream/10 active:scale-[0.97]"
          >
            <WhatsappLogo size={20} weight="fill" /> Contratar a banda
          </a>
        </Reveal>
      </div>

      <Modal open={open} onClose={close} label={BAND.title} panelClass="max-w-4xl">
        {open && <VideoPlayer title={BAND.title} poster={BAND.poster ?? FALLBACK_POSTER} src={BAND.src} youtube={BAND.youtube} landscape />}
      </Modal>
    </section>
  );
}
