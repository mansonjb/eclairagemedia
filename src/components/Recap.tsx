import Link from "next/link";
import { ORDRE, RUBRIQUES, parDate, dateLongue } from "@/lib/editions";
import { Pastille } from "@/components/ui";

// Récap multi-jours : pour chaque rubrique, les sujets de chaque jour de la période
export default function Recap({ jours }: { jours: string[] }) {
  return (
    <div className="space-y-6">
      {ORDRE.map((r) => {
        const lignes = jours.flatMap((d) => parDate(d).filter((e) => e.rubrique === r));
        if (!lignes.length) return null;
        return (
          <section key={r} className="rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between gap-3"><Pastille r={r} /><Link href={`/${r}`} className="text-sm font-black" style={{ color: RUBRIQUES[r].couleur }}>Toute la rubrique →</Link></div>
            <div className="mt-4 divide-y divide-encre/10">
              {lignes.map((e) => (
                <div key={e.date} className="grid gap-2 py-3 sm:grid-cols-[150px_1fr]">
                  <Link href={`/${r}/${e.date}`} className="text-sm font-black text-gris hover:text-encre">{dateLongue(e.date).replace(/ \d{4}$/, "")}</Link>
                  <ul className="space-y-1">
                    {e.sujets.map((s) => (
                      <li key={s.n}><Link href={`/${r}/${e.date}`} className="font-extrabold leading-snug hover:underline">{s.titre}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
