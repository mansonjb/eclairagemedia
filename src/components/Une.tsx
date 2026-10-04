import Link from "next/link";
import { RUBRIQUES, parDate, une, chiffresDuJour, motDuJour } from "@/lib/editions";
import { Kicker, Visuel, TitreSection, GrilleEditions } from "@/components/ui";

// La « une » d'un jour : sujet principal, en 30 secondes, chiffres, rubriques, mot du jour
export default function Une({ date }: { date: string }) {
  const u = une(date);
  const eds = parDate(date);
  const chiffres = chiffresDuJour(date).slice(0, 4);
  const mot = motDuJour(date);
  return (
    <>
      {u && (
        <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 lg:grid-cols-12 lg:gap-12">
          <Link href={`/${u.e.rubrique}/${date}`} className="group lg:col-span-7">
            <Visuel s={u.s} r={u.e.rubrique} grand className="aspect-[4/3] w-full rounded-sm" />
            {u.s.legende && <p className="mt-2 text-xs text-gris">{u.s.legende} · Wikimedia Commons</p>}
          </Link>
          <div className="flex flex-col justify-center lg:col-span-5">
            <Kicker r={u.e.rubrique}>À la une · {RUBRIQUES[u.e.rubrique].court}</Kicker>
            <Link href={`/${u.e.rubrique}/${date}`} className="group">
              <h1 className="mt-4 font-serif text-[2.1rem] font-medium leading-[1.12] tracking-[-0.01em] group-hover:underline decoration-soleil decoration-2 underline-offset-[6px] sm:text-[2.6rem]">{u.s.titre}</h1>
            </Link>
            {u.s.chapeau && <p className="mt-5 text-[17px] leading-relaxed text-texte">{u.s.chapeau}</p>}
            {u.s.eclairage && (
              <p className="mt-5 border-l-2 border-soleil pl-4 font-serif text-lg italic text-encre">
                <span className="not-italic text-[11px] font-sans font-semibold uppercase tracking-[0.16em] text-gris">L&apos;éclairage · </span>{u.s.eclairage}
              </p>
            )}
            <Link href={`/${u.e.rubrique}/${date}`} className="mt-6 text-sm font-medium text-encre underline decoration-soleil decoration-2 underline-offset-4">Lire l&apos;édition complète</Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <TitreSection sur="Tout ce qu'il faut savoir aujourd'hui">En 30 secondes</TitreSection>
        <div className="mt-2 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {eds.map((e) => (
            <div key={e.rubrique} className="border-b border-filet py-5">
              <Kicker r={e.rubrique} />
              <ul className="mt-3 space-y-2.5">
                {e.sujets.map((s) => (
                  <li key={s.n} className="flex gap-3">
                    <span className="font-serif text-sm text-gris">{s.n}</span>
                    <Link href={`/${e.rubrique}/${date}`} className="text-[15px] leading-snug text-texte hover:text-encre hover:underline decoration-soleil decoration-2 underline-offset-2">{s.titre}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {chiffres.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <TitreSection sur="Pour prendre la mesure">Les chiffres du jour</TitreSection>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {chiffres.map((c) => (
              <Link key={c.rubrique} href={`/${c.rubrique}/${date}`} className="group">
                <p className="font-serif text-5xl font-medium tracking-tight text-encre"><span className="halo">{c.valeur}</span></p>
                <p className="mt-3 text-[15px] leading-snug text-texte">{c.legende}</p>
                <Kicker r={c.rubrique} className="mt-3" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <TitreSection sur="Les six éditions du jour">Par rubrique</TitreSection>
        <div className="mt-8"><GrilleEditions eds={eds} /></div>
      </section>

      {mot && (
        <section className="mx-auto max-w-6xl px-4 pt-20">
          <div className="grid gap-6 bg-creme px-6 py-10 sm:px-12 lg:grid-cols-[1fr_2fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">Le mot du jour</p>
              <p className="mt-2 font-serif text-4xl font-medium italic text-encre"><span className="halo">{mot.terme}</span></p>
            </div>
            <p className="font-serif text-xl leading-relaxed text-texte">{mot.definition}</p>
          </div>
        </section>
      )}
    </>
  );
}
