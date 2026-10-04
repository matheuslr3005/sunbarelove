import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play, Sun } from "@phosphor-icons/react";
import { track } from "../analytics";
import { BG_VIDEOS, VIDEOS, type SbVideo } from "../content";
import { BackgroundVideo } from "./BackgroundVideo";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";

function VideoPlayer({ video }: { video: SbVideo }) {
  if (video.src) {
    return (
      <video
        src={video.src}
        poster={video.poster}
        controls
        autoPlay
        playsInline
        className="mx-auto max-h-[85dvh] w-full bg-deep object-contain"
      />
    );
  }
  if (video.youtube) {
    return (
      <div className="aspect-video w-full">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&rel=0`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="relative mx-auto aspect-[9/14] max-h-[80dvh]">
      <img src={video.poster} alt="" className="size-full object-cover opacity-40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <Sun size={44} weight="fill" className="text-sun" />
        <p className="font-display text-3xl uppercase leading-tight">Vídeo em breve</p>
        <p className="text-cream/80">Este vídeo entra no ar nos próximos dias.</p>
      </div>
    </div>
  );
}

/** Card vertical. Com `preview`, um trecho mudo toca enquanto o mouse está em cima. */
function VideoCard({ video, onPlay }: { video: SbVideo; onPlay: (v: SbVideo) => void }) {
  const previewRef = useRef<HTMLVideoElement>(null);

  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") void previewRef.current?.play().catch(() => undefined);
      }}
      onPointerLeave={() => {
        const el = previewRef.current;
        if (el) {
          el.pause();
          el.currentTime = 0;
        }
      }}
      className="group block w-full text-left"
      aria-label={`Assistir: ${video.title}`}
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-card ring-1 ring-cream/15 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1.5">
        <img src={video.poster} alt="" draggable={false} loading="lazy" className="size-full object-cover" />
        {video.preview && (
          <video
            ref={previewRef}
            src={video.preview}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose text-cream shadow-[0_10px_30px_-8px_rgba(240,40,110,0.9)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
          <Play size={28} weight="fill" />
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl uppercase leading-tight">{video.title}</h3>
      <p className="mt-1 text-sm text-cream/70">{video.edition}</p>
    </button>
  );
}

export function Videos() {
  const [playing, setPlaying] = useState<SbVideo | null>(null);
  const close = useCallback(() => setPlaying(null), []);
  const rail = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const scrollBy = (dir: 1 | -1) =>
    rail.current?.scrollBy({ left: dir * Math.min(520, rail.current.clientWidth * 0.8), behavior: "smooth" });

  const play = (v: SbVideo) => {
    if (drag.current.moved) return;
    track("video_play", { video_id: v.id, has_file: Boolean(v.src || v.youtube) });
    setPlaying(v);
  };

  return (
    <section id="videos" className="relative overflow-clip bg-deep py-24 md:py-36">
      {BG_VIDEOS.videos && (
        <BackgroundVideo
          src={BG_VIDEOS.videos.src}
          poster={BG_VIDEOS.videos.poster}
          className="absolute inset-x-0 top-0 h-[560px] w-full opacity-30 [mask-image:linear-gradient(to_bottom,black_15%,transparent_85%)]"
        />
      )}
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-teal">Edições passadas</p>
          <h2 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Reviva cada <span className="text-sun">pôr do sol</span>
          </h2>
        </Reveal>
      </div>

      <div className="relative mt-12">
        <ul
          ref={rail}
          className="hide-scrollbar flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth scroll-pl-5 px-5 pb-6 active:cursor-grabbing md:gap-6 md:scroll-pl-[max(2rem,calc((100vw-72rem)/2+2rem))] md:px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse" || !rail.current) return;
            drag.current = { active: true, startX: e.clientX, startScroll: rail.current.scrollLeft, moved: false };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d.active || !rail.current) return;
            const dx = e.clientX - d.startX;
            if (Math.abs(dx) > 5) {
              d.moved = true;
              rail.current.style.scrollSnapType = "none";
              rail.current.style.scrollBehavior = "auto";
            }
            rail.current.scrollLeft = d.startScroll - dx;
          }}
          onPointerUp={() => {
            drag.current.active = false;
            if (rail.current) {
              rail.current.style.scrollSnapType = "";
              rail.current.style.scrollBehavior = "";
            }
            // libera o clique no card logo depois de soltar um arrasto
            window.setTimeout(() => {
              drag.current.moved = false;
            }, 0);
          }}
          onPointerLeave={() => {
            drag.current.active = false;
          }}
        >
          {VIDEOS.map((v) => (
            <li key={v.id} className="w-[68vw] max-w-[300px] shrink-0 snap-start">
              <VideoCard video={v} onPlay={play} />
            </li>
          ))}

          <li className="w-[68vw] max-w-[300px] shrink-0 snap-start">
            <div className="flex aspect-[9/16] flex-col items-start justify-end gap-3 rounded-card bg-[linear-gradient(160deg,#19a7c9,#0b3341_70%)] p-6 ring-1 ring-cream/15">
              <Sun size={40} weight="fill" className="text-sun" />
              <p className="font-display text-3xl uppercase leading-tight">Mais vídeos a caminho</p>
            </div>
          </li>
        </ul>

        <div className="mx-auto mt-4 flex max-w-6xl justify-end gap-2 px-5 md:px-8">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Vídeos anteriores"
            className="flex size-12 items-center justify-center rounded-full border border-cream/30 transition hover:bg-cream/10 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Próximos vídeos"
            className="flex size-12 items-center justify-center rounded-full bg-sun text-deep transition hover:bg-[#ffd24d] active:scale-95"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <Modal open={!!playing} onClose={close} label={playing?.title ?? "Vídeo"} panelClass={playing?.youtube ? "max-w-3xl" : "max-w-[min(92vw,460px)]"}>
        {playing && <VideoPlayer video={playing} />}
      </Modal>
    </section>
  );
}
