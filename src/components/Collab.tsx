import { ArrowUpRight } from "@phosphor-icons/react";
import { COLLAB } from "../content";
import { track } from "../analytics";
import { Reveal } from "./Reveal";

/** Destaque da coleção de roupas feita em parceria com a Approve. */
export function Collab() {
  return (
    <section
      id="collab"
      className="relative overflow-clip bg-[linear-gradient(to_bottom,#0b3341,#07232c)] px-5 py-20 md:px-8 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,194,26,0.2),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">Collab</p>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,7vw,5.6rem)] uppercase leading-[0.95] tracking-tight text-balance">
            Sun, Bar &amp; Love <span className="text-sun">×</span> {COLLAB.partner}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/85">{COLLAB.blurb}</p>
        </Reveal>

        <Reveal delay={0.12} className="mt-10">
          <img
            src={COLLAB.image}
            alt={COLLAB.imageAlt}
            width={1600}
            height={1066}
            loading="lazy"
            className="w-full rounded-card shadow-[0_40px_90px_-30px_rgba(4,23,30,0.95)] ring-1 ring-cream/20"
          />
        </Reveal>

        <Reveal delay={0.2} className="mt-8">
          {COLLAB.url ? (
            <a
              href={COLLAB.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("shop_click", { product_id: "collab" })}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-sun px-6 font-semibold text-deep transition hover:bg-[#ffd24d] active:scale-[0.97]"
            >
              Ver a coleção <ArrowUpRight size={18} />
            </a>
          ) : (
            <span
              className="inline-flex h-12 cursor-not-allowed items-center rounded-full border border-cream/30 px-6 font-semibold text-cream/70"
              aria-disabled="true"
            >
              {COLLAB.launch}
            </span>
          )}
        </Reveal>
      </div>
    </section>
  );
}
