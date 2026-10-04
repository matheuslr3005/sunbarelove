import { useEffect, useState } from "react";

const HOUR = 3_600_000;

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function Countdown({ startsAt }: { startsAt: string }) {
  const target = new Date(startsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = target - now;
  if (diff <= 0) {
    return (
      <p className="font-display text-3xl uppercase text-sun">
        {diff > -8 * HOUR ? "Rolando agora" : "Edição encerrada"}
      </p>
    );
  }

  const { d, h, m, s } = parts(diff);
  const cells = [
    { v: d, l: "dias" },
    { v: h, l: "horas" },
    { v: m, l: "min" },
    { v: s, l: "seg" },
  ];

  return (
    <div role="timer" aria-label="Tempo até o evento" className="grid max-w-md grid-cols-4 gap-2">
      {cells.map((c) => (
        <div key={c.l} className="rounded-2xl bg-deep/60 px-2 py-3 text-center ring-1 ring-cream/10">
          <div className="font-display text-4xl leading-none tabular-nums text-sun md:text-5xl">
            {String(c.v).padStart(2, "0")}
          </div>
          <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-cream/70">{c.l}</div>
        </div>
      ))}
    </div>
  );
}
