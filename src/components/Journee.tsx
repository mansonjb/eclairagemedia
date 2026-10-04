/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { RUBRIQUES, parDate, items, chiffresDuJour, lexiqueDuJour, agendaDuJour } from "@/lib/editions";
import { Section, TuileDate } from "@/components/ui";
import { Icone, Ico } from "@/components/Icones";
import Carrousel from "@/components/dyn/Carrousel";
import Onglets from "@/components/dyn/Onglets";
import Apparition from "@/components/dyn/Apparition";

// Toute la matière d'un jour : à la une, bandeau, sélection (sans doublon), chiffres, agenda, lexique
export default function Journee({ date, entete }: { date: string; entete?: React.ReactNode }) {
  const eds = parDate(date);
  const tous = items(date);
  // À la une : le premier sujet de chaque rubrique, les vraies photos d'abord
  const une = eds.map((e) => tous.find((i) => i.rubrique === e.rubrique)!)
    .sort((a, b) => Number(!b.legende?.endsWith("(illustration)")) - Number(!a.legende?.endsWith("(illustration)")));
  const dejaUne = new Set(une.map((i) => i.href + i.titre));
  const selection = tous.filter((i) => !dejaUne.has(i.href + i.titre));
  const chiffres = chiffresDuJour(date).slice(0, 6);
  const lexique = lexiqueDuJour(date).slice(0, 6);
  const agenda = agendaDuJour(date);
  return (
    <div className="space-y-14">
      {/* À LA UNE, en premier */}
      <section>
        {entete ?? <Section couleur="#2f3cff">À la une</Section>}
        <div className="mt-5"><Carrousel items={une} /></div>
      </section>

      {/* Bandeau « En bref » */}
      <section className="carte flex items-stretch overflow-hidden !rounded-full">
        <span className="z-10 flex shrink-0 items-center gap-2 bg-encre px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-jaune" />En bref
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
          <div className="defile flex w-max gap-12 pl-6" style={{ animationDuration: `${tous.length * 9}s` }}>
            {[...tous, ...tous].map((i, k) => (
              <Link key={k} href={i.href} className="flex shrink-0 items-center gap-2.5 text-[14px] text-encre/80 hover:text-encre">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RUBRIQUES[i.rubrique].couleur }} />
                <span className="font-semibold" style={{ color: RUBRIQUES[i.rubrique].couleur }}>{RUBRIQUES[i.rubrique].court}</span>
                <span>{i.titre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {selection.length > 0 && (
        <Apparition>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Section>Sélectionnés pour vous</Section>
            <Link href={`/jour/${date}`} className="text-sm font-semibold text-bleu underline decoration-2 underline-offset-4">Le récap du jour</Link>
          </div>
          <div className="mt-4"><Onglets items={selection} /></div>
        </Apparition>
      )}

      {/* CHIFFRES avec leur contexte */}
      {chiffres.length > 0 && (
        <Apparition>
          <Section couleur="#e5b800">Les chiffres du jour</Section>
          <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chiffres.map((c) => {
              const R = RUBRIQUES[c.rubrique];
              return (
                <Link key={c.rubrique} href={`/${c.rubrique}/${date}`} className="carte group flex flex-col overflow-hidden transition hover:-translate-y-1">
                  <div className="relative px-5 pb-4 pt-5" style={{ backgroundColor: R.fond }}>
                    <span className="pastille text-white" style={{ backgroundColor: R.couleur }}><Icone r={c.rubrique} className="h-3.5 w-3.5" />{R.court}</span>
                    <p className="mt-4 whitespace-nowrap text-[44px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: R.couleur }}>{c.valeur}</p>
                    <p className="mt-2 text-[14.5px] font-semibold leading-snug text-encre">{c.legende}</p>
                  </div>
                  <div className="flex flex-1 items-center gap-3 px-5 py-4">
                    {c.image && <img src={c.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-[12px] object-cover" />}
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-gris">À propos de</p>
                      <p className="line-clamp-2 text-[14px] font-semibold leading-snug group-hover:underline decoration-jaune decoration-2 underline-offset-2">{c.titre}</p>
                    </div>
                    <Ico n="droite" className="ml-auto h-4 w-4 shrink-0 text-gris transition group-hover:translate-x-1 group-hover:text-encre" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Apparition>
      )}

      {(agenda.length > 0 || lexique.length > 0) && (
        <Apparition className="grid items-stretch gap-4 lg:grid-cols-2">
          {agenda.length > 0 && (
            <div className="flex flex-col">
              <Section couleur="#ff6a3d">À venir</Section>
              <div className="carte mt-4 flex-1 divide-y divide-filet px-3 py-2">
                {agenda.map((a, i) => (
                  <Link key={i} href={a.href} className="group flex items-center gap-4 rounded-[16px] px-2 py-3 transition hover:bg-fond">
                    <TuileDate jour={a.jour} mois={a.mois} couleur={RUBRIQUES[a.rubrique].couleur} fond={RUBRIQUES[a.rubrique].fond} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] leading-snug">{a.texte}</p>
                      <p className="mt-1 text-[12px] font-semibold" style={{ color: RUBRIQUES[a.rubrique].couleur }}>Expliqué dans {RUBRIQUES[a.rubrique].nom}</p>
                    </div>
                    <Ico n="droite" className="h-4 w-4 shrink-0 text-gris transition group-hover:translate-x-1 group-hover:text-encre" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          {lexique.length > 0 && (
            <div className="flex flex-col">
              <Section couleur="#14142b">Le lexique du jour</Section>
              <div className="mt-4 flex-1 rounded-[24px] bg-encre px-6 py-6 text-lavande">
                <span className="pastille bg-jaune text-encre">Les mots pour suivre</span>
                <dl className="mt-5 space-y-5">
                  {lexique.map((l) => (
                    <Link key={l.terme} href={l.href} className="group block">
                      <dt className="inline-flex items-center gap-2 rounded-full border border-jaune/70 px-3 py-1 text-[15.5px] font-bold text-white transition group-hover:bg-jaune group-hover:text-encre">
                        <span style={{ color: RUBRIQUES[l.rubrique].couleur }} className="group-hover:!text-encre"><Icone r={l.rubrique} className="h-4 w-4" /></span>{l.terme}
                      </dt>
                      <dd className="mt-2 text-[14.5px] leading-relaxed">{l.definition}</dd>
                    </Link>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </Apparition>
      )}
    </div>
  );
}
