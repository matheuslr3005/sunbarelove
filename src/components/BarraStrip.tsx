import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { asset } from "../asset";

/** Faixa animada com os azulejos da identidade (sol, lua, olho, estrela), separando o Hero do resto. */
export function BarraStrip() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    el.muted = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    const play = () => void el.play().catch(() => undefined);
    play();
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : el.pause()), { threshold: 0.05 });
    io.observe(el);
    el.addEventListener("loadeddata", play);
    return () => {
      io.disconnect();
      el.removeEventListener("loadeddata", play);
    };
  }, [reduce]);

  return (
    <div aria-hidden="true" className="relative z-10 h-[clamp(4.5rem,13vw,10rem)] w-full overflow-hidden bg-night">
      <video
        ref={ref}
        className="size-full object-cover"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="auto"
        poster={asset("media/barra-poster.webp")}
      >
        <source src={asset("media/videos/barra.webm")} type='video/webm; codecs="vp9"' />
        <source src={asset("media/videos/barra.mp4")} type="video/mp4" />
      </video>
    </div>
  );
}
