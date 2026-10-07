import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react";
import { asset } from "../asset";
import { BG_VIDEOS, EVENTS } from "../content";
import { useIntro } from "./Intro";
import { eventDate } from "../lib";
import { BackgroundVideo } from "./BackgroundVideo";
import { Button } from "./Button";
import { Sun } from "./Sun";
import { TicketButton } from "./TicketButton";
import { Wordmark } from "./Wordmark";

const next = EVENTS.find((e) => e.status === "upcoming");

const ease = [0.16, 1, 0.3, 1] as const;

/** Vídeo de fundo do hero, com escurecimento para o texto ficar legível. */
function HeroVideo() {
  const bg = BG_VIDEOS.hero;
  if (!bg) return null;
  return (
    <>
      <BackgroundVideo
        src={bg.src}
        poster={bg.poster}
        mobileSrc={bg.mobileSrc}
        mobilePoster={bg.mobilePoster}
        className="absolute inset-0 size-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,35,44,0.5),rgba(7,35,44,0.05)_45%,rgba(7,35,44,0.7))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,35,44,0.55),transparent_58%)]" />
    </>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const { revealed } = useIntro();
  const { scrollY } = useScroll();
  const sunRotate = useTransform(scrollY, [0, 1400], [0, reduce ? 0 : 140]);

  const date = next ? eventDate(next) : null;

  return (
    <section
      id="top"
      className="relative min-h-[100dvh] overflow-clip bg-[linear-gradient(to_bottom,#07232c_0%,#0a4458_55%,#12627a_100%)]"
    >
      <HeroVideo />
      {/* horizonte do pôr do sol */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgba(255,106,43,0.7),rgba(240,40,110,0.3)_45%,transparent)]" />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-24 pt-24 lg:grid-cols-12 md:px-8">
        <div className="relative z-10 lg:col-span-7">
          {date && (
            <motion.p
              className="mb-5 inline-flex rounded-full border border-cream/30 bg-night/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sun backdrop-blur"
              initial={{ opacity: 0, y: 16 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, ease }}
            >
              {date.weekday}, {date.day} no {next?.venue}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            <Wordmark className="text-[clamp(4.4rem,10.5vw,9rem)]" />
          </motion.div>

          <motion.p
            className="mt-8 max-w-md text-lg leading-relaxed text-cream/90"
            initial={{ opacity: 0, y: 20 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
          >
            Uma festa para ver o sol ir embora dançando, com quem você ama.
          </motion.p>

          <motion.div
            className="mt-5 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            {next && <TicketButton event={next} location="hero" />}
            <Button variant="ghost" href="#videos" icon={<ArrowDown size={18} />}>
              Ver vídeos
            </Button>
          </motion.div>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-[420px] lg:col-span-5 lg:mt-0 lg:max-w-none">
          <div className="absolute left-1/2 top-[44%] w-[135%] -translate-x-1/2 -translate-y-1/2">
            <Sun rotate={sunRotate} />
          </div>

          <motion.figure
            className="relative mx-auto aspect-[3/4] w-[78%] overflow-hidden rounded-t-[999px] rounded-b-card border-[5px] border-cream shadow-[0_40px_90px_-30px_rgba(4,23,30,0.9)]"
            initial={{ opacity: 0, scale: 0.92, y: 50 }}
              animate={revealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 50 }}
            transition={{ duration: 1, delay: 0.25, ease }}
          >
            <img
              src={asset("media/foto-copos.webp")}
              alt="Dois copos azuis da festa brindando com respingo, com o pôr do sol ao fundo"
              className="size-full object-cover"
              fetchPriority="high"
            />
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
