import Link from "next/link";
import { semaines, joursDeSemaine, libelleSemaine, dateLongue, parDate, estWeekEnd, RUBRIQUES } from "@/lib/editions";
import { Section, TuileDate, jourMois } from "@/components/ui";

export const metadata = { title: "Archives" };

export default function Archives() {
  return (
    <main className="flex flex-col gap-5 pt-7">
      <section className="px-2">
        <p className="text-[15px] font-semibold text-gris">Archives</p>
        <h1 className="d mt-1.5 text-[34px] leading-none sm:text-[52px]">Toutes les éditions, <span className="surligne">jour par jour.</span></h1>
      </section>
      {semaines().map((s) => {
        const jours = joursDeSemaine(s).reverse();
        return (
          <div key={s} className="flex flex-col gap-3">
            <Section lien={{ href: `/semaine/${s}`, texte: jours.some(estWeekEnd) ? "Récaps semaine et week-end" : "Récap de la semaine" }}>Semaine {libelleSemaine(s)}</Section>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {jours.map((d) => {
                const { jour, mois } = jourMois(d);
                return (
                  <Link key={d} href={`/jour/${d}`} className="carte flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
                    <TuileDate jour={jour} mois={mois} couleur="#2f3cff" fond="#e8eaff" />
                    <div className="min-w-0">
                      <p className="d text-[18px]">{dateLongue(d)}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {parDate(d).map((e) => <span key={e.rubrique} className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: RUBRIQUES[e.rubrique].couleur }} title={RUBRIQUES[e.rubrique].court} />)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </main>
  );
}
