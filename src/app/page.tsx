import Link from "next/link";
import { dates, parDate, dateLongue, semaineDe, libelleSemaine, RUBRIQUES } from "@/lib/editions";
import { Section } from "@/components/ui";
import Journee from "@/components/Journee";
import Parcours from "@/components/Parcours";
import { UneProvider } from "@/components/dyn/Une";

export default function Accueil() {
  const [aujourdhui, ...avant] = dates();
  const semaine = semaineDe(aujourdhui);
  return (
    <main className="flex flex-col gap-5"><UneProvider>
      <section className="flex flex-wrap items-end justify-between gap-5 px-2 pb-2 pt-7">
        <div>
          <p className="text-[15px] font-semibold text-gris">{dateLongue(aujourdhui)}</p>
          <h1 className="d mt-1.5 text-[34px] leading-none sm:text-[52px]">L&apos;essentiel en 5 minutes, <span className="surligne">sans prérequis.</span></h1>
        </div>
        <Parcours date={aujourdhui} />
      </section>

      <Journee date={aujourdhui} /></UneProvider>

      <Section lien={{ href: `/semaine/${semaine}`, texte: `La semaine ${libelleSemaine(semaine)}` }}>Les jours précédents</Section>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {avant.slice(0, 6).map((d) => (
          <Link key={d} href={`/jour/${d}`} className="carte flex min-w-0 flex-col gap-2 p-5 transition hover:-translate-y-0.5">
            <p className="d text-[20px]">{dateLongue(d)}</p>
            {parDate(d).slice(0, 3).map((e) => (
              <p key={e.rubrique} className="flex gap-2.5 truncate text-[14px] text-gris">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[3px]" style={{ backgroundColor: RUBRIQUES[e.rubrique].couleur }} />
                <span className="truncate">{e.sujets[0]?.titre}</span>
              </p>
            ))}
          </Link>
        ))}
      </div>
    </main>
  );
}
