import Link from "next/link";
import { notFound } from "next/navigation";
import { RUBRIQUES, editions, trouver, dateLongue, complementaires, lienSujet, type RubriqueId } from "@/lib/editions";
import { Pastille, CarteSujet } from "@/components/ui";
import Bento from "@/components/Bento";
import { Progression, Actions } from "@/components/dyn/Lecture";

type P = { params: Promise<{ rubrique: RubriqueId; date: string; n: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => editions.flatMap((e) => e.sujets.map((s) => ({ rubrique: e.rubrique, date: e.date, n: String(s.n) })));
export async function generateMetadata({ params }: P) {
  const { rubrique, date, n } = await params;
  const s = trouver(rubrique, date)?.sujets.find((x) => String(x.n) === n);
  return { title: s?.titre ?? RUBRIQUES[rubrique].nom, description: s?.chapeau ?? undefined };
}

// Un sujet, seul sur sa page ; les autres sont proposés à la fin, jamais affichés à la suite
export default async function PageSujet({ params }: P) {
  const { rubrique, date, n } = await params;
  const e = trouver(rubrique, date);
  const s = e?.sujets.find((x) => String(x.n) === n);
  if (!e || !s) notFound();
  const R = RUBRIQUES[rubrique];
  const memeEdition = e.sujets.filter((x) => x.n !== s.n);
  const proches = complementaires(e, s, 8).filter((x) => x.e !== e).slice(0, 3);
  const b = "rounded-full bg-white px-4 py-2.5 text-[14px] font-bold hover:bg-lavande";
  return (
    <main className="flex flex-col gap-5 pt-6">
      <Progression couleur={R.couleur} />
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/${rubrique}/${date}`} className={b}>← {R.court} du {dateLongue(date).replace(/^./, (c) => c.toLowerCase())}</Link>
        <Pastille r={rubrique} plein>{R.nom}</Pastille>
        <span className="text-[13px] font-bold text-gris">Sujet {s.n} sur {e.sujets.length}</span>
      </div>

      <Bento e={e} s={s} />

      {proches.length > 0 && (
        <section className="mt-8 flex flex-col gap-5">
          <h2 className="d px-2 text-[28px]">Sujets complémentaires</h2>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proches.map((x) => <CarteSujet key={lienSujet(x.e, x.s)} e={x.e} s={x.s} />)}
          </div>
        </section>
      )}
      {memeEdition.length > 0 && (
        <section className="carte p-6">
          <p className="text-[13px] font-extrabold tracking-[0.06em]" style={{ color: R.couleur }}>ÉGALEMENT DANS L&apos;ÉDITION {R.court.toUpperCase()} DU JOUR</p>
          <ul className="mt-3 divide-y divide-filet">
            {memeEdition.map((x) => (
              <li key={x.n}><Link href={lienSujet(e, x)} className="flex items-center gap-3 py-3 text-[16px] font-bold hover:text-bleu">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] text-white" style={{ backgroundColor: R.couleur }}>{x.n}</span>{x.titre}
              </Link></li>
            ))}
          </ul>
        </section>
      )}
      <Actions titre={s.titre} />
    </main>
  );
}
