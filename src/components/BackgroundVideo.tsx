import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface Props {
  src: string;
  poster?: string;
  className?: string;
}

/**
 * Vídeo decorativo: toca só enquanto está na tela e vira imagem parada
 * com "reduzir movimento" ou economia de dados.
 */
export function BackgroundVideo({ src, poster, className = "" }: Props) {
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
    return poster ? <img src={poster} alt="" className={`object-cover ${className}`} /> : null;
  }

  return (
    <video
      ref={ref}
      className={`object-cover ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
