import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Camera } from "@phosphor-icons/react";
import { track } from "../analytics";
import { GALLERIES, type SbPhoto } from "../content";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";
import { SunWipeOverlay, useSunWipe } from "./SunWipe";

function PhotoButton({ photo, onOpen, className = "", masonry }: { photo: SbPhoto; onOpen: () => void; className?: string; masonry?: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ampliar foto: ${photo.alt}`}
      className={`group relative block overflow-hidden rounded-card ring-1 ring-cream/15 ${className}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        draggable={false}
        className={`w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05] ${masonry ? "h-auto" : "size-full"}`}
        style={{ objectPosition: photo.position }}
      />
    </button>
  );
}

function MoreTile({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start justify-end gap-3 rounded-card bg-[linear-gradient(160deg,#19a7c9,#0b3341_70%)] p-5 ring-1 ring-cream/15 ${className}`}>
      <Camera size={34} weight="fill" className="text-sun" />
      <p className="font-display text-xl uppercase leading-tight md:text-2xl">Mais fotos em breve</p>
    </div>
  );
}

export function Gallery() {
  const [galleryId, setGalleryId] = useState(GALLERIES[0].id);
  const [index, setIndex] = useState<number | null>(null);
  const { containerRef, overlayRef, labelRef, go } = useSunWipe<string>(setGalleryId);

  const gallery = GALLERIES.find((g) => g.id === galleryId) ?? GALLERIES[0];
  const photos = gallery.photos;
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const open = (i: number) => {
    track("gallery_open", { gallery: gallery.id, photo_id: photos[i].id });
    setIndex(i);
  };
  const current = index === null ? null : photos[index];

  return (
    <section id="fotos" className="relative overflow-clip bg-night px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Quem foi, <span className="text-flame">lembra</span>
          </h2>
        </Reveal>

        {GALLERIES.length > 1 && <Reveal delay={0.1} className="mt-10">
          <div role="tablist" aria-label="Fotos por edição" className="flex w-fit max-w-full overflow-x-auto rounded-full border border-cream/20 bg-deep/50 p-1.5">
            {GALLERIES.map((g) => (
              <button
                key={g.id}
                role="tab"
                type="button"
                id={`gtab-${g.id}`}
                aria-selected={galleryId === g.id}
                aria-controls="gallery-panel"
                onClick={(e) => {
                  if (g.id === galleryId) return;
                  track("tab_change", { area: "fotos", tab: g.id });
                  void go(g.id, g.label, e.currentTarget);
                }}
                className="relative h-11 shrink-0 rounded-full px-5 text-[15px] font-semibold"
              >
                {galleryId === g.id && (
                  <motion.span
                    layoutId="gallery-tab"
                    className="absolute inset-0 rounded-full bg-sun"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative transition-colors ${galleryId === g.id ? "text-deep" : "text-cream/80"}`}>{g.label}</span>
              </button>
            ))}
          </div>
        </Reveal>}

        <div ref={containerRef} id="gallery-panel" role="tabpanel" aria-labelledby={`gtab-${galleryId}`} className="relative mt-10">
          <SunWipeOverlay overlayRef={overlayRef} labelRef={labelRef} />
          {gallery.layout === "bento" ? (
            <div className="grid auto-rows-[170px] grid-cols-2 gap-3 [grid-auto-flow:dense] md:auto-rows-[240px] md:grid-cols-4 md:gap-4">
              {photos.map((p, i) => (
                <PhotoButton key={p.id} photo={p} onOpen={() => open(i)} className={p.className} />
              ))}
              <MoreTile className="md:[grid-area:2/4/3/5]" />
            </div>
          ) : (
            <div className="columns-2 gap-3 md:columns-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
              {photos.map((p, i) => (
                <PhotoButton key={p.id} photo={p} onOpen={() => open(i)} className="w-full break-inside-avoid" masonry />
              ))}
              <MoreTile className="min-h-48 break-inside-avoid" />
            </div>
          )}
        </div>
      </div>

      <Modal open={current !== null} onClose={close} label="Galeria de fotos" panelClass="max-w-3xl bg-deep">
        {current && (
          <div className="relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={current.id}
                src={current.src}
                alt={current.alt}
                className="mx-auto max-h-[78dvh] w-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
            <div className="flex items-center justify-between gap-4 p-4 md:px-6">
              <p className="text-sm text-cream/85">{current.caption}</p>
              {photos.length > 1 && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Foto anterior"
                    className="flex size-11 items-center justify-center rounded-full border border-cream/30 hover:bg-cream/10 active:scale-95"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Próxima foto"
                    className="flex size-11 items-center justify-center rounded-full bg-sun text-deep hover:bg-[#ffd24d] active:scale-95"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
