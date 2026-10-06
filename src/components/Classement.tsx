import Portrait from "@/components/Portrait";
import type { Candidat } from "@/components/dyn/Candidats";

const MESURES = [
  { k: "sondage", nom: "Sondages", couleur: "#2f3cff" },
  { k: "polymarket", nom: "Paris Polymarket", couleur: "#14142b" },
  { k: "attention", nom: "Attention en ligne", couleur: "#ff6a3d" },
] as const;

// Vue d'ensemble : le Score Éclairage de chaque personnalité, décomposé en ses trois mesures pondérées
export default function Classement({ candidats, poids }: { candidats: Candidat[]; poids: Record<string, number> }) {
  const liste = candidats.filter((c) => c.score !== null);
  const max = Math.max(1, ...liste.map((c) => c.score ?? 0));
  return (
    <section className="carte flex flex-col gap-5 p-6 sm:p-8" aria-label="Classement de toutes les personnalités">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="pastille bg-lavande text-bleu">TOUT LE CLASSEMENT</span>
          <h2 className="d mt-3 text-[26px] leading-tight sm:text-[30px]">D&apos;où vient le score de chacun</h2>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-semibold">
          {MESURES.filter((m) => poids[m.k]).map((m) => (
            <li key={m.k} className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[4px]" style={{ backgroundColor: m.couleur }} />{m.nom} ({Math.round(poids[m.k] * 100)} %)</li>
          ))}
        </ul>
      </div>
      <ol className="flex flex-col gap-2.5">
        {liste.map((c, rang) => (
          <li key={c.nom} className="grid grid-cols-[22px_minmax(0,1fr)_40px] items-center gap-x-2.5 gap-y-1.5 sm:grid-cols-[26px_13rem_minmax(0,1fr)_44px] sm:gap-x-3">
            <span className="col-start-1 row-start-1 text-right text-[13px] font-extrabold tabular-nums text-gris">{rang + 1}</span>
            <span className="col-start-2 row-start-1 flex min-w-0 items-center gap-2.5">
              <Portrait nom={c.nom} couleur={c.couleur} className="h-9 w-9 rounded-full" texte="text-[12px]" />
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-extrabold sm:text-[15px]">{c.nom}</span>
                <span className="block truncate text-[11.5px] font-semibold text-gris">{c.etiquette}</span>
              </span>
            </span>
            <span className="col-span-2 col-start-2 row-start-2 flex h-5 overflow-hidden rounded-full bg-fond sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:h-6" title={`${c.nom} : ${c.score}/100`}>
              <span className="flex h-full" style={{ width: `${(100 * (c.score ?? 0)) / max}%` }}>
                {MESURES.filter((m) => poids[m.k]).map((m) => {
                  const part = (poids[m.k] * (c.composantes?.[m.k] ?? 0));
                  return part > 0 ? <span key={m.k} className="h-full" style={{ flexGrow: part, backgroundColor: m.couleur }} title={`${m.nom} : ${Math.round(c.composantes?.[m.k] ?? 0)}/100`} /> : null;
                })}
              </span>
            </span>
            <span className="d col-start-3 row-start-1 text-right text-[18px] tabular-nums sm:col-start-4 sm:text-[20px]">{c.score}</span>
          </li>
        ))}
      </ol>
      <p className="text-[12.5px] text-gris">Longueur de la barre : Score Éclairage sur 100. Chaque couleur montre ce qu&apos;apporte une mesure, une fois pondérée. Une personnalité non testée dans les sondages ou absente des paris n&apos;a pas de part pour cette mesure.</p>
    </section>
  );
}
