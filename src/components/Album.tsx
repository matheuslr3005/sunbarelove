import { useState } from "react";
import { ArrowUpRight, Camera, DownloadSimple, Plus } from "@phosphor-icons/react";
import { track } from "../analytics";
import type { SbEvent } from "../content";

/** Álbum de fotos de uma edição que já rolou: toque na foto para ver em tamanho cheio e baixe com o botão. */
const PAGE = 48;

export function Album({ event }: { event: SbEvent }) {
  const all = event.album ?? [];
  const [shown, setShown] = useState(PAGE);
  const photos = all.slice(0, shown);

  if (!all.length) {
    return (
      <div className="flex items-center gap-3 rounded-card border border-cream/20 bg-deep/50 p-5">
        <Camera size={28} weight="fill" className="shrink-0 text-sun" />
        <p className="text-cream/85">As fotos desta edição chegam em breve.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">Álbum · {event.albumTotal && event.albumTotal > all.length ? `${all.length} de ${event.albumTotal}` : all.length} fotos</h4>
        {event.albumUrl && (
          <a
            href={event.albumUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("album_download_all", { event_id: event.id })}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-sun px-5 text-sm font-semibold text-deep transition hover:bg-[#ffd24d] active:scale-[0.97]"
          >
            <DownloadSimple size={18} weight="bold" /> Baixar todas
          </a>
        )}
      </div>
      <ul className="mt-4 columns-2 gap-2 sm:columns-3 md:gap-3 [&>li]:mb-2 md:[&>li]:mb-3">
        {photos.map((p, i) => (
          <li key={p.id} className="group relative break-inside-avoid overflow-hidden rounded-[20px] bg-night-2 ring-1 ring-cream/15">
            <a
              href={p.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir foto ${i + 1} em tamanho cheio`}
              onClick={() => track("album_open", { event_id: event.id, photo_id: p.id })}
              className="block"
            >
              <img
                src={p.thumb}
                alt={`Foto ${i + 1} do álbum`}
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.05]"
                style={{ aspectRatio: `${p.width} / ${p.height}` }}
              />
            </a>
            <a
              href={p.src}
              download
              aria-label={`Baixar foto ${i + 1}`}
              onClick={() => track("album_download", { event_id: event.id, photo_id: p.id })}
              className="absolute bottom-2 right-2 flex size-11 items-center justify-center rounded-full bg-deep/80 text-cream backdrop-blur transition hover:bg-sun hover:text-deep active:scale-95"
            >
              <DownloadSimple size={20} weight="bold" />
            </a>
          </li>
        ))}
      </ul>
      {shown >= all.length && event.albumUrl && event.albumTotal && event.albumTotal > all.length && (
        <a
          href={event.albumUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("album_drive_open", { event_id: event.id })}
          className="mt-5 flex items-center justify-between gap-4 rounded-card bg-[linear-gradient(120deg,#f0286e,#ff6a2b_60%,#ffc21a)] p-5 text-deep transition hover:brightness-105 active:scale-[0.99]"
        >
          <span>
            <span className="block font-display text-xl uppercase leading-tight md:text-2xl">
              Ver as outras {event.albumTotal - all.length} fotos
            </span>
            <span className="mt-1 block text-sm font-medium text-deep/80">O álbum completo, em alta qualidade, está no Google Drive.</span>
          </span>
          <ArrowUpRight size={28} weight="bold" className="shrink-0" />
        </a>
      )}
      {shown < all.length && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-cream/45 px-6 font-semibold transition hover:border-cream hover:bg-cream/10 active:scale-[0.97]"
          >
            <Plus size={18} weight="bold" /> Ver mais fotos ({all.length - shown})
          </button>
        </div>
      )}
    </div>
  );
}
