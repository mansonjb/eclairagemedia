import Link from "next/link";
import Image from "next/image";
import { RUBRIQUES, ORDRE, dateCourte, type Edition } from "@/lib/editions";

export function Pastille({ r, children }: { r: keyof typeof RUBRIQUES; children?: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white"
      style={{ backgroundColor: RUBRIQUES[r].couleur }}>
      {children ?? RUBRIQUES[r].court}
    </span>
  );
}

export function Entete() {
  return (
    <header className="border-b-2 border-encre/10 bg-creme">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" aria-label="Éclairage, accueil">
          <Image src="/logo-eclairage.png" alt="Éclairage" width={220} height={57} priority className="h-auto w-[170px] sm:w-[220px]" />
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-extrabold">
          <Link href="/archives" className="hover:text-bleu">Archives</Link>
          <Link href="/#rubriques" className="hover:text-bleu">Rubriques</Link>
          <Link href="/#methode" className="hover:text-bleu">Méthode</Link>
          <Link href="/#inscription" className="rounded-full bg-encre px-4 py-1.5 text-white hover:bg-bleu">S&apos;inscrire</Link>
        </nav>
      </div>
    </header>
  );
}

export function Pied() {
  return (
    <footer className="mt-20 bg-encre text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-black">Éclairage</p>
          <p className="mt-2 text-sm text-white/70">Comprendre avant de se faire une opinion.</p>
        </div>
        <div className="text-sm">
          <p className="font-extrabold">Rubriques</p>
          <ul className="mt-2 space-y-1 text-white/70">
            {ORDRE.map((r) => <li key={r}><Link href={`/${r}`} className="hover:text-white">{RUBRIQUES[r].court}</Link></li>)}
          </ul>
        </div>
        <div className="text-sm text-white/70">
          <p className="font-extrabold text-white">Contact</p>
          <p className="mt-2 select-all">bonjour@eclairagemedia.com</p>
          <p className="mt-4">Chaque fait est confirmé par au moins trois sources, dont une officielle. Photos Wikimedia Commons.</p>
        </div>
      </div>
    </footer>
  );
}

export function CarteEdition({ e, avecDate = false }: { e: Edition; avecDate?: boolean }) {
  const R = RUBRIQUES[e.rubrique];
  return (
    <Link href={`/${e.rubrique}/${e.date}`}
      className="group flex flex-col rounded-3xl border-2 border-transparent bg-white p-5 shadow-[0_2px_0_rgba(20,20,43,0.06)] transition hover:-translate-y-0.5 hover:border-encre/10">
      <div className="flex items-center justify-between gap-2">
        <Pastille r={e.rubrique} />
        {avecDate && <span className="text-xs font-bold text-gris">{dateCourte(e.date)}</span>}
      </div>
      <ol className="mt-4 space-y-3">
        {e.sujets.map((s) => (
          <li key={s.n} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
              style={{ backgroundColor: R.fond, color: R.couleur }}>{s.n}</span>
            <span className="text-[15px] font-extrabold leading-snug text-encre group-hover:underline decoration-2 underline-offset-2">{s.titre}</span>
          </li>
        ))}
      </ol>
      <span className="mt-auto pt-4 text-sm font-black" style={{ color: R.couleur }}>Lire l&apos;édition →</span>
    </Link>
  );
}

export function GrilleJour({ eds, avecDate = false }: { eds: Edition[]; avecDate?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {eds.map((e) => <CarteEdition key={e.rubrique + e.date} e={e} avecDate={avecDate} />)}
    </div>
  );
}
