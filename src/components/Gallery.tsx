import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUp, Images } from "@phosphor-icons/react";
import { track } from "../analytics";
import { GALLERIES, type SbPhoto } from "../content";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";
import { SunWipeOverlay, useSunWipe } from "./SunWipe";

function PhotoButton({ photo, onOpen }: { photo: SbPhoto; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ampliar foto: ${photo.alt}`}
      className="group relative block w-full break-inside-avoid overflow-hidden rounded-card bg-night-2 ring-1 ring-cream/15"
    >
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-auto w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      />
    </button>
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
          <div className="columns-2 gap-3 md:columns-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
            {photos.map((p, i) => (
              <PhotoButton key={p.id} photo={p} onOpen={() => open(i)} />
            ))}
          </div>

          {GALLERIES.length > 1 && (
            <div className="mt-6 flex justify-center">
              {galleryId === GALLERIES[0].id ? (
                <button
                  type="button"
                  onClick={(e) => {
                    const other = GALLERIES[1];
                    track("tab_change", { area: "fotos", tab: other.id });
                    void go(other.id, other.label, e.currentTarget);
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-sun px-6 font-semibold text-deep transition hover:bg-[#ffd24d] active:scale-[0.97]"
                >
                  <Images size={20} weight="fill" /> Ver mais fotos ({GALLERIES[1].photos.length})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    const first = GALLERIES[0];
                    track("tab_change", { area: "fotos", tab: first.id });
                    void go(first.id, first.label, e.currentTarget);
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-cream/45 px-6 font-semibold transition hover:border-cream hover:bg-cream/10 active:scale-[0.97]"
                >
                  <ArrowUp size={20} /> Voltar aos destaques
                </button>
              )}
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
            <div className="flex items-center justify-center gap-4 p-4 md:px-6">
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
