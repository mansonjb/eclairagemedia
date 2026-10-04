import Link from "next/link";
import { semaines, joursDeSemaine, libelleSemaine, dateLongue, parDate, estWeekEnd, RUBRIQUES } from "@/lib/editions";

export const metadata = { title: "Archives" };

export default function Archives() {
  return (
    <main className="mx-auto max-w-4xl px-4 pt-12">
      <h1 className="font-serif text-5xl font-medium tracking-[-0.01em]">Archives</h1>
      <p className="mt-3 text-lg text-gris">Toutes les éditions, jour par jour, avec les récaps de la semaine et du week-end.</p>
      <div className="mt-12 space-y-14">
        {semaines().map((s) => {
          const jours = joursDeSemaine(s).reverse();
          return (
            <section key={s}>
              <div className="flex flex-wrap items-end justify-between gap-2 border-b border-encre pb-3">
                <h2 className="font-serif text-2xl font-medium">Semaine {libelleSemaine(s)}</h2>
                <div className="flex gap-5 text-sm">
                  <Link href={`/semaine/${s}`} className="underline decoration-soleil decoration-2 underline-offset-4">Récap de la semaine</Link>
                  {jours.some(estWeekEnd) && <Link href={`/week-end/${s}`} className="underline decoration-soleil decoration-2 underline-offset-4">Récap du week-end</Link>}
                </div>
              </div>
              <div className="divide-y divide-filet">
                {jours.map((d) => (
                  <Link key={d} href={`/jour/${d}`} className="group grid gap-2 py-4 sm:grid-cols-[220px_1fr]">
                    <span className="font-serif text-lg text-encre group-hover:underline decoration-soleil decoration-2 underline-offset-4">{dateLongue(d)}</span>
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gris">
                      {parDate(d).map((e) => (
                        <span key={e.rubrique} className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RUBRIQUES[e.rubrique].couleur }} />{RUBRIQUES[e.rubrique].court}</span>
                      ))}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
