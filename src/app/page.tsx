import Link from "next/link";
import { ORDRE, RUBRIQUES, dates, parDate, dateLongue, semaineDe, libelleSemaine } from "@/lib/editions";
import { TitreSection } from "@/components/ui";
import Une from "@/components/Une";
import Inscription from "@/components/Inscription";

export default function Accueil() {
  const [aujourdhui, ...avant] = dates();
  const semaine = semaineDe(aujourdhui);
  return (
    <main>
      <Une date={aujourdhui} />

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <TitreSection sur="Les éditions précédentes" lien={{ href: `/semaine/${semaine}`, texte: `La semaine ${libelleSemaine(semaine)}` }}>Jour par jour</TitreSection>
        <div className="mt-2 divide-y divide-filet">
          {avant.slice(0, 6).map((d) => {
            const titres = parDate(d).map((e) => e.sujets[0]?.titre).filter(Boolean).slice(0, 2);
            return (
              <Link key={d} href={`/jour/${d}`} className="group grid gap-2 py-5 sm:grid-cols-[220px_1fr]">
                <span className="font-serif text-lg font-medium text-encre">{dateLongue(d)}</span>
                <span className="text-[15px] leading-snug text-gris group-hover:text-texte">{titres.join(" · ")}</span>
              </Link>
            );
          })}
        </div>
        <Link href="/archives" className="mt-4 inline-block text-sm font-medium underline decoration-filet decoration-2 underline-offset-4 hover:decoration-soleil">Toutes les archives</Link>
      </section>

      <section id="rubriques" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-20">
        <TitreSection sur="Un rendez-vous chaque matin">Six rubriques</TitreSection>
        <div className="mt-2 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {ORDRE.map((r) => (
            <Link key={r} href={`/${r}`} className="group border-b border-filet py-6">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-xl font-medium text-encre group-hover:underline decoration-soleil decoration-2 underline-offset-4">{RUBRIQUES[r].nom}</span>
                <span className="text-xs text-gris">{RUBRIQUES[r].heure}</span>
              </div>
              <span className="mt-2 block h-0.5 w-8" style={{ backgroundColor: RUBRIQUES[r].couleur }} />
              <p className="mt-3 text-[15px] leading-relaxed text-gris">{RUBRIQUES[r].accroche}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="methode" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-20">
        <TitreSection sur="Notre méthode">Des faits vérifiés, des positions rapportées, aucune consigne</TitreSection>
        <div className="mt-8 grid gap-10 sm:grid-cols-3">
          {[
            ["Trois sources au minimum", "Chaque fait est confirmé par au moins trois sources indépendantes, dont une officielle : institution, publication scientifique ou dépêche d'agence. Sinon, il est retiré ou signalé."],
            ["Des citations exactes", "Une phrase entre guillemets a été retrouvée mot pour mot dans le texte d'origine. Sinon, elle est résumée, sans guillemets."],
            ["La pédagogie d'abord", "Chaque sujet a son encadré « L'éclairage » : le mécanisme, le contexte et les mots pour suivre, même en partant de zéro."],
          ].map(([t, d], i) => (
            <div key={t}>
              <p className="font-serif text-4xl text-filet">0{i + 1}</p>
              <p className="mt-3 font-serif text-xl font-medium text-encre">{t}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-gris">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="inscription" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-20">
        <div className="grid gap-10 border-t border-encre pt-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="font-serif text-3xl font-medium">Recevoir <span className="halo">Éclairage</span></h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gris">Choisissez vos rubriques. Les newsletters arrivent chaque matin entre 6h30 et 8h30. C&apos;est gratuit.</p>
          </div>
          <Inscription />
        </div>
      </section>
    </main>
  );
}
