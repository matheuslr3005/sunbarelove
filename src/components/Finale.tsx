import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react";
import { EVENTS, SITE } from "../content";
import { track } from "../analytics";
import { whatsappLink } from "../lib";
import { Sun } from "./Sun";
import { TicketButton } from "./TicketButton";

const next = EVENTS.find((e) => e.status === "upcoming");

/** O sol nasce atrás do convite final conforme a página chega ao fim. */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["35%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

  return (
    <footer ref={ref} id="fim" className="relative overflow-clip bg-[linear-gradient(to_bottom,#07232c,#04171e)] px-5 pt-32 md:px-8 md:pt-44">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[84%] w-[min(130vw,1100px)] -translate-y-1/2 -translate-x-1/2"
        style={{ y }}
      >
        <Sun rotate={rotate} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_20%,rgba(4,23,30,0.88)_75%)]" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center pb-40 text-center md:pb-56">
        <h2 className="wordmark text-[clamp(2.6rem,7.4vw,6rem)] leading-[1.18]">
          Te vejo
          <br />
          no pôr do sol
        </h2>
        {next && (
          <div className="mt-10">
            <TicketButton event={next} location="final" />
          </div>
        )}
      </div>

      <div className="relative -mx-5 border-t border-cream/15 bg-deep/80 px-5 backdrop-blur-sm md:-mx-8 md:px-8"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 py-8 text-sm text-cream/80 sm:flex-row">
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
