import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { List, WhatsappLogo, X } from "@phosphor-icons/react";
import { asset } from "../asset";
import { EVENTS } from "../content";
import { whatsappLink } from "../lib";
import { track } from "../analytics";
import { TicketButton } from "./TicketButton";

const LINKS = [
  { id: "eventos", label: "Eventos" },
  { id: "videos", label: "Vídeos" },
  { id: "fotos", label: "Fotos" },
  { id: "loja", label: "Loja" },
  { id: "duvidas", label: "Dúvidas" },
];

const next = EVENTS.find((e) => e.status === "upcoming");

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // com o menu aberto no celular, a página atrás não rola
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-3 flex justify-center px-3" style={{ zIndex: "var(--z-nav)" }}>
        <nav
          aria-label="Principal"
          className="flex h-14 w-full max-w-4xl items-center justify-between gap-2 rounded-full border border-cream/15 bg-night/60 py-2 pl-2 pr-2 shadow-[inset_0_1px_0_rgba(255,241,214,0.12),0_18px_50px_-20px_rgba(4,23,30,0.9)] backdrop-blur-xl"
        >
          <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2" aria-label="Sun, Bar & Love, início">
            <img src={asset("media/logo.webp")} alt="" width={40} height={40} className="size-10 rounded-full" />
            <span className="font-display text-base uppercase leading-none tracking-tight sm:text-lg">Sun,Bar &amp; Love</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="relative block rounded-full px-4 py-2.5 text-sm font-medium text-cream/80 transition-colors hover:text-cream"
                >
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-cream/12"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {next && (
              <div className="hidden md:block">
                <TicketButton event={next} location="nav" size="sm" />
              </div>
            )}
            <button
              type="button"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex size-11 items-center justify-center rounded-full border border-cream/25 transition hover:bg-cream/10 md:hidden"
            >
              {open ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex flex-col justify-center gap-2 bg-deep/95 px-8 backdrop-blur-lg md:hidden"
            style={{ zIndex: "calc(var(--z-nav) - 1)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="font-display text-6xl uppercase leading-tight text-cream hover:text-sun"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + LINKS.length * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {next && <TicketButton event={next} location="menu" />}
              <a
                href={whatsappLink("Oi! Vim pelo site do Sun, Bar & Love.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { location: "menu" })}
                className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border border-cream/45 px-6 font-semibold text-cream transition hover:border-cream hover:bg-cream/10 active:scale-[0.97]"
              >
                <WhatsappLogo size={20} weight="fill" /> WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
