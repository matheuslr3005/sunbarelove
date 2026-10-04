import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react";
import { BG_VIDEOS, EVENTS, SITE } from "../content";
import { track } from "../analytics";
import { whatsappLink } from "../lib";
import { BackgroundVideo } from "./BackgroundVideo";
import { Sun } from "./Sun";
import { TicketButton } from "./TicketButton";

const next = EVENTS.find((e) => e.status === "upcoming");

/** O sol sobe até o centro, gira sem parar e o convite fica sobre ele. */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["30%", "0%"]);

  return (
    <footer ref={ref} id="fim" className="relative overflow-clip bg-[linear-gradient(to_bottom,#07232c,#04171e)]">
      {BG_VIDEOS.finale && (
        <BackgroundVideo
          src={BG_VIDEOS.finale.src}
          poster={BG_VIDEOS.finale.poster}
          className="absolute inset-0 size-full opacity-60"
        />
      )}
      <div className="relative grid min-h-[min(150vw,900px)] place-items-center px-5 py-16 md:px-8">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(150vw,860px)] -translate-x-1/2 -translate-y-1/2"
          style={{ y }}
        >
          <div className="sun-spin">
            <Sun />
          </div>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(4,23,30,0.8)_100%)]" />

        <div className="relative flex flex-col items-center text-center">
          <h2 className="wordmark text-[clamp(2.3rem,6vw,5rem)] leading-[1.3]">
            Te vejo
            <br />
            no pôr do sol
          </h2>
          {next && (
            <div className="mt-8">
              <TicketButton event={next} location="final" tone="light" />
            </div>
          )}
        </div>
      </div>

      <div className="relative border-t border-cream/15 bg-deep/80 px-5 backdrop-blur-sm md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 py-8 text-sm text-cream/80 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. Porto Alegre, RS.
          </p>
          <div className="flex items-center gap-5">
            <a
              href={whatsappLink("Oi! Vim pelo site do Sun, Bar & Love.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "rodape" })}
              className="flex items-center gap-2 hover:text-sun"
            >
              <WhatsappLogo size={22} weight="fill" /> WhatsApp
            </a>
            {SITE.instagram && (
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-sun">
                <InstagramLogo size={22} /> Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
