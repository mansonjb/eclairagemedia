import Portrait from "@/components/Portrait";
import type { Candidat } from "@/components/dyn/Candidats";
import { parSondage, pct, pctPm, ordinal, rangsAttention } from "@/lib/barometre";

// Vue d'ensemble : les trois mesures côte à côte, telles qu'elles sont publiées, sans note globale
export default function Classement({ candidats }: { candidats: Candidat[] }) {
  const liste = parSondage(candidats);
  const max = Math.max(1, ...liste.map((c) => c.sondage?.v ?? 0));
  const ra = rangsAttention(candidats);
  return (
    <section className="carte flex flex-col gap-5 p-6 sm:p-8" aria-label="Toutes les personnalités et leurs trois mesures">
      <div>
        <span className="pastille bg-lavande text-bleu">TOUTES LES PERSONNALITÉS</span>
        <h2 className="d mt-3 text-[26px] leading-tight sm:text-[30px]">Trois mesures, côte à côte</h2>
        <p className="mt-1.5 text-[14.5px] text-gris">Classement par sondages. Pas de note globale : chaque mesure dit autre chose et n&apos;a pas le même poids de preuve.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="text-[11.5px] font-extrabold tracking-[0.04em] text-gris">
              <th className="w-8 pb-2 font-extrabold">#</th>
              <th className="pb-2 font-extrabold">PERSONNALITÉ</th>
              <th className="pb-2 font-extrabold" style={{ color: "#2f3cff" }}>SONDAGES 1er TOUR</th>
              <th className="w-24 pb-2 text-right font-extrabold">POLYMARKET</th>
              <th className="w-24 pb-2 text-right font-extrabold" style={{ color: "#ff6a3d" }}>ATTENTION</th>
            </tr>
          </thead>
          <tbody>
            {liste.map((c, k) => (
              <tr key={c.nom} className="border-t border-filet">
                <td className="py-2.5 text-[13px] font-extrabold tabular-nums text-gris">{c.sondage ? k + 1 : ""}</td>
                <td className="py-2.5 pr-3">
                  <span className="flex items-center gap-2.5">
                    <Portrait nom={c.nom} couleur={c.couleur} className="h-9 w-9 rounded-full" texte="text-[12px]" />
                    <span className="min-w-0"><span className="block truncate text-[14.5px] font-extrabold">{c.nom}</span><span className="block truncate text-[11.5px] font-semibold text-gris">{c.etiquette}</span></span>
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  {c.sondage ? (
                    <span className="flex items-center gap-2.5">
                      <span className="h-5 flex-1 overflow-hidden rounded-full bg-fond"><span className="block h-full rounded-full bg-bleu" style={{ width: `${(100 * c.sondage.v) / max}%` }} /></span>
                      <span className="d w-16 text-right text-[17px] tabular-nums">{pct(c.sondage.v)}</span>
                    </span>
                  ) : <span className="text-[13px] font-semibold text-gris-clair">non testé dans les sondages</span>}
                </td>
                <td className="py-2.5 text-right text-[15px] font-extrabold tabular-nums">{c.polymarket ? pctPm(c.polymarket.v) : <span className="text-[13px] font-semibold text-gris-clair">non coté</span>}</td>
                <td className="py-2.5 text-right text-[15px] font-extrabold tabular-nums">{ra[c.nom] ? ordinal(ra[c.nom]) : <span className="text-[13px] font-semibold text-gris-clair">n.m.</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12.5px] text-gris">Sondages : intentions de vote au premier tour, moyenne sur 30 jours ; un écart de moins de 2 points n&apos;est pas significatif. Polymarket : probabilité de victoire selon les parieurs. Attention : rang parmi les personnalités suivies (bruit en ligne, pas soutien).</p>
    </section>
  );
}
