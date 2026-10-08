import Portrait, { Orateur } from "@/components/Portrait";
import { parSondage, pct } from "@/lib/barometre";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { RUBRIQUES, titreCourt, parDate, chiffresDuJour, lexiqueDuJour, agendaDuJour, quizDuJourListe, unesDuJour, type Edition, type Sujet } from "@/lib/editions";
import QuizPile from "@/components/dyn/QuizPile";
import { UneCarte } from "@/components/dyn/Une";
import { Section, Pastille, CarteSujet, Meta, Credit } from "@/components/ui";
import Lexique from "@/components/dyn/Lexique";
import barometre from "../../content/barometre.json";
import type { Candidat } from "@/components/dyn/Candidats";

// Raccourcit un texte en phrases entières (jamais de « … ») : autant de phrases que la limite le permet, au moins la première
const coupe = (t: string | null, n: number) => {
  if (!t) return "";
  const phrases = t.match(/[^.!?]+[.!?]+(?:\s+|$)/g) ?? [t];
  let r = phrases[0];
  for (const p of phrases.slice(1)) { if ((r + p).length > n) break; r += p; }
  return r.trim();
};
const premierePhrase = (t: string | null) => (t ? (t.match(/^[^.!?]+[.!?]/)?.[0] ?? t) : "");

