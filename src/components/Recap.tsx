import Link from "next/link";
import { ORDRE, RUBRIQUES, parDate } from "@/lib/editions";
import { Section, Visuel, TuileDate, jourMois } from "@/components/ui";

// Récap d'une période : par rubrique, chaque jour avec sa photo et ses sujets
export default function Recap({ jours }: { jours: string[] }) {
  return (
    <div className="flex flex-col gap-5">
      {ORDRE.map((r) => {
        const lignes = jours.flatMap((d) => parDate(d).filter((e) => e.rubrique === r));
        if (!lignes.length) return null;
        const R = RUBRIQUES[r];
        return (
          <div key={r} className="flex flex-col gap-3">
            <Section lien={{ href: `/${r}`, texte: "Toute la rubrique" }}>{R.nom}</Section>
            {lignes.map((e) => {
              const { jour, mois } = jourMois(e.date);
              return (
                <Link key={e.date} href={`/${r}/${e.date}`} className="carte grid gap-4 p-3 transition hover:-translate-y-0.5 sm:grid-cols-[200px_64px_1fr] sm:items-center">
                  {e.sujets[0]?.image && <Visuel s={e.sujets[0]} credit={false} className="hidden aspect-[16/10] sm:block" />}
                  <TuileDate jour={jour} mois={mois} couleur={R.couleur} fond={R.fond} />
                  <ul className="space-y-1.5 px-2 pb-2 sm:p-0">
                    {e.sujets.map((s, i) => (
                      <li key={s.n} className={i === 0 ? "d text-[19px] leading-snug" : "flex gap-2.5 text-[14px] leading-snug text-gris"}>
                        {i > 0 && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[3px]" style={{ backgroundColor: R.couleur }} />}{s.titre}
                      </li>
                    ))}
                  </ul>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
