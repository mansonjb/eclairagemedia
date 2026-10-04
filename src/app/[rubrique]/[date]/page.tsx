import Link from "next/link";
import { notFound } from "next/navigation";
import { RUBRIQUES, editions, trouver, htmlEdition, parRubrique, dateLongue, type RubriqueId } from "@/lib/editions";
import { Kicker, Visuel } from "@/components/ui";

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
  const liste = parRubrique(rubrique);
  const i = liste.findIndex((x) => x.date === date);
  const [suivant, precedent] = [liste[i - 1], liste[i + 1]];
  const p = e.sujets[0];
  // La photo du premier sujet est déjà affichée en grand en tête de page : on évite le doublon
  let corps = htmlEdition(rubrique, date);
  if (p?.image) corps = corps.replace(new RegExp(`<img[^>]*src="${p.image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`), "");
  return (
    <main>
      <header className="mx-auto max-w-3xl px-4 pt-12 text-center">
        <Kicker r={rubrique}>{RUBRIQUES[rubrique].nom}</Kicker>
        <p className="mt-3 text-sm text-gris">{dateLongue(date)}</p>
        {p && <h1 className="mt-5 font-serif text-[2.2rem] font-medium leading-[1.12] tracking-[-0.01em] sm:text-5xl">{p.titre}</h1>}
        {p?.chapeau && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-texte">{p.chapeau}</p>}
      </header>
      {p && (
        <div className="mx-auto mt-10 max-w-4xl px-4">
          <Visuel s={p} r={rubrique} grand className="aspect-[16/9] w-full rounded-sm" />
          {p.legende && <p className="mt-2 text-xs text-gris">{p.legende} · Wikimedia Commons</p>}
        </div>
      )}
      <nav className="mx-auto mt-10 max-w-[640px] px-4" aria-label="Sommaire">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">Dans cette édition</p>
        <ol className="mt-3 divide-y divide-filet border-y border-filet">
          {e.sujets.map((s) => (
            <li key={s.n} className="flex gap-4 py-3">
              <span className="font-serif text-lg" style={{ color: RUBRIQUES[rubrique].couleur }}>{s.n}</span>
              <span className="text-[15px] leading-snug text-texte"><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gris">{s.theme} · </span>{s.titre}</span>
            </li>
          ))}
        </ol>
      </nav>
      <article className="edition-email mt-10 px-4" dangerouslySetInnerHTML={{ __html: corps }} />
      <nav className="mx-auto mt-12 flex max-w-[640px] justify-between gap-4 border-t border-filet px-4 pt-5 text-sm">
        {precedent ? <Link href={`/${rubrique}/${precedent.date}`} className="text-gris hover:text-encre">← {dateLongue(precedent.date)}</Link> : <span />}
        <Link href={`/jour/${date}`} className="text-gris hover:text-encre">Toutes les rubriques du jour</Link>
        {suivant ? <Link href={`/${rubrique}/${suivant.date}`} className="text-gris hover:text-encre">{dateLongue(suivant.date)} →</Link> : <span />}
      </nav>
    </main>
  );
}
