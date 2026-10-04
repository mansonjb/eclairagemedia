import Link from "next/link";
import { RUBRIQUES, parDate, items, chiffresDuJour, lexiqueDuJour, agendaDuJour } from "@/lib/editions";
import { Section, TuileDate, Pastille } from "@/components/ui";
import { Icone } from "@/components/Icones";
import Carrousel from "@/components/dyn/Carrousel";
import Onglets from "@/components/dyn/Onglets";
import Apparition from "@/components/dyn/Apparition";

// Toute la matière d'un jour : bandeau défilant, à la une, sélection filtrable, chiffres, agenda, lexique
export default function Journee({ date }: { date: string }) {
  const eds = parDate(date);
  const tous = items(date);
  // À la une : le premier sujet de chaque rubrique, les sujets illustrés d'abord
  const une = eds.map((e) => tous.find((i) => i.rubrique === e.rubrique)!).sort((a, b) => Number(!!b.image) - Number(!!a.image));
  const chiffres = chiffresDuJour(date).slice(0, 6);
  const lexique = lexiqueDuJour(date).slice(0, 6);
  const agenda = agendaDuJour(date);
  return (
    <div className="space-y-14">
      {/* Bandeau défilant « En 30 secondes » */}
      <section className="-mx-4 overflow-hidden bg-encre py-3 sm:mx-0 sm:rounded-full">
        <div className="defile flex w-max gap-10 pl-4">
          {[...tous, ...tous].map((i, k) => (
            <Link key={k} href={i.href} className="flex shrink-0 items-center gap-2.5 text-[14px] text-white/90 hover:text-white">
              <span className="pastille text-white" style={{ backgroundColor: RUBRIQUES[i.rubrique].couleur }}>{RUBRIQUES[i.rubrique].court}</span>
              <span className="font-semibold">{i.titre}</span>
              <span className="text-jaune">✦</span>
            </Link>
          ))}
        </div>
      </section>

      <Apparition>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Section couleur="#2f3cff">À la une</Section>
          <span className="text-sm font-semibold text-gris">Glissez pour voir les {une.length} rubriques</span>
        </div>
        <div className="mt-4"><Carrousel items={une} /></div>
      </Apparition>

      <Apparition>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Section>Sélectionnés pour vous</Section>
          <Link href={`/jour/${date}`} className="text-sm font-extrabold text-bleu underline decoration-2 underline-offset-4">Le récap du jour</Link>
        </div>
        <div className="mt-4"><Onglets items={tous} /></div>
      </Apparition>

      {chiffres.length > 0 && (
        <Apparition>
          <Section couleur="#ffd60a" texte="#14142b">Les chiffres du jour</Section>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {chiffres.map((c, k) => (
              <Apparition key={c.rubrique} delai={k * 80}>
                <Link href={`/${c.rubrique}/${date}`} className="carte group relative block h-full overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="halo absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span className="absolute right-4 top-4 opacity-15" style={{ color: RUBRIQUES[c.rubrique].couleur }}><Icone r={c.rubrique} className="h-8 w-8" /></span>
                  <p className="relative whitespace-nowrap text-[34px] font-extrabold leading-none tracking-tight" style={{ color: RUBRIQUES[c.rubrique].couleur }}>{c.valeur}</p>
                  <p className="relative mt-2 text-[13.5px] font-semibold leading-snug text-gris">{c.legende}</p>
                  <span className="relative mt-3 inline-flex"><Pastille r={c.rubrique} plein={false} /></span>
                </Link>
              </Apparition>
            ))}
          </div>
        </Apparition>
      )}

      {(agenda.length > 0 || lexique.length > 0) && (
        <Apparition className="grid items-start gap-4 lg:grid-cols-2">
          {agenda.length > 0 && (
            <div>
              <Section couleur="#ff6a3d">À venir</Section>
              <div className="carte mt-4 divide-y divide-filet px-5 py-2">
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
              <div className="mt-4 rounded-[24px] bg-encre px-6 py-6 text-lavande">
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
        </Apparition>
      )}
    </div>
  );
}