// Le sujet principal : photo + chiffre, titre, trois étapes, appel à lire
function Principal({ e, s, k }: { e: Edition; s: Sujet; k: number }) {
  const R = RUBRIQUES[e.rubrique];
  const lien = `/${e.rubrique}/${e.date}/${s.n}`;
  const etapes = [
    ["LE FAIT", premierePhrase(s.chapeau)],
    ["CE QUE ÇA CHANGE", coupe(s.change, 150)],
    ["ET APRÈS ?", coupe(s.apres, 150)],
  ].filter(([, t]) => t);
  return (
    <article className="carte flex w-full flex-col p-3">
      {s.image ? (
      <div className="relative">
        <Link href={lien}><img src={s.image ?? ""} alt={s.legende ?? ""} className="ph aspect-[16/9] sm:aspect-[21/9]" /></Link>
        <span className="absolute left-4 top-4 rounded-full bg-white px-3.5 py-2 text-[12px] font-extrabold tracking-[0.02em]">SUJET {k + 1} · {s.theme}</span>
        <Credit s={s} className="absolute bottom-4 right-4 hidden max-w-[40%] truncate sm:block" />
        {s.chiffres[0] && (
          <div className="absolute bottom-4 left-4 rounded-[18px] px-4 py-3 text-white" style={{ backgroundColor: R.couleur }}>
            <p className="d text-[30px] leading-none sm:text-[40px]">{s.chiffres[0].valeur}</p>
            <p className="mt-1 text-[13px] font-semibold">{s.chiffres[0].legende}</p>
          </div>
        )}
      </div>
      ) : (
        // Pas de photo vérifiée : bandeau couleur de la rubrique avec le chiffre clé
        <div className="flex flex-wrap items-end justify-between gap-4 rounded-[20px] p-5 sm:p-6" style={{ backgroundColor: R.fond }}>
          <span className="rounded-full bg-white px-3.5 py-2 text-[12px] font-extrabold tracking-[0.02em]">SUJET {k + 1} · {s.theme}</span>
          {s.chiffres[0] && (
            <div className="text-right" style={{ color: R.couleur }}>
              <p className="d text-[44px] leading-none sm:text-[56px]">{s.chiffres[0].valeur}</p>
              <p className="mt-1 text-[13.5px] font-bold">{s.chiffres[0].legende}</p>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-5 px-3 pb-2 pt-5 sm:px-4">
        <Link href={lien} className="d text-balance text-[30px] leading-[1.02] hover:text-bleu sm:text-[42px]">{titreCourt(e, s)}</Link>
        <div className="grid gap-3 md:grid-cols-3">
          {etapes.map(([t, texte], k) => (
            <div key={t} className="rounded-[20px] bg-fond px-4 py-4">
              <p className="flex items-center gap-2 text-[12px] font-extrabold tracking-[0.04em]" style={{ color: R.couleur }}>
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-white" style={{ backgroundColor: R.couleur }}>{k + 1}</span>{t}
              </p>
              <p className="mt-2 text-[15px] leading-[1.45]">{texte}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Meta s={s} minutes={e.minutes} />
          <Link href={lien} className="rounded-full bg-encre px-5 py-3.5 text-[15px] font-extrabold text-white hover:bg-black">Comprendre le sujet →</Link>
        </div>
      </div>
    </article>
  );
}

export default function Journee({ date }: { date: string }) {
  const eds = parDate(date);
  // Les trois sujets principaux (étapes 1/2/3 du haut de page), puis les autres
  const unes = unesDuJour(date);
  const lead = unes[0]?.e;
  const pris = new Set(unes.map((u) => u.s));
  const autres = eds.flatMap((e) => e.sujets.map((s) => ({ e, s })))
    .filter((x) => !pris.has(x.s))
    .sort((a, b) => a.s.n - b.s.n)
    .slice(0, 6);
  const chiffre = chiffresDuJour(date).find((c) => c.rubrique !== lead?.rubrique) ?? chiffresDuJour(date)[0];
  const mots = lexiqueDuJour(date).slice(0, 6);
  const agenda = agendaDuJour(date);
  const citations = eds.flatMap((e) => e.sujets.flatMap((s) => s.cartes.map((c) => ({ ...c, href: `/${e.rubrique}/${e.date}/${s.n}` })))).filter((c) => c.texte.length > 20).slice(0, 3);
  const quizzes = quizDuJourListe(date, 3);
  const quiz = quizzes.length > 0;
  const podium = parSondage((barometre as unknown as { candidats: Candidat[] }).candidats).filter((c) => c.sondage).slice(0, 3);

  const carteChiffre = chiffre && (
              <Link href={`/${chiffre.rubrique}/${date}/${chiffre.n}`} className="carte group flex flex-col gap-3 !bg-jaune p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="pastille bg-encre text-jaune">LE CHIFFRE DU JOUR</span>
                  <span className="text-[13px] font-bold">{RUBRIQUES[chiffre.rubrique].court}</span>
                </div>
                <p className="d text-[52px] leading-none">{chiffre.valeur}</p>
                <p className="text-[16px] font-bold leading-snug">{chiffre.legende}</p>
                <p className="mt-1 text-[13.5px] leading-snug text-encre/75 group-hover:underline">À propos : {chiffre.titre}</p>
              </Link>
  );

  return (
    <div className="flex flex-col gap-5">
      {lead && (
        <div className="grid gap-5 lg:grid-cols-3">
          <UneCarte cartes={unes.map(({ e, s }, k) => <Principal key={`${e.rubrique}-${s.n}`} e={e} s={s} k={k} />)} />
          <div className="flex min-w-0 flex-col gap-5">
            {quiz ? <QuizPile qs={quizzes} /> : carteChiffre}
            <section className="carte flex flex-1 flex-col p-6" aria-label="En 30 secondes">
              <h2 className="d mb-2 text-[22px]">En 30 secondes</h2>
              {eds.map((e, k) => (
                <Link key={e.rubrique} href={`/${e.rubrique}/${date}/${e.sujets[0]?.n ?? 1}`} className={`flex items-start gap-3 py-2.5 text-[15px] leading-snug hover:text-bleu ${k < eds.length - 1 ? "border-b border-filet" : ""}`}>
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: RUBRIQUES[e.rubrique].couleur }} />
                  <span><b>{RUBRIQUES[e.rubrique].court}&nbsp;:</b> {e.sujets[0]?.titre}</span>
                </Link>
              ))}
            </section>
          </div>
        </div>
      )}

      {autres.length > 0 && (
        <>
          <Section id="sujets" lien={{ href: `/jour/${date}`, texte: "Voir tout" }}>Les autres sujets du jour</Section>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {autres.map(({ e, s }) => <CarteSujet key={e.rubrique + s.n} e={e} s={s} />)}
          </div>
        </>
      )}

      <div className="mt-5 grid items-stretch gap-5 lg:grid-cols-3">
        <div className={quiz ? "lg:col-span-2" : "lg:col-span-3"}>{mots.length > 0 && <Lexique mots={mots} />}</div>
        {quiz && carteChiffre}
      </div>

      {podium.length === 3 && (
        <Link href="/barometre" className="carte group grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="pastille bg-lavande text-bleu">BAROMÈTRE PRÉSIDENTIELLE 2027</span>
            <p className="d mt-4 text-[30px] leading-[1.05] sm:text-[38px]">Qui va prendre <span className="surligne whitespace-nowrap">l&apos;avantage&nbsp;?</span></p>
            <p className="mt-3 text-[15px] text-gris">Les intentions de vote dans les sondages, les paris Polymarket et le bruit en ligne, mesure par mesure. Mis à jour chaque matin.</p>
            <span className="mt-5 inline-block rounded-full bg-encre px-5 py-3 text-[14px] font-extrabold text-white group-hover:bg-black">Voir tous les candidats →</span>
          </div>
          <div className="grid grid-cols-3 items-end gap-3">
            {[podium[1], podium[0], podium[2]].map((c) => {
              const rang = podium.indexOf(c) + 1;
              return (
                <div key={c.nom} className="flex flex-col items-center">
                  <Portrait nom={c.nom} couleur={c.couleur} className={`mb-2.5 rounded-full ${rang === 1 ? "h-20 w-20" : "h-16 w-16"}`} texte="text-[22px]" />
                  <p className="d text-center text-[16px] leading-tight sm:text-[18px]">{c.nom}</p>
                  <span className="pastille mt-1.5 text-white" style={{ backgroundColor: c.couleur }}>{c.etiquette}</span>
                  {/* même style que le podium de la page Baromètre : marches lavande, rang en bas */}
                  <div className={`mt-3 flex w-full flex-col items-center justify-between rounded-t-[18px] bg-lavande pb-3 pt-4 ${rang === 1 ? "h-44" : rang === 2 ? "h-36" : "h-32"}`}>
                    <div className="flex flex-col items-center">
                      <p className="d text-[26px] leading-none sm:text-[30px]">{pct(c.sondage!.v)}</p>
                      <p className="mt-1 text-center text-[10.5px] font-extrabold tracking-[0.04em] text-gris">SONDAGES</p>
                    </div>
                    <p className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[14px] font-extrabold">{rang}<sup className="text-[9px]">{rang === 1 ? "er" : "e"}</sup></p>
                  </div>
                </div>
              );
            })}
          </div>
        </Link>
      )}

      {citations.length > 0 && (
        <>
          <Section>Qui dit quoi</Section>
          <div className="grid items-stretch gap-5 md:grid-cols-3">
            {citations.map((c, k) => (
              <Link key={k} href={c.href} className="flex flex-col gap-3 rounded-[28px] p-6 transition hover:-translate-y-0.5" style={{ backgroundColor: c.fond }}>
                <Orateur qui={c.qui} parti={c.parti} couleur={c.couleur} />
                <p className="d text-[19px] leading-[1.2]">{c.texte}</p>
                <p className="mt-auto text-[12.5px] text-gris">{c.contexte ? `${c.contexte} · ` : ""}{c.source}</p>
              </Link>
            ))}
          </div>
          <p className="px-2 text-right text-[12.5px] text-gris">Citations vérifiées mot pour mot</p>
        </>
      )}

      {agenda.length > 0 && (
        <>
          <Section id="agenda">À venir</Section>
          <div className={`grid gap-4 sm:grid-cols-2 ${agenda.length >= 4 ? "lg:grid-cols-4" : agenda.length === 3 ? "lg:grid-cols-3" : ""}`}>
            {agenda.map((g) => {
              const d = new Date(g.iso + "T12:00:00Z");
              const ecart = Math.round((d.getTime() - new Date(date + "T12:00:00Z").getTime()) / 864e5);
              const quand = ecart === 0 ? "Aujourd'hui" : ecart === 1 ? "Demain" : `Dans ${ecart} jours`;
              const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-FR", { ...o, timeZone: "UTC" }).format(d);
              return (
                <section key={g.iso} className="carte flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3.5">
                    <div className={`flex w-[64px] shrink-0 flex-col items-center overflow-hidden rounded-[16px] ${ecart === 0 ? "bg-encre text-white" : "bg-fond"}`}>
                      <span className={`w-full py-1 text-center text-[11px] font-extrabold uppercase tracking-[0.06em] ${ecart === 0 ? "bg-jaune text-encre" : "bg-encre text-white"}`}>{fmt({ month: "short" }).replace(".", "")}</span>
                      <span className="d py-1.5 text-[30px] leading-none">{d.getUTCDate()}</span>
                    </div>
                    <div>
                      <p className="d text-[20px] capitalize leading-tight">{fmt({ weekday: "long" })}</p>
                      <p className={`text-[13px] font-bold ${ecart === 0 ? "text-bleu" : "text-gris"}`}>{quand}</p>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {g.evts.map((a, k) => (
                      <li key={k}>
                        <Link href={a.href} className="flex gap-3 rounded-[14px] bg-fond p-3 transition hover:bg-lavande">
                          <span className="w-1 shrink-0 rounded-full" style={{ backgroundColor: RUBRIQUES[a.rubrique].couleur }} />
                          <span className="min-w-0">
                            <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.04em]" style={{ color: RUBRIQUES[a.rubrique].couleur }}>{RUBRIQUES[a.rubrique].court}</span>
                            <span className="mt-0.5 block text-[14px] leading-snug">{a.texte}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {g.autres > 0 && <p className="mt-auto text-[12.5px] font-bold text-gris">+ {g.autres} autre{g.autres > 1 ? "s" : ""} rendez-vous</p>}
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
