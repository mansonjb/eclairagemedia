import Link from "next/link";
import { notFound } from "next/navigation";
import { dates, parDate, dateLongue, semaineDe, libelleSemaine } from "@/lib/editions";
import Une from "@/components/Une";

export const dynamicParams = false;
export const generateStaticParams = () => dates().map((date) => ({ date }));
export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return { title: `L'édition du ${dateLongue(date).replace(/^./, (c) => c.toLowerCase())}` };
}

export default async function Jour({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!parDate(date).length) notFound();
  const tous = dates();
  const i = tous.indexOf(date);
  const [suivant, precedent] = [tous[i - 1], tous[i + 1]];
  const s = semaineDe(date);
  return (
    <main>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-b border-filet px-4 py-4 text-sm">
        {precedent ? <Link href={`/jour/${precedent}`} className="text-gris hover:text-encre">← {dateLongue(precedent)}</Link> : <span />}
        <span className="font-serif text-lg text-encre">{dateLongue(date)}</span>
        {suivant ? <Link href={`/jour/${suivant}`} className="text-gris hover:text-encre">{dateLongue(suivant)} →</Link> : <Link href={`/semaine/${s}`} className="text-gris hover:text-encre">La semaine {libelleSemaine(s)}</Link>}
      </div>
      <Une date={date} />
    </main>
  );
}
