import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, Ticket } from "@phosphor-icons/react";
import { EVENTS } from "../content";
import { eventDate, ticketLink } from "../lib";
import { Button } from "./Button";
import { Sun } from "./Sun";
import { Wordmark } from "./Wordmark";

const next = EVENTS.find((e) => e.status === "upcoming");

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  const photoX = useTransform(sx, [-1, 1], [-14, 14]);
  const photoY = useTransform(sy, [-1, 1], [-10, 10]);
  const sunX = useTransform(sx, [-1, 1], [26, -26]);
  const sunY = useTransform(sy, [-1, 1], [18, -18]);

  const { scrollY } = useScroll();
  const sunRotate = useTransform(scrollY, [0, 1400], [0, reduce ? 0 : 140]);
  const copyY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -60]);

  const date = next ? eventDate(next) : null;

  return (
    <section
      id="top"
      className="relative min-h-[100dvh] overflow-clip bg-[linear-gradient(to_bottom,#07232c_0%,#0a4458_55%,#12627a_100%)]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
    >
      {/* horizonte do pôr do sol */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgba(255,106,43,0.7),rgba(240,40,110,0.3)_45%,transparent)]" />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-24 pt-24 md:grid-cols-12 md:px-8">
        <motion.div className="relative z-10 md:col-span-7" style={{ y: copyY }}>
          {date && (
            <motion.p
              className="mb-5 inline-flex rounded-full border border-cream/30 bg-night/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sun backdrop-blur"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              {date.weekday}, {date.day} no {next?.venue}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            <Wordmark className="text-[clamp(4.4rem,10.5vw,9rem)]" />
          </motion.div>

          <motion.p
            className="mt-8 max-w-md text-lg leading-relaxed text-cream/85"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
          >
            Uma festa para ver o sol ir embora dançando, com quem você ama. Em Porto Alegre.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            {next && (
              <Button href={ticketLink(next)} external icon={<Ticket size={20} weight="fill" />}>
                Ingressos
              </Button>
            )}
            <Button variant="ghost" href="#videos" icon={<ArrowDown size={18} />}>
              Ver vídeos
            </Button>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[420px] md:col-span-5 md:max-w-none">
          <motion.div
            className="absolute left-1/2 top-[44%] w-[135%] -translate-x-1/2 -translate-y-1/2"
            style={{ x: sunX, y: sunY }}
          >
            <Sun rotate={sunRotate} />
          </motion.div>

          <motion.figure
            className="relative mx-auto aspect-[3/4] w-[78%] overflow-hidden rounded-t-[999px] rounded-b-card border-[5px] border-cream shadow-[0_40px_90px_-30px_rgba(4,23,30,0.9)]"
            style={{ x: photoX, y: photoY }}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease }}
          >
            <img
              src="/media/foto-selfie.webp"
              alt="Duas amigas tirando selfie na pista do Sun, Bar & Love"
              className="size-full object-cover"
              fetchPriority="high"
            />
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
