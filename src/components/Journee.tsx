import Link from "next/link";
import { RUBRIQUES, parDate, une, chiffresDuJour, lexiqueDuJour, agendaDuJour } from "@/lib/editions";
import { Section, CarteSujet, GrilleEditions, TuileDate, Pastille } from "@/components/ui";
import { Icone } from "@/components/Icones";

// Toute la matière d'un jour, dans l'ordre et le langage visuel de la newsletter
export default function Journee({ date }: { date: string }) {
  const eds = parDate(date);
  const u = une(date);
  const chiffres = chiffresDuJour(date).slice(0, 6);
  const lexique = lexiqueDuJour(date).slice(0, 6);
  const agenda = agendaDuJour(date);
  return (
    <div className="space-y-12">
      {/* EN 30 SECONDES */}
      <section className="carte px-5 py-6 sm:px-8">
        <span className="pastille bg-encre text-jaune">En 30 secondes</span>
        <ul className="mt-4 grid gap-x-10 gap-y-2.5 md:grid-cols-2">
          {eds.flatMap((e) => e.sujets.map((s) => (
            <li key={e.rubrique + s.n} className="flex gap-2.5 text-[15px] leading-snug">
              <span className="font-extrabold" style={{ color: RUBRIQUES[e.rubrique].couleur }}>→</span>
              <Link href={`/${e.rubrique}/${date}`} className="hover:underline">
                <b>{RUBRIQUES[e.rubrique].court} :</b> {s.titre}
              </Link>
            </li>
          )))}
        </ul>
      </section>

      {/* À LA UNE */}
      {u && (
        <section>
          <Section couleur={RUBRIQUES[u.e.rubrique].couleur}>À la une · {RUBRIQUES[u.e.rubrique].court}</Section>
          <div className="mt-3"><CarteSujet e={u.e} s={u.s} grand /></div>
        </section>
      )}

      {/* CHIFFRES */}
      {chiffres.length > 0 && (
        <section>
          <Section couleur="#ffd60a" texte="#14142b">Les chiffres du jour</Section>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {chiffres.map((c) => (
              <Link key={c.rubrique} href={`/${c.rubrique}/${date}`} className="carte group relative overflow-hidden p-5">
                <span className="halo absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-0 transition group-hover:opacity-100" />
                <p className="relative whitespace-nowrap text-[32px] font-extrabold leading-none tracking-tight" style={{ color: RUBRIQUES[c.rubrique].couleur }}>{c.valeur}</p>
                <p className="relative mt-2 text-[13.5px] font-semibold leading-snug text-gris">{c.legende}</p>
                <span className="relative mt-3 inline-flex"><Pastille r={c.rubrique} plein={false} /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* LES ÉDITIONS */}
      <section>
        <Section>Les éditions du jour</Section>
        <div className="mt-3"><GrilleEditions eds={eds} /></div>
      </section>

      {/* AGENDA + LEXIQUE */}
      {(agenda.length > 0 || lexique.length > 0) && (
        <section className="grid items-start gap-4 lg:grid-cols-2">
          {agenda.length > 0 && (
            <div>
              <Section couleur="#ff6a3d">À venir</Section>
              <div className="carte mt-3 divide-y divide-filet px-5 py-2">
                {agenda.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 py-3">
                    <TuileDate jour={a.jour} mois={a.mois} couleur={RUBRIQUES[a.rubrique].couleur} fond={RUBRIQUES[a.rubrique].fond} />
                    <p className="text-[15px] leading-snug">{a.texte}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {lexique.length > 0 && (
            <div>
              <Section couleur="#14142b">Le lexique du jour</Section>
              <div className="mt-3 rounded-[24px] bg-encre px-6 py-6 text-lavande">
                <span className="pastille bg-jaune text-encre">Les mots pour suivre</span>
                <dl className="mt-4 space-y-4">
                  {lexique.map((l) => (
                    <div key={l.terme}>
                      <dt className="flex items-center gap-2 text-[17px] font-extrabold text-white">
                        <span style={{ color: RUBRIQUES[l.rubrique].couleur }}><Icone r={l.rubrique} className="h-4 w-4" /></span>{l.terme}
                      </dt>
                      <dd className="mt-1 text-[14.5px] leading-relaxed">{l.definition}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
