import Link from "next/link";
import { notFound } from "next/navigation";
import { RUBRIQUES, editions, trouver, htmlEdition, parRubrique, parDate, dateLongue, type RubriqueId } from "@/lib/editions";
import { Pastille, CarteSujet } from "@/components/ui";
import Lecteur from "@/components/dyn/Lecteur";
import { episode } from "@/lib/podcasts";

export const dynamicParams = false;
export const generateStaticParams = () => editions.map((e) => ({ rubrique: e.rubrique, date: e.date }));
export async function generateMetadata({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  return { title: `${RUBRIQUES[rubrique].nom} du ${dateLongue(date).replace(/^./, (c) => c.toLowerCase())}`, description: trouver(rubrique, date)?.sujets.map((s) => s.titre).join(" · ") };
}

// L'édition d'une rubrique : le sommaire de ses sujets, chacun s'ouvre sur sa propre page
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
    <main className="flex flex-col gap-5 pt-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/jour/${date}`} className={b}>← Toutes les rubriques du jour</Link>
        <Pastille r={rubrique} plein>{R.nom}</Pastille>
      </div>
      <section className="px-2">
        <p className="text-[15px] font-semibold text-gris">{dateLongue(date)} · {e.sujets.length} sujets · {e.minutes} min de lecture</p>
        <h1 className="d mt-1.5 text-[34px] leading-none sm:text-[52px]">{R.nom}</h1>
      </section>
      <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {e.sujets.map((s) => <CarteSujet key={s.n} e={e} s={s} />)}
      </div>

      {(() => { const ep = episode(date, rubrique); return ep ? (
        <section className="mt-4 flex flex-col gap-2">
          <p className="px-2 text-[13px] font-extrabold tracking-[0.06em]">ÉCOUTER CETTE ÉDITION · <Link href={`/ecouter/${ep.date}`} className="underline underline-offset-4">sujets et transcription</Link></p>
          <Lecteur src={ep.url} titre={ep.titre} duree={ep.duree} />
        </section>) : null; })()}
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
          <h2 className="d px-2 pt-6 text-[28px]">Dans les autres rubriques aujourd&apos;hui</h2>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aLire.map((x) => <CarteSujet key={x.rubrique} e={x} s={x.sujets[0]} />)}
          </div>
        </>
      )}
    </main>
  );
}
