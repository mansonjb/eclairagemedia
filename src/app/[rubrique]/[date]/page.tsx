import Link from "next/link";
import { notFound } from "next/navigation";
import { RUBRIQUES, editions, trouver, htmlEdition, parRubrique, dateLongue, type RubriqueId } from "@/lib/editions";
import { Pastille } from "@/components/ui";

export const dynamicParams = false;
export const generateStaticParams = () => editions.map((e) => ({ rubrique: e.rubrique, date: e.date }));
export async function generateMetadata({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  const e = trouver(rubrique, date);
  return { title: `${RUBRIQUES[rubrique].nom} du ${dateLongue(date)}`, description: e?.sujets.map((s) => s.titre).join(" · ") };
}

export default async function Edition({ params }: { params: Promise<{ rubrique: RubriqueId; date: string }> }) {
  const { rubrique, date } = await params;
  if (!trouver(rubrique, date)) notFound();
  const liste = parRubrique(rubrique);
  const i = liste.findIndex((e) => e.date === date);
  const [suivant, precedent] = [liste[i - 1], liste[i + 1]];
  return (
    <main className="px-4 pt-8">
      <div className="mx-auto flex max-w-[680px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><Pastille r={rubrique} /><span className="font-black">{dateLongue(date)}</span></div>
        <Link href={`/jour/${date}`} className="text-sm font-black text-bleu">Toutes les rubriques du jour →</Link>
      </div>
      <article className="edition-email mt-5" dangerouslySetInnerHTML={{ __html: htmlEdition(rubrique, date) }} />
      <nav className="mx-auto mt-8 flex max-w-[680px] justify-between gap-4 font-black">
        {precedent ? <Link href={`/${rubrique}/${precedent.date}`} className="text-bleu">← Édition précédente</Link> : <span />}
        {suivant ? <Link href={`/${rubrique}/${suivant.date}`} className="text-bleu">Édition suivante →</Link> : <span />}
      </nav>
    </main>
  );
}
