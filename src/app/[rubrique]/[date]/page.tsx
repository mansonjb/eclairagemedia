/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { RUBRIQUES, editions, trouver, htmlEdition, parRubrique, dateLongue, type RubriqueId } from "@/lib/editions";
import { Tuiles, Eclairage, CeQueCaChange, Etiquette } from "@/components/ui";
import { Icone, Ico } from "@/components/Icones";
import { Progression, Actions, Bascule } from "@/components/dyn/Lecture";

export const dynamicParams = false;
export const generateStaticParams = () => editions.map((e) => ({ rubrique: e.rubrique, date: e.date }));
export async function generateMetadata({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  const e = trouver(rubrique, date);
  return { title: e?.sujets[0]?.titre ?? RUBRIQUES[rubrique].nom, description: e?.sujets[0]?.chapeau ?? undefined };
}

export default async function Edition({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  const e = trouver(rubrique, date);
  if (!e) notFound();
  const R = RUBRIQUES[rubrique];
  const liste = parRubrique(rubrique);
  const i = liste.findIndex((x) => x.date === date);
  const [suivant, precedent] = [liste[i - 1], liste[i + 1]];
  const p = e.sujets[0];
  const photo = e.sujets.find((s) => s.image);

  const essentiel = (
    <div className="mx-auto max-w-3xl space-y-5">
      {e.sujets.map((s) => (
        <article key={s.n} id={`sujet-${s.n}`} className="carte scroll-mt-6 p-5 sm:p-7">
          {s.image && s.n !== 1 && <img src={s.image} alt={s.legende ?? ""} loading="lazy" className="mb-5 aspect-[16/9] w-full rounded-[18px] object-cover" />}
          <Etiquette r={rubrique} s={s} />
          <h2 className="mt-1.5 text-[24px] font-extrabold leading-[1.15]">{s.titre}</h2>
          <div className="mt-4"><Tuiles r={rubrique} s={s} /></div>
          {s.chapeau && (
            <p className="mt-4 text-[16.5px] leading-[1.7]">
              <span className="float-left mr-2 mt-1 text-[52px] font-extrabold leading-[0.8]" style={{ color: R.couleur }}>{s.chapeau.charAt(0)}</span>
              {s.chapeau.slice(1)}
            </p>
          )}
          <div className="clear-both mt-5 space-y-3">
            {s.eclairage && <Eclairage texte={s.eclairage} />}
            {s.change && <CeQueCaChange texte={s.change} />}
          </div>
        </article>
      ))}
      <p className="text-center text-sm text-gris">Sources, positions des acteurs, agenda et lexique : voir l&apos;édition complète.</p>
    </div>
  );

  return (
    <main className="px-4">
      <Progression couleur={R.couleur} />
      {/* Couverture */}
      <section className="relative mx-auto mt-4 flex min-h-[380px] max-w-6xl overflow-hidden rounded-[32px] sm:min-h-[460px]" style={{ backgroundColor: R.fond }}>
        {photo?.image ? <img src={photo.image} alt={photo.legende ?? ""} className="absolute inset-0 h-full w-full object-cover" />
          : <><span className="halo absolute -right-20 -top-20 h-96 w-96 rounded-full" /><span className="absolute right-10 top-10" style={{ color: R.couleur }}><Icone r={rubrique} className="h-40 w-40 opacity-15" /></span></>}
        <div className={`absolute inset-0 ${photo?.image ? "bg-gradient-to-t from-encre/85 via-encre/25 to-encre/10" : ""}`} />
        {photo?.legende?.endsWith("(illustration)") && <span className="absolute bottom-4 right-4 z-10 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">Illustration</span>}
        <div className="relative flex w-full flex-col justify-between p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <Link href={`/${rubrique}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-encre ombre backdrop-blur hover:bg-white" aria-label="Retour à la rubrique"><Ico n="gauche" className="h-5 w-5" /></Link>
            <span className="pastille bg-white/90 text-encre backdrop-blur">{e.minutes} min de lecture</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="pastille text-white" style={{ backgroundColor: R.couleur }}><Icone r={rubrique} className="h-3.5 w-3.5" />{R.nom}</span>
              <span className={`pastille ${photo?.image ? "verre text-white" : "bg-white text-encre"}`}>{dateLongue(date)}</span>
            </div>
            {p && (
              <h1 className="mt-4 text-[26px] font-extrabold leading-[1.4] sm:text-[38px]">
                <span className="rounded-[10px] bg-white px-2.5 py-0.5 text-encre [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{p.titre}</span>
              </h1>
            )}
          </div>
        </div>
      </section>
      {photo?.legende && <p className="mx-auto mt-2 max-w-6xl px-2 text-[11.5px] text-gris-clair">{photo.legende} · Wikimedia Commons</p>}

      {/* Sommaire */}
      <nav className="mx-auto mt-6 flex max-w-6xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Sommaire">
        {e.sujets.map((s) => (
          <a key={s.n} href={`#sujet-${s.n}`} className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-bold ombre transition hover:-translate-y-0.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white" style={{ backgroundColor: R.couleur }}>{s.n}</span>
            <span className="max-w-[240px] truncate">{s.theme.charAt(0) + s.theme.slice(1).toLowerCase()}</span>
          </a>
        ))}
      </nav>

      <div className="mx-auto mt-8 max-w-6xl">
        <Bascule essentiel={essentiel} complete={<article className="edition-email" dangerouslySetInnerHTML={{ __html: htmlEdition(rubrique, date) }} />} />
      </div>

      <nav className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
        {precedent ? (
          <Link href={`/${rubrique}/${precedent.date}`} className="carte p-4 transition hover:-translate-y-0.5">
            <p className="text-xs font-bold text-gris">← Édition précédente · {dateLongue(precedent.date)}</p>
            <p className="mt-1 line-clamp-2 font-extrabold">{precedent.sujets[0]?.titre}</p>
          </Link>
        ) : <span />}
        {suivant && (
          <Link href={`/${rubrique}/${suivant.date}`} className="carte p-4 text-right transition hover:-translate-y-0.5">
            <p className="text-xs font-bold text-gris">Édition suivante · {dateLongue(suivant.date)} →</p>
            <p className="mt-1 line-clamp-2 font-extrabold">{suivant.sujets[0]?.titre}</p>
          </Link>
        )}
      </nav>
      <Actions titre={p?.titre ?? R.nom} />
    </main>
  );
}
