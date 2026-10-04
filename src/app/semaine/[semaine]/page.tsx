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
    <main className="mx-auto max-w-4xl px-4 pt-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">L&apos;édition de la semaine</p>
      <h1 className="mt-3 font-serif text-5xl font-medium tracking-[-0.01em]">La semaine {libelleSemaine(semaine)}</h1>
      {jours.some(estWeekEnd) && <Link href={`/week-end/${semaine}`} className="mt-4 inline-block text-sm underline decoration-soleil decoration-2 underline-offset-4">Le récap du week-end →</Link>}
      <div className="mt-12"><Recap jours={jours} /></div>
      <nav className="mt-14 flex justify-between border-t border-filet pt-5 text-sm">
        {liste[i + 1] ? <Link href={`/semaine/${liste[i + 1]}`} className="text-gris hover:text-encre">← Semaine précédente</Link> : <span />}
        {liste[i - 1] ? <Link href={`/semaine/${liste[i - 1]}`} className="text-gris hover:text-encre">Semaine suivante →</Link> : <span />}
      </nav>
    </main>
  );
}
