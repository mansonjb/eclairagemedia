import Link from "next/link";
import { notFound } from "next/navigation";
import { semaines, joursDeSemaine, libelleSemaine, estWeekEnd, parDate } from "@/lib/editions";
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
  const nb = jours.reduce((n, d) => n + parDate(d).reduce((m, e) => m + e.sujets.length, 0), 0);
  const nav = "rounded-full bg-white px-4 py-2 text-sm font-extrabold hover:bg-fond";
  return (
    <main className="mx-auto max-w-5xl px-4">
      <section className="relative mt-4 overflow-hidden rounded-[28px] bg-creme px-6 py-10 text-center">
        <span className="halo absolute left-1/2 top-0 h-72 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <span className="pastille relative bg-jaune text-encre">L&apos;édition de la semaine</span>
        <h1 className="relative mt-4 text-[32px] font-extrabold sm:text-[44px]">La semaine {libelleSemaine(semaine)}</h1>
        <p className="relative mt-2 text-[15px] text-gris">{nb} sujets en {jours.length} jours</p>
        <div className="relative mt-5 flex flex-wrap justify-center gap-3">
          {liste[i + 1] && <Link href={`/semaine/${liste[i + 1]}`} className={nav}>← Semaine précédente</Link>}
          {jours.some(estWeekEnd) && <Link href={`/week-end/${semaine}`} className={nav}>Le récap du week-end</Link>}
          {liste[i - 1] && <Link href={`/semaine/${liste[i - 1]}`} className={nav}>Semaine suivante →</Link>}
        </div>
      </section>
      <div className="mt-10"><Recap jours={jours} /></div>
    </main>
  );
}
