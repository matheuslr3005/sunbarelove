import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { STATS, type Stat } from "../content";

const fmt = new Intl.NumberFormat("pt-BR");

/** Número que sobe até o valor ao entrar na tela. Escreve direto no DOM, sem re-render. */
function CountUp({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (v: number) => {
      el.textContent = `${stat.prefix ?? ""}${fmt.format(Math.round(v))}`;
    };
    if (reduce || !inView) {
      write(reduce ? stat.value : 0);
      return;
    }
    const controls = animate(0, stat.value, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: write });
    return () => controls.stop();
  }, [inView, reduce, stat]);

  return (
    <span ref={ref} aria-label={`${stat.prefix ?? ""}${fmt.format(stat.value)}`}>
      {stat.prefix ?? ""}
      {fmt.format(stat.value)}
    </span>
  );
}

export function Proof() {
  return (
    <section aria-label="A festa em números" className="bg-night px-5 pb-16 md:px-8 md:pb-24">
      <dl className="mx-auto grid max-w-6xl gap-5 md:grid-cols-[1.4fr_1fr_1fr] md:gap-0">
        {STATS.map((s, i) => (
          <div key={s.label} className={`flex justify-end max-md:flex-row-reverse max-md:items-baseline max-md:gap-5 max-md:border-t max-md:border-cream/15 max-md:pt-5 md:flex-col-reverse ${i > 0 ? "md:border-l md:border-cream/15 md:pl-10" : ""}`}>
            <dt className="max-w-[16rem] text-cream/80 md:mt-2">{s.value === 1 && s.labelOne ? s.labelOne : s.label}</dt>
            <dd className="font-display text-[clamp(2.8rem,8vw,6.5rem)] leading-none text-sun">
              <CountUp stat={s} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
