import { Sun } from "@phosphor-icons/react";
import { SPONSORS } from "../content";

/** Faixa de marcas parceiras: o único marquee da página. */
export function Marquee() {
  const items = [...SPONSORS, ...SPONSORS];
  return (
    <section
      aria-label="Marcas parceiras"
      className="marquee relative z-10 -mt-7 -rotate-[1.4deg] overflow-hidden bg-sun py-5 text-deep shadow-[0_20px_50px_-20px_rgba(255,106,43,0.7)]"
    >
      <ul className="marquee-track items-center">
        {items.map((name, i) => (
          <li
            key={`${name}-${i}`}
            aria-hidden={i >= SPONSORS.length}
            className="flex shrink-0 items-center gap-8 pl-8 font-display text-2xl uppercase tracking-tight md:text-3xl"
          >
            {name}
            <Sun size={28} weight="fill" className="text-flame" />
          </li>
        ))}
      </ul>
    </section>
  );
}
