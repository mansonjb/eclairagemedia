import Link from "next/link";
import { notFound } from "next/navigation";
import { semaines, joursDeSemaine, estWeekEnd, dateLongue, libelleSemaine } from "@/lib/editions";
import Recap from "@/components/Recap";

export const dynamicParams = false;
export const generateStaticParams = () => semaines().filter((s) => joursDeSemaine(s).some(estWeekEnd)).map((semaine) => ({ semaine }));
export const metadata = { title: "Le récap du week-end" };

export default async function WeekEnd({ params }: { params: Promise<{ semaine: string }> }) {
  const { semaine } = await params;
  const jours = joursDeSemaine(semaine).filter(estWeekEnd);
  if (!jours.length) notFound();
  return (
    <main className="mx-auto max-w-4xl px-4 pt-10">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-gris">L&apos;édition du week-end</p>
      <h1 className="mt-1 text-4xl font-black">{jours.map(dateLongue).join(" et ")}</h1>
      <Link href={`/semaine/${semaine}`} className="mt-3 inline-block font-black text-bleu">Toute la semaine {libelleSemaine(semaine)} →</Link>
      <div className="mt-8"><Recap jours={jours} /></div>
    </main>
  );
}
