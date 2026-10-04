/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { RUBRIQUES, editions, trouver, htmlEdition, parRubrique, parDate, dateLongue, type RubriqueId, type Sujet, type Edition as Ed } from "@/lib/editions";
import { Pastille, CarteSujet } from "@/components/ui";
import { Progression, Actions } from "@/components/dyn/Lecture";

export const dynamicParams = false;
export const generateStaticParams = () => editions.map((e) => ({ rubrique: e.rubrique, date: e.date }));
export async function generateMetadata({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  const e = trouver(rubrique, date);
  return { title: e?.sujets[0]?.titre ?? RUBRIQUES[rubrique].nom, description: e?.sujets[0]?.chapeau ?? undefined };
}

const etiquette = "text-[13px] font-extrabold tracking-[0.06em]";

// Un sujet en mosaïque (maquette « page sujet »)
function Bento({ e, s }: { e: Ed; s: Sujet }) {
  const R = RUBRIQUES[e.rubrique];
  const etapes = (s.apres ?? "").split(/ ; |\. (?=[A-ZÉ])/).map((x) => x.trim().replace(/\.$/, "")).filter(Boolean).slice(0, 3);
  return (
    <section id={`sujet-${s.n}`} className="grid scroll-mt-6 gap-4 lg:grid-cols-4">
      <div className="flex flex-col justify-between gap-6 rounded-[24px] p-6 text-white sm:p-8 lg:col-span-2" style={{ backgroundColor: R.couleur }}>
        <p className={etiquette}>{s.n} · {s.theme}</p>
        <h2 className="d text-[30px] leading-[1.02] sm:text-[44px]">{s.titre}</h2>
        <p className="text-[13.5px] font-semibold text-white/85">{dateLongue(e.date)}{s.sources.length ? ` · ${s.sources.length} sources` : ""} · {e.minutes} min de lecture</p>
      </div>
      <div className="relative min-h-[260px] overflow-hidden rounded-[24px] bg-white lg:col-span-2">
        {s.image && <img src={s.image} alt={s.legende ?? ""} className="absolute inset-0 h-full w-full object-cover" />}
        {s.legende && <span className="absolute bottom-3 left-3 max-w-[85%] rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">{s.legende}</span>}
      </div>

      {s.chiffres.map((c) => (
        <div key={c.valeur + c.legende} className="flex flex-col justify-end rounded-[24px] p-6" style={{ backgroundColor: R.fond }}>
          <p className="d text-[44px] leading-none sm:text-[52px]" style={{ color: R.couleur }}>{c.valeur}</p>
          <p className="mt-2 text-[14px] font-semibold leading-snug">{c.legende}</p>
        </div>
      ))}
      {s.sources.length > 0 && (
        <div className="rounded-[24px] bg-white p-6">
          <p className={etiquette}>SOURCES</p>
          <ul className="mt-3 space-y-1.5 text-[14px] font-semibold">
            {s.sources.map((x) => <li key={x.url}><a href={x.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-bleu">{x.nom}</a></li>)}
          </ul>
        </div>
      )}

      {s.passe && (
        <div className="rounded-[24px] bg-white p-6 sm:p-8 lg:col-span-2">
          <p className={etiquette} style={{ color: R.couleur }}>CE QUI S&apos;EST PASSÉ</p>
          <p className="mt-3 text-[16.5px] leading-[1.7]">{s.passe}</p>
        </div>
      )}
      {(s.eclairage || s.points.length > 0) && (
        <div className="rounded-[24px] bg-jaune-pale p-6 sm:p-8 lg:col-span-2">
          <span className="pastille bg-encre text-jaune">L&apos;ÉCLAIRAGE</span>
          {s.eclairage && <p className="d mt-3 text-[26px] leading-tight">{s.eclairage}</p>}
          <ol className="mt-4 space-y-3">
            {s.points.map((p, k) => (
              <li key={k} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-encre text-[12px] font-extrabold text-jaune">{k + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {s.cartes.map((c, k) => (
        <a key={k} href={c.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-3 rounded-[24px] p-6 transition hover:-translate-y-0.5" style={{ backgroundColor: c.fond }}>
          <div className="flex flex-wrap items-center gap-2"><span className="pastille text-white" style={{ backgroundColor: c.couleur }}>{c.parti}</span><span className="text-[13.5px] font-extrabold">{c.qui}</span></div>
          <p className="d text-[19px] leading-[1.25]">{c.texte}</p>
          <p className="mt-auto text-[12.5px] text-gris">{c.contexte ? `${c.contexte} · ` : ""}<span className="underline">{c.source}</span></p>
        </a>
      ))}

      {s.change && (
        <div className="rounded-[24px] bg-encre p-6 text-white sm:p-8 lg:col-span-2">
          <p className={`${etiquette} text-jaune`}>CE QUE ÇA CHANGE</p>
          <p className="d mt-3 text-[22px] leading-snug">{s.change}</p>
        </div>
      )}
      {etapes.length > 0 && (
        <div className="rounded-[24px] bg-white p-6 sm:p-8 lg:col-span-2">
          <p className={etiquette} style={{ color: R.couleur }}>ET APRÈS ?</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {etapes.map((t, k) => (
              <div key={k} className="rounded-[16px] p-4" style={{ backgroundColor: R.fond }}>
                <span className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[13px] font-extrabold text-white" style={{ backgroundColor: R.couleur }}>{k + 1}</span>
                <p className="mt-2.5 text-[14px] font-semibold leading-snug">{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default async function Edition({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  const e = trouver(rubrique, date);
  if (!e) notFound();
  const R = RUBRIQUES[rubrique];
  const liste = parRubrique(rubrique);
  const i = liste.findIndex((x) => x.date === date);
  const [suivant, precedent] = [liste[i - 1], liste[i + 1]];
  const aLire = parDate(date).filter((x) => x.rubrique !== rubrique).slice(0, 3);
  const b = "rounded-full bg-white px-4 py-2.5 text-[14px] font-bold hover:bg-lavande";
  return (
    <main className="flex flex-col gap-4 pt-6">
      <Progression couleur={R.couleur} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/jour/${date}`} className={b}>← Édition du {dateLongue(date).replace(/^./, (c) => c.toLowerCase())}</Link>
          <Pastille r={rubrique} plein>{R.nom}</Pastille>
        </div>
        <nav aria-label="Sommaire" className="flex flex-wrap gap-1.5">
          {e.sujets.map((s) => (
            <a key={s.n} href={`#sujet-${s.n}`} className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 text-[13px] font-bold hover:bg-lavande">
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] text-white" style={{ backgroundColor: R.couleur }}>{s.n}</span>
              {s.theme.charAt(0) + s.theme.slice(1).toLowerCase()}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-10">
        {e.sujets.map((s) => <Bento key={s.n} e={e} s={s} />)}
      </div>

      <details className="carte mt-4 p-5 sm:p-7">
        <summary className="cursor-pointer text-[15px] font-extrabold">Voir l&apos;édition telle qu&apos;envoyée par email (lexique, agenda, toutes les sources)</summary>
        <article className="edition-email mt-6" dangerouslySetInnerHTML={{ __html: htmlEdition(rubrique, date) }} />
      </details>

      <div className="mt-2 flex flex-wrap justify-between gap-3">
        {precedent ? <Link href={`/${rubrique}/${precedent.date}`} className={b}>← {R.court} du {dateLongue(precedent.date).replace(/^./, (c) => c.toLowerCase())}</Link> : <span />}
        {suivant && <Link href={`/${rubrique}/${suivant.date}`} className={b}>{R.court} du {dateLongue(suivant.date).replace(/^./, (c) => c.toLowerCase())} →</Link>}
      </div>

      {aLire.length > 0 && (
        <>
          <h2 className="d px-2 pt-6 text-[28px]">À lire aussi aujourd&apos;hui</h2>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aLire.map((x) => <CarteSujet key={x.rubrique} e={x} s={x.sujets[0]} />)}
          </div>
        </>
      )}
      <Actions titre={e.sujets[0]?.titre ?? R.nom} />
    </main>
  );
}
