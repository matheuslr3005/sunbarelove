import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { PHOTOS } from "../content";
import { Modal } from "./Modal";
import { Reveal } from "./Reveal";

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length)), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index === null ? null : PHOTOS[index];

  return (
    <section id="fotos" className="relative overflow-clip bg-night px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Quem foi, <span className="text-flame">lembra</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid auto-rows-[170px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4 md:gap-4">
          {PHOTOS.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ampliar foto: ${p.alt}`}
              className={`group relative overflow-hidden rounded-card ring-1 ring-cream/15 ${p.className}`}
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                draggable={false}
                className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]"
                style={{ objectPosition: p.position }}
              />
              <span className="pointer-events-none absolute inset-0 bg-flame/0 mix-blend-soft-light transition-colors duration-500 group-hover:bg-flame/40" />
            </motion.button>
          ))}
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
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>
            <div className="flex items-center justify-between gap-4 p-4 md:px-6">
              <p className="text-sm text-cream/85">{current.caption}</p>
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
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
