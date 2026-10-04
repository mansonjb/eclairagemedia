import Link from "next/link";
import { notFound } from "next/navigation";
import { dates, parDate, dateLongue, semaineDe, libelleSemaine } from "@/lib/editions";
import Journee from "@/components/Journee";

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
  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="mt-4 rounded-[28px] bg-creme px-6 py-10 text-center">
        <span className="pastille bg-jaune text-encre">Le récap du jour</span>
        <h1 className="mt-4 text-[34px] font-extrabold sm:text-[44px]">{dateLongue(date)}</h1>
        <p className="mt-2 text-[15px] text-gris">{eds.reduce((n, e) => n + e.sujets.length, 0)} sujets dans {eds.length} éditions</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-extrabold">
          {precedent && <Link href={`/jour/${precedent}`} className="rounded-full bg-white px-4 py-2 hover:bg-fond">← La veille</Link>}
          <Link href={`/semaine/${s}`} className="rounded-full bg-white px-4 py-2 hover:bg-fond">La semaine {libelleSemaine(s)}</Link>
          {suivant && <Link href={`/jour/${suivant}`} className="rounded-full bg-white px-4 py-2 hover:bg-fond">Le lendemain →</Link>}
        </div>
      </section>
      <div className="mt-10"><Journee date={date} /></div>
    </main>
  );
}
