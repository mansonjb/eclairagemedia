import Link from "next/link";
import { ORDRE, RUBRIQUES, dates, parDate, dateLongue, semaineDe, libelleSemaine } from "@/lib/editions";
import { GrilleJour, Pastille } from "@/components/ui";
import Inscription from "@/components/Inscription";

export default function Accueil() {
  const [aujourdhui, ...avant] = dates();
  const semaine = semaineDe(aujourdhui);
  return (
    <main>
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12">
          <p className="inline-block rounded-full bg-soleil px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em]">Newsletters quotidiennes</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">Comprendre avant de se faire une opinion.</h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold text-gris">
            Chaque matin, un sujet, son contexte, les faits et les différentes positions. Six rubriques, zéro parti pris,
            et chaque fait confirmé par au moins trois sources dont une officielle.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="#inscription" className="rounded-full bg-encre px-6 py-3 font-black text-white hover:bg-bleu">Recevoir Éclairage</Link>
            <Link href={`/jour/${aujourdhui}`} className="rounded-full border-2 border-encre px-6 py-3 font-black hover:bg-white">Lire l&apos;édition du jour</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-gris">Aujourd&apos;hui</p>
            <h2 className="text-3xl font-black">{dateLongue(aujourdhui)}</h2>
          </div>
          <Link href={`/jour/${aujourdhui}`} className="font-black text-bleu">Le récap du jour →</Link>
        </div>
        <div className="mt-6"><GrilleJour eds={parDate(aujourdhui)} /></div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <h2 className="text-2xl font-black">Les jours précédents</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {avant.slice(0, 8).map((d) => (
            <Link key={d} href={`/jour/${d}`} className="rounded-2xl bg-white p-4 hover:-translate-y-0.5 transition">
              <p className="font-black">{dateLongue(d)}</p>
              <p className="mt-1 text-sm font-semibold text-gris">{parDate(d).length} éditions</p>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-4 font-black">
          <Link href={`/semaine/${semaine}`} className="text-bleu">La semaine {libelleSemaine(semaine)} →</Link>
          <Link href="/archives" className="text-bleu">Toutes les archives →</Link>
        </div>
      </section>

      <section id="rubriques" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-16">
        <h2 className="text-3xl font-black">Six rubriques, un rendez-vous</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORDRE.map((r) => (
            <Link key={r} href={`/${r}`} className="rounded-3xl p-6 transition hover:-translate-y-0.5" style={{ backgroundColor: RUBRIQUES[r].fond }}>
              <div className="flex items-center justify-between"><Pastille r={r} /><span className="text-sm font-black" style={{ color: RUBRIQUES[r].couleur }}>{RUBRIQUES[r].heure}</span></div>
              <p className="mt-4 text-lg font-black">{RUBRIQUES[r].nom}</p>
              <p className="mt-2 text-[15px] font-semibold leading-relaxed text-encre/80">{RUBRIQUES[r].accroche}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="methode" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-16">
        <div className="rounded-[2rem] bg-encre p-8 text-white sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-soleil">La méthode</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black">Des faits vérifiés, des positions rapportées, aucune consigne.</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              ["3 sources minimum", "Chaque fait est confirmé par au moins trois sources indépendantes, dont une officielle : institution, publication scientifique ou dépêche d'agence. Sinon, il est retiré ou signalé."],
              ["Citations mot pour mot", "Une phrase entre guillemets a été vérifiée dans le texte d'origine. Sinon, elle est résumée sans guillemets."],
              ["Pédagogie d'abord", "Chaque sujet a son encadré « L'éclairage » : le mécanisme, le contexte, les mots, pour suivre même en partant de zéro."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-3xl bg-white/5 p-5">
                <p className="text-lg font-black text-soleil">{t}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-white/80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inscription" className="mx-auto max-w-3xl scroll-mt-6 px-4 pt-16">
        <h2 className="text-3xl font-black">Recevoir Éclairage</h2>
        <p className="mt-2 font-semibold text-gris">Choisissez vos rubriques. Les newsletters arrivent chaque matin entre 6h30 et 8h30.</p>
        <div className="mt-6"><Inscription /></div>
      </section>
    </main>
  );
}
