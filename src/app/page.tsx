import Link from "next/link";
import { dates, parDate, dateLongue, semaineDe, libelleSemaine, RUBRIQUES, unesDuJour } from "@/lib/editions";
import { Section } from "@/components/ui";
import Journee from "@/components/Journee";
import Parcours from "@/components/Parcours";
import { UneProvider } from "@/components/dyn/Une";
import Lecteur from "@/components/dyn/Lecteur";
import { dernier, minutes } from "@/lib/podcasts";

export default function Accueil() {
  const [aujourdhui, ...avant] = dates();
  const semaine = semaineDe(aujourdhui);
  const ep = dernier();
  return (
    <main className="flex flex-col gap-5"><UneProvider n={unesDuJour(aujourdhui).length}>
      <section className="flex flex-wrap items-end justify-between gap-4 px-2 pb-2 pt-5 sm:gap-5 sm:pt-7">
        <div>
          <p className="text-[15px] font-semibold text-gris">{dateLongue(aujourdhui)}</p>
          <h1 className="d mt-1.5 text-balance text-[31px] leading-[1.08] sm:text-[52px] sm:leading-none">L&apos;essentiel en 5&nbsp;minutes, <span className="surligne whitespace-nowrap">sans prérequis.</span></h1>
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
      {ep && (
        <section className="carte mt-4 flex flex-col gap-4 p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="pastille bg-jaune text-encre">PODCAST · {minutes(ep.duree)}</span>
              <h2 className="d mt-3 text-[26px] leading-tight sm:text-[30px]">L&apos;édition politique{ep.date === aujourdhui ? " du jour" : ""}, à écouter</h2>
              <p className="mt-1 text-[15px] text-gris">Léa et Paul reprennent les sujets, à partir des faits vérifiés de l&apos;édition.</p>
            </div>
            <Link href="/podcast" className="rounded-full bg-fond px-4 py-2.5 text-[14px] font-bold hover:bg-lavande">Tous les épisodes →</Link>
          </div>
          <Lecteur src={ep.url} titre={ep.titre} duree={ep.duree} />
        </section>
      )}
    </main>
  );
}
