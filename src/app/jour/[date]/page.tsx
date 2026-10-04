import Link from "next/link";
import { notFound } from "next/navigation";
import { dates, parDate, dateLongue, semaineDe, libelleSemaine } from "@/lib/editions";
import { GrilleJour } from "@/components/ui";

export const dynamicParams = false;
export const generateStaticParams = () => dates().map((date) => ({ date }));
export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return { title: `Le récap du ${dateLongue(date)}` };
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
    <main className="mx-auto max-w-6xl px-4 pt-10">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-gris">Le récap du jour</p>
      <h1 className="mt-1 text-4xl font-black">{dateLongue(date)}</h1>
      <p className="mt-2 font-semibold text-gris">
        {eds.reduce((n, e) => n + e.sujets.length, 0)} sujets dans {eds.length} éditions.
      </p>
      <div className="mt-8"><GrilleJour eds={eds} /></div>
      <nav className="mt-10 flex flex-wrap justify-between gap-4 font-black">
        {precedent ? <Link href={`/jour/${precedent}`} className="text-bleu">← {dateLongue(precedent)}</Link> : <span />}
        <Link href={`/semaine/${s}`} className="text-bleu">La semaine {libelleSemaine(s)}</Link>
        {suivant ? <Link href={`/jour/${suivant}`} className="text-bleu">{dateLongue(suivant)} →</Link> : <span />}
      </nav>
    </main>
  );
}
