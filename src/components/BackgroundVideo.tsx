import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface Props {
  src: string;
  poster?: string;
  /** Versão para telas de celular (até 767 px): arquivo vertical e imagem de capa própria. */
  mobileSrc?: string;
  mobilePoster?: string;
  className?: string;
}

const isPhone = () => window.matchMedia("(max-width: 767px)").matches;

/**
 * Vídeo decorativo: toca só enquanto está na tela e vira imagem parada
 * com "reduzir movimento" ou economia de dados.
 */
export function BackgroundVideo({ src, poster, mobileSrc, mobilePoster, className = "" }: Props) {
  // escolhido uma vez ao montar: evita baixar o arquivo errado e trocar no meio
  const [phone] = useState(() => Boolean(mobileSrc) && isPhone());
  const videoSrc = phone && mobileSrc ? mobileSrc : src;
  const videoPoster = phone && mobilePoster ? mobilePoster : poster;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const still = Boolean(reduce || saveData);

  useEffect(() => {
    const video = ref.current;
    if (!video || still) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [still]);

  if (still) {
    return videoPoster ? <img src={videoPoster} alt="" className={`object-cover ${className}`} /> : null;
  }

  return (
    <video
      ref={ref}
      className={`object-cover ${className}`}
      src={videoSrc}
      poster={videoPoster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
