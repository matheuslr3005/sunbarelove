import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

const CENTER = 200;

/** Pontas do selo: alterna raio de fora e de dentro em volta do centro. */
const starPath = (points: number, outer: number, inner: number) =>
  Array.from({ length: points * 2 }, (_, i) => {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outer : inner;
    return `${i === 0 ? "M" : "L"}${(CENTER + radius * Math.cos(angle)).toFixed(1)},${(CENTER + radius * Math.sin(angle)).toFixed(1)}`;
  }).join(" ") + "Z";

const BURST = starPath(24, 198, 168);
const RING_RADIUS = 124;
const RING_TEXT = "7 ANOS DE SUN, BAR & LOVE • PARABÉNS PRA GENTE • ";
const RING_FONT = 19;

const CONFETTI = [
  { x: 6, y: 120, w: 22, h: 9, r: 25, c: "#f0286e" },
  { x: 372, y: 190, w: 20, h: 9, r: -30, c: "#19a7c9" },
  { x: 30, y: 312, w: 18, h: 18, r: 0, c: "#ffc21a", round: true },
  { x: 356, y: 322, w: 24, h: 9, r: 40, c: "#ff6a2b" },
  { x: 120, y: -14, w: 18, h: 8, r: -20, c: "#19a7c9" },
  { x: 250, y: 396, w: 20, h: 9, r: 15, c: "#f0286e" },
  { x: 392, y: 70, w: 14, h: 14, r: 0, c: "#fff1d6", round: true },
  { x: -10, y: 214, w: 14, h: 14, r: 0, c: "#ff6a2b", round: true },
  { x: 70, y: 392, w: 22, h: 8, r: -35, c: "#ffc21a" },
  { x: 330, y: -6, w: 16, h: 16, r: 0, c: "#f0286e", round: true },
];

/**
 * Selo dos 7 anos: sol de raios, anel de texto girando, o "7" no centro, chapéu de festa
 * e uma faixa com a data. Desenhado em SVG para ficar nítido em qualquer tamanho.
 */
export function Anniversary({ revealed, className = "" }: { revealed: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const ringId = `ring-${uid}`;
  const burstFill = `burst-${uid}`;
  const discFill = `disc-${uid}`;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.4, rotate: -24 }}
      animate={revealed ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.4, rotate: -24 }}
      transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.7 }}
      role="img"
      aria-label="Sun, Bar & Love faz 7 anos em 7 de novembro"
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <svg viewBox="-30 -30 460 460" className="block w-full overflow-visible drop-shadow-[0_24px_40px_rgba(4,23,30,0.55)]" aria-hidden="true">
          <defs>
            <radialGradient id={burstFill} cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="#ffd23f" />
              <stop offset="100%" stopColor="#ff9a1f" />
            </radialGradient>
            <radialGradient id={discFill} cx="50%" cy="62%" r="62%">
              <stop offset="0%" stopColor="#f0286e" />
              <stop offset="60%" stopColor="#ff4e5a" />
              <stop offset="100%" stopColor="#ff7a2b" />
            </radialGradient>
            <path id={ringId} d={`M${CENTER},${CENTER} m${-RING_RADIUS},0 a${RING_RADIUS},${RING_RADIUS} 0 1,1 ${RING_RADIUS * 2},0 a${RING_RADIUS},${RING_RADIUS} 0 1,1 ${-RING_RADIUS * 2},0`} />
          </defs>

          {CONFETTI.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              rx={p.round ? p.w / 2 : 3}
              fill={p.c}
              transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
              className="confetti"
              style={{ animationDelay: `${(i % 5) * -0.7}s` }}
            />
          ))}

          <path d={BURST} fill={`url(#${burstFill})`} stroke="#04171e" strokeWidth="5" strokeLinejoin="round" />
          <circle cx={CENTER} cy={CENTER} r="156" fill="#07232c" stroke="#fff1d6" strokeWidth="5" />

          <g className="sun-spin" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <text fontFamily="var(--font-display)" fontSize={RING_FONT} fill="#ffc21a">
              <textPath href={`#${ringId}`} textLength={2 * Math.PI * RING_RADIUS - 4} lengthAdjust="spacing">
                {RING_TEXT}
              </textPath>
            </text>
          </g>

          <circle cx={CENTER} cy={CENTER} r="106" fill={`url(#${discFill})`} stroke="#fff1d6" strokeWidth="5" />

          <g fontFamily="var(--font-display)" textAnchor="middle" strokeLinejoin="round">
            <text x={CENTER + 10} y="258" fontSize="176" fill="#f0286e" stroke="#04171e" strokeWidth="14" paintOrder="stroke">7</text>
            <text x={CENTER + 5} y="253" fontSize="176" fill="#ff6a2b" stroke="#04171e" strokeWidth="14" paintOrder="stroke">7</text>
            <text x={CENTER} y="248" fontSize="176" fill="#fff1d6" stroke="#04171e" strokeWidth="14" paintOrder="stroke">7</text>
            <text x={CENTER} y="293" fontSize="38" fill="#fff1d6" stroke="#04171e" strokeWidth="8" paintOrder="stroke" letterSpacing="3">ANOS</text>
          </g>

          {/* chapéu de festa */}
          <g transform="translate(350 34) rotate(28) scale(0.92)">
            <path d="M-34 66 L0 -44 L34 66 Z" fill="#f0286e" stroke="#04171e" strokeWidth="5" strokeLinejoin="round" />
            <path d="M-21 28 L21 28 L26 44 L-26 44 Z" fill="#fff1d6" opacity="0.92" />
            <path d="M-11 -4 L11 -4 L15 8 L-15 8 Z" fill="#ffc21a" />
            <ellipse cx="0" cy="66" rx="42" ry="9" fill="#ffc21a" stroke="#04171e" strokeWidth="5" />
            <circle cx="0" cy="-48" r="11" fill="#fff1d6" stroke="#04171e" strokeWidth="5" />
          </g>

          {/* faixa com a data */}
          <g transform="rotate(-4 200 352)">
            <rect x="66" y="326" width="268" height="56" rx="28" fill="#fff1d6" stroke="#04171e" strokeWidth="5" />
            <text x={CENTER} y="364" textAnchor="middle" fontFamily="var(--font-display)" fontSize="26" fill="#04171e" letterSpacing="0.5">
              7 DE NOVEMBRO
            </text>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
