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
    <main className="mx-auto max-w-5xl px-4">
      <section className="relative mt-4 overflow-hidden rounded-[28px] bg-creme px-6 py-10 text-center">
        <span className="halo absolute left-1/2 top-0 h-72 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <span className="pastille relative bg-orange text-white">L&apos;édition du week-end</span>
        <h1 className="relative mt-4 text-[30px] font-extrabold sm:text-[40px]">{jours.map(dateLongue).join(" et ")}</h1>
        <Link href={`/semaine/${semaine}`} className="relative mt-5 inline-block rounded-full bg-white px-4 py-2 text-sm font-extrabold hover:bg-fond">Toute la semaine {libelleSemaine(semaine)} →</Link>
      </section>
      <div className="mt-10"><Recap jours={jours} /></div>
    </main>
  );
}
