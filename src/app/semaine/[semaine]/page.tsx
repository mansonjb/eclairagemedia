import Link from "next/link";
import { notFound } from "next/navigation";
import { semaines, joursDeSemaine, libelleSemaine, estWeekEnd } from "@/lib/editions";
import Recap from "@/components/Recap";

export const dynamicParams = false;
export const generateStaticParams = () => semaines().map((semaine) => ({ semaine }));
export async function generateMetadata({ params }: { params: Promise<{ semaine: string }> }) {
  const { semaine } = await params;
  return { title: `La semaine ${libelleSemaine(semaine)}` };
}

export default async function Semaine({ params }: { params: Promise<{ semaine: string }> }) {
  const { semaine } = await params;
  const jours = joursDeSemaine(semaine);
  if (!jours.length) notFound();
  const liste = semaines();
  const i = liste.indexOf(semaine);
  return (
    <main className="mx-auto max-w-4xl px-4 pt-10">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-gris">L&apos;édition de la semaine</p>
      <h1 className="mt-1 text-4xl font-black">La semaine {libelleSemaine(semaine)}</h1>
      {jours.some(estWeekEnd) && <Link href={`/week-end/${semaine}`} className="mt-3 inline-block font-black text-bleu">Le récap du week-end →</Link>}
      <div className="mt-8"><Recap jours={jours} /></div>
      <nav className="mt-10 flex justify-between font-black">
        {liste[i + 1] ? <Link href={`/semaine/${liste[i + 1]}`} className="text-bleu">← Semaine précédente</Link> : <span />}
        {liste[i - 1] ? <Link href={`/semaine/${liste[i - 1]}`} className="text-bleu">Semaine suivante →</Link> : <span />}
      </nav>
    </main>
  );
}
