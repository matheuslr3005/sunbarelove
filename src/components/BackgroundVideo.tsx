import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { BgVideo } from "../content";

interface Props {
  video: BgVideo;
  className?: string;
}

const isPhone = () => window.matchMedia("(max-width: 767px)").matches;

/**
 * Vídeo decorativo: toca só enquanto está na tela e vira imagem parada
 * com "reduzir movimento" ou economia de dados.
 *
 * Autoplay em celular: o navegador só libera com o vídeo mudo, e o Modo de Pouca Energia do iPhone
 * bloqueia mesmo assim. Por isso o mudo é forçado antes de tocar, o play é repetido quando o
 * vídeo carrega, e o primeiro toque na página tenta tocar de novo.
 */
export function BackgroundVideo({ video, className = "" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const still = Boolean(reduce || saveData);

  // escolhido uma vez ao montar: evita baixar o arquivo errado e trocar no meio
  const [phone] = useState(() => Boolean(video.mobile) && isPhone());
  const files = phone && video.mobile ? video.mobile : video;
  const poster = phone && video.mobilePoster ? video.mobilePoster : video.poster;

  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;

    // o atributo "muted" precisa existir no elemento: o React só define a propriedade
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");

    let visible = true;
    const play = () => {
      if (visible) void el.play().catch(() => undefined);
    };

    play();
    el.addEventListener("loadeddata", play);
    el.addEventListener("canplay", play);

    const unlockEvents = ["touchstart", "touchend", "pointerdown", "click", "keydown"] as const;
    const unlock = () => {
      play();
      unlockEvents.forEach((n) => window.removeEventListener(n, unlock));
    };
    unlockEvents.forEach((n) => window.addEventListener(n, unlock, { passive: true }));

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      el.removeEventListener("loadeddata", play);
      el.removeEventListener("canplay", play);
      unlockEvents.forEach((n) => window.removeEventListener(n, unlock));
    };
  }, [still]);

  if (still) {
    return poster ? <img src={poster} alt="" className={`object-cover ${className}`} /> : null;
  }

  return (
    <video
      ref={ref}
      className={`object-cover ${className}`}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      {files.webm && <source src={files.webm} type='video/webm; codecs="vp9"' />}
      <source src={files.mp4} type="video/mp4" />
    </video>
  );
}
