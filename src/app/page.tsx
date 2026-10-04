import Link from "next/link";
import { ORDRE, RUBRIQUES, dates, parDate, dateLongue, semaineDe, libelleSemaine } from "@/lib/editions";
import { Section, TuileDate, jourMois } from "@/components/ui";
import { Icone } from "@/components/Icones";
import Journee from "@/components/Journee";
import Inscription from "@/components/Inscription";

export default function Accueil() {
  const [aujourdhui, ...avant] = dates();
  const semaine = semaineDe(aujourdhui);
  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* En-tête façon newsletter */}
      <section className="relative mt-4 overflow-hidden rounded-[28px] bg-creme px-6 py-12 text-center sm:px-12 sm:py-16">
        <span className="halo pointer-events-none absolute left-1/2 top-0 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/3 rounded-full" />
        <div className="relative">
          <span className="pastille bg-jaune text-encre">{dateLongue(aujourdhui)}</span>
          <h1 className="mx-auto mt-6 max-w-3xl text-[34px] font-extrabold leading-[1.08] sm:text-[52px]">Vous avez décroché de l&apos;actualité ? On reprend depuis le début.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] font-semibold leading-relaxed">Un sujet, son contexte, les faits et les différentes positions.</p>
          <p className="mx-auto mt-1 max-w-2xl text-[15px] text-gris">Chaque matin, six newsletters gratuites, neutres et pédagogiques. Chaque fait est confirmé par au moins trois sources.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="#inscription" className="rounded-full bg-encre px-6 py-3 text-sm font-extrabold text-jaune hover:bg-black">Recevoir Éclairage</Link>
            <Link href={`/jour/${aujourdhui}`} className="rounded-full border border-encre/20 bg-white px-6 py-3 text-sm font-extrabold hover:border-encre">Lire l&apos;édition du jour</Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {ORDRE.map((r) => (
              <Link key={r} href={`/${r}`} className="flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-bold" style={{ backgroundColor: RUBRIQUES[r].fond, color: RUBRIQUES[r].couleur }}>
                <Icone r={r} className="h-4 w-4" />{RUBRIQUES[r].court}<span className="font-semibold opacity-70">{RUBRIQUES[r].heure}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-12"><Journee date={aujourdhui} /></div>

      {/* Jour par jour */}
      <section className="mt-12">
        <Section couleur="#2f3cff">Jour par jour</Section>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {avant.slice(0, 6).map((d) => {
            const { jour, mois } = jourMois(d);
            const eds = parDate(d);
            return (
              <Link key={d} href={`/jour/${d}`} className="carte flex min-w-0 gap-4 p-4 transition hover:-translate-y-0.5">
                <TuileDate jour={jour} mois={mois} couleur="#2f3cff" fond="#e8eaff" />
                <div className="min-w-0">
                  <p className="font-extrabold">{dateLongue(d)}</p>
                  <ul className="mt-1.5 space-y-1">
                    {eds.slice(0, 3).map((e) => (
                      <li key={e.rubrique} className="truncate text-[14px] text-gris">
                        <span className="font-extrabold" style={{ color: RUBRIQUES[e.rubrique].couleur }}>→ </span>{e.sujets[0]?.titre}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm font-extrabold text-bleu">
          <Link href={`/semaine/${semaine}`}>L&apos;édition de la semaine ({libelleSemaine(semaine)}) →</Link>
          <Link href="/archives">Toutes les archives →</Link>
        </div>
      </section>

      {/* Méthode */}
      <section id="methode" className="mt-12 scroll-mt-6 rounded-[28px] bg-encre px-6 py-10 sm:px-10">
        <span className="pastille bg-jaune text-encre">Notre méthode</span>
        <h2 className="mt-4 max-w-2xl text-[28px] font-extrabold leading-tight text-white">Des faits vérifiés, des positions rapportées, aucune consigne.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["3+", "sources par fait", "Dont une officielle : institution, publication scientifique ou dépêche d'agence. Sinon, le fait est retiré ou signalé."],
            ["100 %", "des citations vérifiées", "Une phrase entre guillemets a été retrouvée mot pour mot dans le texte d'origine. Sinon, elle est résumée sans guillemets."],
            ["0", "consigne de vote", "Chaque formation est citée dans un ordre qui change chaque jour, avec ses propres mots. À vous de vous faire une opinion."],
          ].map(([v, t, d]) => (
            <div key={t} className="rounded-[18px] bg-white/5 p-5">
              <p className="text-[34px] font-extrabold leading-none text-jaune">{v}</p>
              <p className="mt-1 text-sm font-extrabold uppercase tracking-[0.06em] text-white">{t}</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-lavande">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inscription */}
      <section id="inscription" className="mt-12 scroll-mt-6 grid gap-8 rounded-[28px] bg-creme px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="pastille bg-jaune text-encre">Gratuit</span>
          <h2 className="mt-4 text-[30px] font-extrabold leading-tight">Recevoir Éclairage chaque matin</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gris">Choisissez vos rubriques : elles arrivent entre 6h30 et 8h30, prêtes à lire en 10 minutes.</p>
        </div>
        <Inscription />
      </section>
    </main>
  );
}
