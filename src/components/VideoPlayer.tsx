import { Sun } from "@phosphor-icons/react";

interface Props {
  title: string;
  poster?: string;
  /** Arquivo mp4 (em public/media/videos/). */
  src?: string;
  /** ID de vídeo do YouTube. */
  youtube?: string;
  /** Vídeo horizontal (16:9). Sem isso, o espaço de "em breve" é vertical. */
  landscape?: boolean;
}

/** Player do modal: arquivo, YouTube ou aviso de "em breve" enquanto o vídeo não existe. */
export function VideoPlayer({ title, poster, src, youtube, landscape }: Props) {
  if (src) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        className="mx-auto max-h-[85dvh] w-full bg-deep object-contain"
      />
    );
  }
  if (youtube) {
    return (
      <div className="aspect-video w-full">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className={`relative mx-auto max-h-[80dvh] ${landscape ? "aspect-video" : "aspect-[9/14]"}`}>
      {poster && <img src={poster} alt="" className="size-full object-cover opacity-40" />}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <Sun size={44} weight="fill" className="text-sun" />
        <p className="font-display text-3xl uppercase leading-tight">Vídeo em breve</p>
        <p className="text-cream/80">Este vídeo entra no ar nos próximos dias.</p>
      </div>
    </div>
  );
}
