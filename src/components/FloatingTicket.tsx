import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { EVENTS } from "../content";
import { TicketButton } from "./TicketButton";

const next = EVENTS.find((e) => e.status === "upcoming" && e.sale.status === "onsale");

/** Depois do hero, o botão de ingressos continua por perto em tamanho pequeno. */
export function FloatingTicket() {
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setPastHero(v > 560));

  useEffect(() => {
    const end = document.getElementById("fim");
    if (!end) return;
    const io = new IntersectionObserver(([entry]) => setAtEnd(entry.isIntersecting), { threshold: 0.35 });
    io.observe(end);
    return () => io.disconnect();
  }, []);

  if (!next) return null;

  return (
    <AnimatePresence>
      {pastHero && !atEnd && (
        <motion.div
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6"
          style={{ zIndex: "var(--z-float)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          initial={{ opacity: 0, scale: 0.7, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <TicketButton event={next} location="flutuante" size="sm" className="max-md:h-11" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
