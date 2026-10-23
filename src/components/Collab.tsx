import { motion } from "motion/react";
import { BaseballCap, Hoodie, TShirt, ArrowUpRight } from "@phosphor-icons/react";
import { COLLAB, type CollabPiece } from "../content";
import { track } from "../analytics";
import { Reveal } from "./Reveal";

const KIND = {
  moletom: { Icon: Hoodie, label: "Moletom", bg: "#ff6a2b" },
  camiseta: { Icon: TShirt, label: "Camiseta", bg: "#19a7c9" },
  bone: { Icon: BaseballCap, label: "Boné", bg: "#f0286e" },
} as const;

const MYSTERY: CollabPiece[] = [
  { name: "Moletom", kind: "moletom" },
  { name: "Camiseta", kind: "camiseta" },
  { name: "Boné", kind: "bone" },
];

function PieceCard({ piece, index }: { piece: CollabPiece; index: number }) {
  const { Icon, bg } = KIND[piece.kind];
  const mystery = !piece.photo;
  return (
    <Reveal delay={0.1 + index * 0.1}>
      <motion.div whileHover={{ y: -8, rotate: index % 2 ? 1.5 : -1.5 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
        <div className="relative aspect-square overflow-hidden rounded-card ring-1 sm:aspect-[5/6] ring-cream/20" style={{ backgroundColor: bg }}>
          {piece.photo ? (
            <img src={piece.photo} alt={piece.name} loading="lazy" className="size-full object-cover" />
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,rgba(255,241,214,0.14)_0_6deg,transparent_6deg_12deg)]"
              />
              <Icon size={150} weight="fill" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-deep/85" />
              <span
                aria-hidden="true"
                className="absolute right-4 top-3 font-display text-5xl text-cream [text-shadow:0_3px_0_rgba(4,23,30,0.35)]"
              >
                ?
              </span>
            </>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-xl uppercase leading-tight">{piece.name}</h3>
          <span className="rounded-full border border-cream/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream/80">
            {mystery ? "Em breve" : piece.price ?? "Collab"}
          </span>
        </div>
      </motion.div>
    </Reveal>
  );
}

/** Destaque da coleção de roupas feita em parceria com outra marca. */
export function Collab() {
  const pieces = COLLAB.pieces.length ? COLLAB.pieces : MYSTERY;
  return (
    <section
      id="collab"
      className="relative overflow-clip bg-[linear-gradient(to_bottom,#0b3341,#07232c)] px-5 py-20 md:px-8 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(240,40,110,0.28),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">Edição de 7 anos</p>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-balance">
            {COLLAB.partner ? (
              <>
                Sun, Bar &amp; Love <span className="text-rose">×</span> {COLLAB.partner}
              </>
            ) : (
              <>
                Nossa nova <span className="text-rose">collab</span>
              </>
            )}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">{COLLAB.blurb}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
          {pieces.map((p, i) => (
            <PieceCard key={p.name} piece={p} index={i} />
          ))}
        </div>

        <Reveal delay={0.3} className="mt-10">
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
            <span className="inline-flex h-12 cursor-not-allowed items-center rounded-full border border-cream/30 px-6 font-semibold text-cream/70" aria-disabled="true">
              {COLLAB.launch}
            </span>
          )}
        </Reveal>
      </div>
    </section>
  );
}
