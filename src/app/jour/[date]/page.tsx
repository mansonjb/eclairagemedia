import Link from "next/link";
import { notFound } from "next/navigation";
import { dates, parDate, dateLongue, semaineDe, libelleSemaine } from "@/lib/editions";
import Journee from "@/components/Journee";
import Parcours from "@/components/Parcours";

export const dynamicParams = false;
export const generateStaticParams = () => dates().map((date) => ({ date }));
export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return { title: `L'édition du ${dateLongue(date).replace(/^./, (c) => c.toLowerCase())}` };
}

export default async function Jour({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const eds = parDate(date);
  if (!eds.length) notFound();
  const tous = dates();
  const i = tous.indexOf(date);
  const [suivant, precedent] = [tous[i - 1], tous[i + 1]];
  const s = semaineDe(date);
  const b = "rounded-full bg-white px-4 py-2.5 text-[14px] font-bold hover:bg-lavande";
  return (
    <main className="flex flex-col gap-5">
      <section className="flex flex-wrap items-end justify-between gap-5 px-2 pb-2 pt-7">
        <div>
          <div className="flex flex-wrap gap-2">
            {precedent && <Link href={`/jour/${precedent}`} className={b}>← La veille</Link>}
            <Link href={`/semaine/${s}`} className={b}>La semaine {libelleSemaine(s)}</Link>
            {suivant && <Link href={`/jour/${suivant}`} className={b}>Le lendemain →</Link>}
          </div>
          <h1 className="d mt-4 text-[34px] leading-none sm:text-[52px]">{dateLongue(date)}</h1>
        </div>
        <Parcours eds={eds} date={date} />
      </section>
      <Journee date={date} />
    </main>
  );
}
