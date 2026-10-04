import Link from "next/link";
import { ORDRE, RUBRIQUES, parDate, dateLongue } from "@/lib/editions";
import { Kicker, Visuel } from "@/components/ui";

// Récap multi-jours : pour chaque rubrique, les sujets de chaque jour de la période
export default function Recap({ jours }: { jours: string[] }) {
  return (
    <div className="space-y-16">
      {ORDRE.map((r) => {
        const lignes = jours.flatMap((d) => parDate(d).filter((e) => e.rubrique === r));
        if (!lignes.length) return null;
        return (
          <section key={r}>
            <div className="flex items-end justify-between border-b border-encre pb-3">
              <h2 className="font-serif text-2xl font-medium">{RUBRIQUES[r].nom}</h2>
              <Link href={`/${r}`} className="text-sm text-gris hover:text-encre">Toute la rubrique</Link>
            </div>
            <div className="divide-y divide-filet">
              {lignes.map((e) => (
                <Link key={e.date} href={`/${r}/${e.date}`} className="group grid grid-cols-[80px_1fr] gap-5 py-5 sm:grid-cols-[140px_1fr]">
                  {e.sujets[0] && <Visuel s={e.sujets[0]} r={r} className="aspect-[4/3] w-full rounded-sm" />}
                  <div>
                    <Kicker r={r}>{dateLongue(e.date).replace(/ \d{4}$/, "")}</Kicker>
                    <ul className="mt-2 space-y-1.5">
                      {e.sujets.map((s, i) => (
                        <li key={s.n} className={i === 0 ? "font-serif text-lg font-medium leading-snug text-encre group-hover:underline decoration-soleil decoration-2 underline-offset-4" : "text-[15px] leading-snug text-gris"}>{s.titre}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
