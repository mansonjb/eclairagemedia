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
    <main className="flex flex-col gap-5 pt-7">
      <section className="px-2">
        <p className="text-[15px] font-semibold text-gris">L&apos;édition du week-end</p>
        <h1 className="d mt-1.5 text-[34px] leading-none sm:text-[48px]">{jours.map(dateLongue).join(" et ")}</h1>
        <Link href={`/semaine/${semaine}`} className="mt-5 inline-block rounded-full bg-white px-4 py-2.5 text-[14px] font-bold hover:bg-lavande">Toute la semaine {libelleSemaine(semaine)} →</Link>
      </section>
      <Recap jours={jours} />
    </main>
  );
}
