import Link from "next/link";
import { ORDRE, RUBRIQUES, dates, parDate, items, dateLongue, semaineDe, libelleSemaine } from "@/lib/editions";
import { Section, TuileDate, jourMois } from "@/components/ui";
import { Icone } from "@/components/Icones";
import Journee from "@/components/Journee";
import Collage from "@/components/Collage";
import Inscription from "@/components/Inscription";
import Salutation from "@/components/dyn/Salutation";
import Apparition from "@/components/dyn/Apparition";

export default function Accueil() {
  const [aujourdhui, ...avant] = dates();
  const semaine = semaineDe(aujourdhui);
  const eds = parDate(aujourdhui);
  const tous = items(aujourdhui);
  // Photos du collage : aujourd'hui d'abord, puis les jours précédents si besoin
  const photos = dates().flatMap((d) => items(d)).filter((i) => i.image).slice(0, 4) as { href: string; image: string; legende: string | null; rubrique: (typeof ORDRE)[number]; theme: string }[];
  const minutes = eds.reduce((n, e) => n + e.minutes, 0);
  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* Accueil */}
      <section className="relative mt-4 overflow-hidden rounded-[32px] bg-creme px-6 py-10 sm:px-12 sm:py-14">
        <span className="halo pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="pastille bg-white text-encre ombre">✦ {dateLongue(aujourdhui)}</span>
            <h1 className="mt-6 text-[40px] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[60px]">
              <Salutation />, voici <span className="relative whitespace-nowrap"><span className="halo absolute inset-x-[-6%] inset-y-[-10%] rounded-full" /><span className="relative">l&apos;essentiel</span></span> du jour.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-gris">
              Vous avez décroché de l&apos;actualité ? On reprend depuis le début : un sujet, son contexte, les faits et les différentes positions.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[[`${tous.length}`, "sujets"], [`${eds.length}`, "éditions"], [`${minutes}`, "min de lecture"], ["3+", "sources par fait"]].map(([v, l]) => (
                <span key={l} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] text-gris ombre"><b className="text-encre">{v}</b> {l}</span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#inscription" className="rounded-full bg-encre px-6 py-3.5 text-sm font-extrabold text-jaune ombre transition hover:-translate-y-0.5">Recevoir Éclairage gratuitement</Link>
              <Link href={`/jour/${aujourdhui}`} className="rounded-full bg-white px-6 py-3.5 text-sm font-extrabold ombre transition hover:-translate-y-0.5">Lire l&apos;édition du jour →</Link>
            </div>
          </div>
          {photos.length >= 3 && <Collage photos={photos} />}
        </div>
      </section>

      <div className="mt-8"><Journee date={aujourdhui} /></div>

      {/* Rubriques */}
      <Apparition>
        <section id="rubriques" className="mt-14 scroll-mt-6">
          <Section>Six rendez-vous chaque matin</Section>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ORDRE.map((r) => (
              <Link key={r} href={`/${r}`} className="group relative overflow-hidden rounded-[24px] p-6 transition hover:-translate-y-1 ombre" style={{ backgroundColor: RUBRIQUES[r].fond }}>
                <span className="absolute -bottom-6 -right-6 transition duration-700 group-hover:-rotate-12 group-hover:scale-110" style={{ color: RUBRIQUES[r].couleur }}><Icone r={r} className="h-32 w-32 opacity-10" /></span>
                <div className="relative flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white" style={{ color: RUBRIQUES[r].couleur }}><Icone r={r} className="h-5 w-5" /></span>
                  <span className="pastille bg-white/70 text-encre">{RUBRIQUES[r].heure}</span>
                </div>
                <p className="relative mt-5 text-[19px] font-extrabold">{RUBRIQUES[r].nom}</p>
                <p className="relative mt-2 text-[14.5px] leading-relaxed text-encre/75">{RUBRIQUES[r].accroche}</p>
                <span className="relative mt-4 inline-block text-sm font-extrabold" style={{ color: RUBRIQUES[r].couleur }}>Voir la rubrique →</span>
              </Link>
            ))}
          </div>
        </section>
      </Apparition>

      {/* Jour par jour */}
      <Apparition>
        <section className="mt-14">
          <Section couleur="#2f3cff">Jour par jour</Section>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {avant.slice(0, 6).map((d) => {
              const { jour, mois } = jourMois(d);
              return (
                <Link key={d} href={`/jour/${d}`} className="carte flex min-w-0 gap-4 p-4 transition hover:-translate-y-0.5">
                  <TuileDate jour={jour} mois={mois} couleur="#2f3cff" fond="#e8eaff" />
                  <div className="min-w-0">
                    <p className="font-extrabold">{dateLongue(d)}</p>
                    <ul className="mt-1.5 space-y-1">
                      {parDate(d).slice(0, 3).map((e) => (
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
      </Apparition>

      {/* Méthode */}
      <Apparition>
        <section id="methode" className="relative mt-14 scroll-mt-6 overflow-hidden rounded-[32px] bg-encre px-6 py-12 sm:px-12">
          <span className="halo pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-40" />
          <span className="pastille relative bg-jaune text-encre">Notre méthode</span>
          <h2 className="relative mt-4 max-w-2xl text-[30px] font-extrabold leading-tight text-white sm:text-[38px]">Des faits vérifiés, des positions rapportées, aucune consigne.</h2>
          <div className="relative mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["3+", "sources par fait", "Dont une officielle : institution, publication scientifique ou dépêche d'agence. Sinon, le fait est retiré ou signalé."],
              ["100 %", "des citations vérifiées", "Une phrase entre guillemets a été retrouvée mot pour mot dans le texte d'origine. Sinon, elle est résumée sans guillemets."],
              ["0", "consigne de vote", "Chaque formation est citée dans un ordre qui change chaque jour, avec ses propres mots. À vous de vous faire une opinion."],
            ].map(([v, t, d]) => (
              <div key={t} className="rounded-[20px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
                <p className="text-[40px] font-extrabold leading-none tracking-tight text-jaune">{v}</p>
                <p className="mt-2 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white">{t}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-lavande">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </Apparition>

      {/* Inscription */}
      <Apparition>
        <section id="inscription" className="mt-14 scroll-mt-6 grid gap-8 rounded-[32px] bg-creme px-6 py-10 ombre sm:px-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="pastille bg-jaune text-encre">Gratuit</span>
            <h2 className="mt-4 text-[32px] font-extrabold leading-tight tracking-[-0.02em]">Recevoir Éclairage chaque matin</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gris">Choisissez vos rubriques : elles arrivent entre 6h30 et 8h30, prêtes à lire en 10 minutes.</p>
          </div>
          <Inscription />
        </section>
      </Apparition>
    </main>
  );
}
