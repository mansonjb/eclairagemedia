import { notFound } from "next/navigation";
import { ORDRE, RUBRIQUES, parRubrique, type RubriqueId } from "@/lib/editions";
import { GrilleJour, Pastille } from "@/components/ui";

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
  return (
    <main>
      <section style={{ backgroundColor: R.fond }}>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Pastille r={rubrique} />
          <h1 className="mt-4 text-4xl font-black">{R.nom}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-encre/80">{R.accroche}</p>
          <p className="mt-3 text-sm font-black" style={{ color: R.couleur }}>Chaque jour à {R.heure}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <GrilleJour eds={parRubrique(rubrique)} avecDate />
      </section>
    </main>
  );
}
