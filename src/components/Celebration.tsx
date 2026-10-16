import { useId, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { Confetti } from "@phosphor-icons/react";

type Balloon =
  | { kind: "foil"; left: string; width: number; seconds: number; delay: number }
  | { kind: "round"; color: string; left: string; width: number; seconds: number; delay: number };

/** Balões que sobem pela tela. Os dois com o "7" são os de aniversário; o resto é cor de festa. */
const BALLOONS: Balloon[] = [
  { kind: "foil", left: "4%", width: 120, seconds: 30, delay: -13 },
  { kind: "round", color: "#f0286e", left: "19%", width: 70, seconds: 24, delay: -6 },
  { kind: "round", color: "#19a7c9", left: "35%", width: 56, seconds: 28, delay: -17 },
  { kind: "round", color: "#fff1d6", left: "47%", width: 48, seconds: 26, delay: -3 },
  { kind: "foil", left: "52%", width: 150, seconds: 34, delay: -20 },
  { kind: "round", color: "#ffc21a", left: "75%", width: 76, seconds: 25, delay: -10 },
  { kind: "round", color: "#ff6a2b", left: "89%", width: 62, seconds: 29, delay: -22 },
];

const CONFETTI_COLORS = ["#ffc21a", "#f0286e", "#19a7c9", "#ff6a2b", "#fff1d6"];

/** 24 pedaços de confete com posição, tempo e cor repetíveis (sem aleatório, para não mudar a cada render). */
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  seconds: 9 + ((i * 5) % 7),
  delay: -((i * 7) % 11) * 0.9,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  tall: 10 + (i % 3) * 4,
}));

const RIBBON_PHRASES = ["7 anos de Sun, Bar & Love", "7 de novembro", "Parabéns pra gente"];

function RoundBalloon({ color }: { color: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 150" className="block w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="28%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.82" />
        </radialGradient>
      </defs>
      <path d="M50 104 C38 118 62 132 50 150" fill="none" stroke="#fff1d6" strokeOpacity="0.6" strokeWidth="1.6" />
      <ellipse cx="50" cy="52" rx="40" ry="48" fill={`url(#${id})`} />
      <path d="M44 99 L56 99 L50 108 Z" fill={color} />
      <ellipse cx="34" cy="30" rx="7" ry="12" fill="#fff" opacity="0.4" transform="rotate(24 34 30)" />
    </svg>
  );
}

/** Balão metalizado em forma de "7", feito com a fonte da marca. */
function FoilSeven() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 140 240" className="block w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff3a8" />
          <stop offset="45%" stopColor="#ffc21a" />
          <stop offset="100%" stopColor="#ff8a1f" />
        </linearGradient>
      </defs>
      <path d="M70 192 C58 208 82 222 70 240" fill="none" stroke="#fff1d6" strokeOpacity="0.65" strokeWidth="2" />
      <g fontFamily="var(--font-display)" fontSize="215" textAnchor="middle" strokeLinejoin="round">
        <text x="70" y="182" fill="#d97a00" stroke="#d97a00" strokeWidth="20">7</text>
        <text x="70" y="182" fill={`url(#${id})`} stroke="#ffe27a" strokeWidth="6" paintOrder="stroke">7</text>
        <text x="62" y="170" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round">7</text>
      </g>
    </svg>
  );
}

/**
 * Festa de aniversário passando pelo Hero: balões subindo, confete caindo e uma faixa de
 * "7 anos" cruzando a tela. Fica atrás do texto e da foto, e some com "reduzir movimento"
 * (a faixa continua lá, parada).
 */
export function Celebration({ revealed }: { revealed: boolean }) {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden={reduce ? undefined : "true"}>
      {revealed && !reduce && (
        <>
          {CONFETTI.map((c, i) => (
            <div
              key={`c${i}`}
              className="confetti-fall absolute top-0 h-full w-3"
              style={{ left: c.left, "--seconds": `${c.seconds}s`, "--delay": `${c.delay}s` } as CSSProperties}
            >
              <span className="confetti-spin block w-2 rounded-[2px] opacity-90" style={{ height: c.tall, background: c.color }} />
            </div>
          ))}

          {BALLOONS.map((b, i) => (
            <div
              key={`b${i}`}
              className="balloon-rise absolute top-0 flex h-full items-end"
              style={{ left: b.left, "--seconds": `${b.seconds}s`, "--delay": `${b.delay}s` } as CSSProperties}
            >
              <div
                className="balloon-sway w-[calc(var(--w)*0.62px)] drop-shadow-[0_14px_18px_rgba(4,23,30,0.35)] md:w-[calc(var(--w)*1px)]"
                style={{ "--w": b.width } as CSSProperties}
              >
                {b.kind === "foil" ? <FoilSeven /> : <RoundBalloon color={b.color} />}
              </div>
            </div>
          ))}
        </>
      )}

      {/* faixa que cruza o Hero */}
      <div
        className="absolute -left-[10%] bottom-[9%] w-[120%] -rotate-[4deg] overflow-hidden border-y-[3px] border-cream bg-[linear-gradient(90deg,#f0286e,#ff6a2b)] py-3 text-cream shadow-[0_18px_40px_-14px_rgba(4,23,30,0.6)] md:py-4"
        aria-hidden={reduce ? undefined : "true"}
      >
        <ul className="ribbon-track">
          {[0, 1, 2, 3].flatMap((round) =>
            RIBBON_PHRASES.map((phrase) => (
              <li
                key={`${round}-${phrase}`}
                aria-hidden={round > 0 ? "true" : undefined}
                className="flex shrink-0 items-center gap-6 pl-6 font-display text-xl uppercase tracking-tight md:gap-8 md:pl-8 md:text-3xl"
              >
                {phrase}
                <Confetti size={26} weight="fill" className="text-sun" />
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
}
