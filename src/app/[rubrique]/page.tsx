import { notFound } from "next/navigation";
import { ORDRE, RUBRIQUES, parRubrique, type RubriqueId } from "@/lib/editions";
import { CarteSujet, GrilleEditions, Section } from "@/components/ui";
import { Icone } from "@/components/Icones";

export const dynamicParams = false;
export const generateStaticParams = () => ORDRE.map((rubrique) => ({ rubrique }));
export async function generateMetadata({ params }: { params: Promise<{ rubrique: RubriqueId }> }) {
  const { rubrique } = await params;
  return { title: rubrique === "politique" ? "Politique" : RUBRIQUES[rubrique]?.nom, description: RUBRIQUES[rubrique]?.accroche };
}

export default async function Rubrique({ params }: { params: Promise<{ rubrique: RubriqueId }> }) {
  const { rubrique } = await params;
  const R = RUBRIQUES[rubrique];
  if (!R) notFound();
  const [derniere, ...autres] = parRubrique(rubrique);
  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="relative mt-4 overflow-hidden rounded-[28px] px-6 py-12 sm:px-10" style={{ backgroundColor: R.fond }}>
        <Icone r={rubrique} className="absolute -bottom-6 right-4 h-48 w-48 opacity-[0.08]" />
        <span className="halo absolute -right-20 -top-24 h-80 w-80 rounded-full" />
        <div className="relative" style={{ color: R.couleur }}>
          <Icone r={rubrique} className="h-10 w-10" />
        </div>
        <span className="pastille relative mt-4 text-white" style={{ backgroundColor: R.couleur }}>Chaque jour à {R.heure}</span>
        <h1 className="relative mt-4 text-[36px] font-extrabold sm:text-[48px]">{R.nom}</h1>
        <p className="relative mt-3 max-w-2xl text-[17px] font-semibold leading-relaxed">{R.accroche}</p>
      </section>
      {derniere && (
        <section className="mt-10">
          <Section couleur={R.couleur}>La dernière édition</Section>
          <div className="mt-3"><CarteSujet e={derniere} s={derniere.sujets[0]} grand /></div>
          {derniere.sujets.length > 1 && (
            <div className="mt-4 grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
              {derniere.sujets.slice(1).map((s) => <CarteSujet key={s.n} e={derniere} s={s} />)}
            </div>
          )}
        </section>
      )}
      {autres.length > 0 && (
        <section className="mt-12">
          <Section>Les éditions précédentes</Section>
          <div className="mt-3"><GrilleEditions eds={autres} avecDate /></div>
        </section>
      )}
    </main>
  );
}
