import { useEffect, useState } from "react";
import type { Sale } from "../content";

function remaining(endsAt: string, now: number): string | null {
  const ms = new Date(endsAt).getTime() - now;
  if (!Number.isFinite(ms) || ms <= 0) return null;
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (d > 0) return `${d}d ${String(h).padStart(2, "0")}h`;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}min`;
  return `${m}min`;
}

/** Situação das vendas: lote atual com tempo para virar, ou esgotado. */
export function SaleBadge({ sale }: { sale: Sale }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!sale.lotEndsAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, [sale.lotEndsAt]);

  if (sale.status === "closed") return null;

  if (sale.status === "soldout") {
    return (
      <span className="inline-flex h-9 items-center rounded-full bg-rose px-4 text-sm font-bold uppercase tracking-wider text-cream">
        Esgotado
      </span>
    );
  }

  const left = sale.lotEndsAt ? remaining(sale.lotEndsAt, now) : null;
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-sun/60 px-4 text-sm font-semibold text-sun">
      {sale.lot ? `${sale.lot} à venda` : "Ingressos à venda"}
      {left && <span className="text-cream/80">Vira em {left}</span>}
    </span>
  );
}
