import Link from "next/link";
import { notFound } from "next/navigation";
import { RUBRIQUES, editions, trouver, htmlEdition, parRubrique, dateLongue, type RubriqueId } from "@/lib/editions";
import { Pastille } from "@/components/ui";
import { Icone } from "@/components/Icones";

export const dynamicParams = false;
export const generateStaticParams = () => editions.map((e) => ({ rubrique: e.rubrique, date: e.date }));
export async function generateMetadata({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  const e = trouver(rubrique, date);
  return { title: e?.sujets[0]?.titre ?? RUBRIQUES[rubrique].nom, description: e?.sujets[0]?.chapeau ?? undefined };
}

// L'édition est affichée exactement comme dans la newsletter
export default async function Edition({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  const e = trouver(rubrique, date);
  if (!e) notFound();
  const R = RUBRIQUES[rubrique];
  const liste = parRubrique(rubrique);
  const i = liste.findIndex((x) => x.date === date);
  const [suivant, precedent] = [liste[i - 1], liste[i + 1]];
  const nav = "rounded-full bg-white px-4 py-2 text-[13px] font-extrabold hover:bg-creme";
  return (
    <main className="px-4">
      <div className="mx-auto mt-6 flex max-w-[640px] flex-wrap items-center justify-between gap-3">
        <Link href={`/${rubrique}`} className="flex items-center gap-2" style={{ color: R.couleur }}>
          <Icone r={rubrique} className="h-5 w-5" /><Pastille r={rubrique}>{R.nom}</Pastille>
        </Link>
        <Link href={`/jour/${date}`} className={nav}>Toutes les rubriques du jour →</Link>
      </div>
      <article className="edition-email mt-5" dangerouslySetInnerHTML={{ __html: htmlEdition(rubrique, date) }} />
      <nav className="mx-auto mt-6 flex max-w-[640px] flex-wrap justify-between gap-3">
        {precedent ? <Link href={`/${rubrique}/${precedent.date}`} className={nav}>← {dateLongue(precedent.date)}</Link> : <span />}
        {suivant ? <Link href={`/${rubrique}/${suivant.date}`} className={nav}>{dateLongue(suivant.date)} →</Link> : <span />}
      </nav>
    </main>
  );
}
