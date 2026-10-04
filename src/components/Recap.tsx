import Link from "next/link";
import { ORDRE, RUBRIQUES, parDate } from "@/lib/editions";
import { Section, Visuel, TuileDate, jourMois } from "@/components/ui";
import { Icone } from "@/components/Icones";

// Récap d'une période : par rubrique, chaque jour avec sa photo et ses sujets
export default function Recap({ jours }: { jours: string[] }) {
  return (
    <div className="space-y-12">
      {ORDRE.map((r) => {
        const lignes = jours.flatMap((d) => parDate(d).filter((e) => e.rubrique === r));
        if (!lignes.length) return null;
        const R = RUBRIQUES[r];
        return (
          <section key={r}>
            <Section couleur={R.couleur}><span className="inline-flex items-center gap-2"><Icone r={r} className="h-4 w-4" />{R.nom}</span></Section>
            <div className="mt-3 space-y-3">
              {lignes.map((e) => {
                const { jour, mois } = jourMois(e.date);
                return (
                  <Link key={e.date} href={`/${r}/${e.date}`} className="carte grid gap-4 p-4 transition hover:-translate-y-0.5 sm:grid-cols-[64px_200px_1fr]">
                    <TuileDate jour={jour} mois={mois} couleur={R.couleur} fond={R.fond} />
                    {e.sujets[0] && <Visuel s={e.sujets[0]} r={r} className="hidden aspect-[16/10] sm:block" />}
                    <ul className="space-y-2">
                      {e.sujets.map((s, i) => (
                        <li key={s.n} className={i === 0 ? "text-[18px] font-extrabold leading-snug" : "flex gap-2 text-[14.5px] leading-snug text-gris"}>
                          {i > 0 && <span className="font-extrabold" style={{ color: R.couleur }}>→</span>}{s.titre}
                        </li>
                      ))}
                    </ul>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
