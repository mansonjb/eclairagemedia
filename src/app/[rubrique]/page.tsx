import Link from "next/link";
import { notFound } from "next/navigation";
import { ORDRE, RUBRIQUES, parRubrique, dateLongue, type RubriqueId } from "@/lib/editions";
import { Kicker, Visuel, CarteEdition } from "@/components/ui";

export const dynamicParams = false;
export const generateStaticParams = () => ORDRE.map((rubrique) => ({ rubrique }));
export async function generateMetadata({ params }: { params: Promise<{ rubrique: RubriqueId }> }) {
  const { rubrique } = await params;
  return { title: RUBRIQUES[rubrique]?.nom, description: RUBRIQUES[rubrique]?.accroche };
}

export default async function Rubrique({ params }: { params: Promise<{ rubrique: RubriqueId }> }) {
  const { rubrique } = await params;
  const R = RUBRIQUES[rubrique];
  if (!R) notFound();
  const [derniere, ...autres] = parRubrique(rubrique);
  return (
    <main>
      <header className="mx-auto max-w-6xl px-4 pt-12">
        <Kicker r={rubrique}>Chaque jour à {R.heure}</Kicker>
        <h1 className="mt-3 font-serif text-5xl font-medium tracking-[-0.01em]">{R.nom}</h1>
        <span className="mt-4 block h-0.5 w-12" style={{ backgroundColor: R.couleur }} />
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gris">{R.accroche}</p>
      </header>
      {derniere && (
        <section className="mx-auto mt-12 max-w-6xl px-4">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">Dernière édition</p>
          <div className="max-w-xl"><CarteEdition e={derniere} avecDate /></div>
        </section>
      )}
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <p className="border-b border-encre pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">Éditions précédentes</p>
        <div className="divide-y divide-filet">
          {autres.map((e) => (
            <Link key={e.date} href={`/${rubrique}/${e.date}`} className="group grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[180px_1fr]">
              {e.sujets[0] && <Visuel s={e.sujets[0]} r={rubrique} className="aspect-[4/3] w-full rounded-sm" />}
              <div>
                <p className="text-xs text-gris">{dateLongue(e.date)}</p>
                <p className="mt-1 font-serif text-xl font-medium leading-snug text-encre group-hover:underline decoration-soleil decoration-2 underline-offset-4">{e.sujets[0]?.titre}</p>
                <p className="mt-2 hidden text-sm leading-snug text-gris sm:block">{e.sujets.slice(1).map((s) => s.titre).join(" · ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
