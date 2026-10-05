import { notFound } from "next/navigation";
import { ORDRE, RUBRIQUES, parRubrique, type RubriqueId } from "@/lib/editions";
import { Section, GrilleEditions, CarteSujet } from "@/components/ui";

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
    <main className="flex flex-col gap-5 pt-6">
      <section className="rounded-[28px] p-7 sm:p-10" style={{ backgroundColor: R.couleur }}>
        <span className="pastille bg-white/20 text-white">Chaque jour à {R.heure}</span>
        <h1 className="d mt-4 text-[38px] leading-none text-white sm:text-[56px]">{R.nom}</h1>
        <p className="mt-4 text-[17px] font-semibold leading-relaxed text-white/90">{R.accroche}</p>
      </section>
      {derniere && (
        <>
          <Section>La dernière édition</Section>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {derniere.sujets.map((s) => <CarteSujet key={s.n} e={derniere} s={s} />)}
          </div>
        </>
      )}
      {autres.length > 0 && (
        <>
          <Section>Les éditions précédentes</Section>
          <GrilleEditions eds={autres} avecDate />
        </>
      )}
    </main>
  );
}
