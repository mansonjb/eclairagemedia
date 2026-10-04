import Link from "next/link";
import { semaines, joursDeSemaine, libelleSemaine, dateLongue, parDate, estWeekEnd } from "@/lib/editions";
import { Pastille } from "@/components/ui";

export const metadata = { title: "Archives" };

export default function Archives() {
  return (
    <main className="mx-auto max-w-4xl px-4 pt-10">
      <h1 className="text-4xl font-black">Archives</h1>
      <p className="mt-2 font-semibold text-gris">Toutes les éditions, jour par jour, avec les récaps de la semaine et du week-end.</p>
      <div className="mt-8 space-y-8">
        {semaines().map((s) => {
          const jours = joursDeSemaine(s).reverse();
          return (
            <section key={s}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-black">Semaine {libelleSemaine(s)}</h2>
                <div className="flex gap-4 text-sm font-black">
                  <Link href={`/semaine/${s}`} className="text-bleu">Récap de la semaine</Link>
                  {jours.some(estWeekEnd) && <Link href={`/week-end/${s}`} className="text-bleu">Récap du week-end</Link>}
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {jours.map((d) => (
                  <Link key={d} href={`/jour/${d}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 hover:-translate-y-0.5 transition">
                    <span className="font-black">{dateLongue(d)}</span>
                    <span className="flex flex-wrap gap-1.5">{parDate(d).map((e) => <Pastille key={e.rubrique} r={e.rubrique} />)}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
