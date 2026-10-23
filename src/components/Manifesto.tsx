import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

const TEXT =
  "Somos um festival itinerante que celebra o sol, a música e a felicidade. Criamos experiências únicas, onde a energia contagia, as conexões acontecem e cada detalhe transforma o dia em uma memória inesquecível.";
const HIGHLIGHT = new Set(["sol,", "música", "felicidade.", "memória", "inesquecível."]);

function Word({
  word,
  range,
  progress,
  reduce,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const highlight = HIGHLIGHT.has(word.toLowerCase());
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className={highlight ? "text-sun" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

/** As palavras acendem conforme a rolagem: a frase é lida no ritmo de quem rola. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const words = TEXT.split(" ");

  return (
    <section ref={ref} id="sobre" className="relative overflow-clip bg-night px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-48">
      <p className="mx-auto max-w-6xl font-display text-[clamp(1.75rem,4.3vw,3.9rem)] uppercase leading-[1.08] tracking-tight md:pl-[8vw]">
        {words.map((w, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return <Word key={i} word={w} range={[start, end]} progress={scrollYProgress} reduce={reduce} />;
        })}
      </p>
    </section>
  );
}
