import type { LineupGroup } from "../content";

/** Line-up em blocos: rótulo pequeno (quando houver) e os nomes. */
export function Lineup({ groups, large = false }: { groups?: LineupGroup[]; large?: boolean }) {
  if (!groups?.length) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-flame">Line-up</h4>
      <ul className="mt-3 grid gap-4">
        {groups.map((g) => (
          <li key={`${g.label ?? ""}-${g.names.join()}`}>
            {g.label && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sun">{g.label}</p>}
            <ul className="flex flex-wrap gap-2">
              {g.names.map((n) => (
                <li
                  key={n}
                  className={`rounded-full border border-cream/30 font-semibold ${large ? "px-5 py-2 text-lg" : "px-4 py-1.5"}`}
                >
                  {n}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
