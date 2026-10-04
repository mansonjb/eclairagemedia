import Link from "next/link";
import { semaines, joursDeSemaine, libelleSemaine, dateLongue, parDate, estWeekEnd, RUBRIQUES } from "@/lib/editions";
import { Section, TuileDate, jourMois } from "@/components/ui";

export const metadata = { title: "Archives" };

export default function Archives() {
  return (
    <main className="mx-auto max-w-5xl px-4">
      <section className="mt-4 rounded-[28px] bg-creme px-6 py-10 text-center">
        <span className="pastille bg-jaune text-encre">Archives</span>
        <h1 className="mt-4 text-[34px] font-extrabold sm:text-[44px]">Toutes les éditions, jour par jour</h1>
        <p className="mt-2 text-[15px] text-gris">Avec le récap de chaque semaine et de chaque week-end.</p>
      </section>
      <div className="mt-10 space-y-12">
        {semaines().map((s) => {
          const jours = joursDeSemaine(s).reverse();
          return (
            <section key={s}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Section couleur="#2f3cff">Semaine {libelleSemaine(s)}</Section>
                <div className="flex flex-wrap gap-2 text-[13px] font-extrabold">
                  <Link href={`/semaine/${s}`} className="rounded-full bg-white px-4 py-2 hover:bg-creme">Récap de la semaine</Link>
                  {jours.some(estWeekEnd) && <Link href={`/week-end/${s}`} className="rounded-full bg-white px-4 py-2 hover:bg-creme">Récap du week-end</Link>}
                </div>
              </div>
              <div className="carte mt-3 divide-y divide-filet px-4 py-1">
                {jours.map((d) => {
                  const { jour, mois } = jourMois(d);
                  return (
                    <Link key={d} href={`/jour/${d}`} className="group flex items-center gap-4 py-3">
                      <TuileDate jour={jour} mois={mois} couleur="#2f3cff" fond="#e8eaff" />
                      <div className="min-w-0">
                        <p className="font-extrabold group-hover:underline">{dateLongue(d)}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {parDate(d).map((e) => (
                            <span key={e.rubrique} className="pastille" style={{ backgroundColor: RUBRIQUES[e.rubrique].fond, color: RUBRIQUES[e.rubrique].couleur }}>{RUBRIQUES[e.rubrique].court}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
