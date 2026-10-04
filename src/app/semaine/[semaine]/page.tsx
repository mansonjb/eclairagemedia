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
  const b = "rounded-full bg-white px-4 py-2.5 text-[14px] font-bold hover:bg-lavande";
  return (
    <main className="flex flex-col gap-5 pt-7">
      <section className="px-2">
        <p className="text-[15px] font-semibold text-gris">L&apos;édition de la semaine · {nb} sujets en {jours.length} jours</p>
        <h1 className="d mt-1.5 text-[34px] leading-none sm:text-[52px]">La semaine <span className="surligne">{libelleSemaine(semaine)}</span></h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {liste[i + 1] && <Link href={`/semaine/${liste[i + 1]}`} className={b}>← Semaine précédente</Link>}
          {jours.some(estWeekEnd) && <Link href={`/week-end/${semaine}`} className={b}>Le récap du week-end</Link>}
          {liste[i - 1] && <Link href={`/semaine/${liste[i - 1]}`} className={b}>Semaine suivante →</Link>}
        </div>
      </section>
      <Recap jours={jours} />
    </main>
  );
}
