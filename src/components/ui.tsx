/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { RUBRIQUES, ORDRE, dateLongue, dates, type Edition, type Sujet, type RubriqueId } from "@/lib/editions";

export function Kicker({ r, children, className = "" }: { r: RubriqueId; children?: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${className}`} style={{ color: RUBRIQUES[r].couleur }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RUBRIQUES[r].couleur }} />
      {children ?? RUBRIQUES[r].court}
    </span>
  );
}

// Photo du sujet, ou à défaut un visuel typographique aux couleurs de la rubrique
export function Visuel({ s, r, className = "", grand = false }: { s: Sujet; r: RubriqueId; className?: string; grand?: boolean }) {
  if (s.image) {
    return (
      <figure className={`overflow-hidden bg-creme ${className}`}>
        <img src={s.image} alt={s.legende ?? ""} loading={grand ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
      </figure>
    );
  }
  const R = RUBRIQUES[r];
  return (
    <div className={`relative flex items-end overflow-hidden ${className}`} style={{ backgroundColor: R.fond }} aria-hidden>
      <span className="absolute -right-10 -top-10 h-48 w-48 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(255,214,10,.55), rgba(255,214,10,0))" }} />
      <span className={`relative p-5 font-serif italic leading-none ${grand ? "text-5xl" : "text-3xl"}`} style={{ color: R.couleur }}>
        {s.theme.charAt(0) + s.theme.slice(1).toLowerCase()}
      </span>
    </div>
  );
}

export function Entete() {
  const aujourdhui = dates()[0];
  return (
    <header className="border-b border-filet bg-papier">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-4 text-xs text-gris">
        <span className="hidden sm:inline">{dateLongue(aujourdhui)}</span>
        <span className="font-serif italic">Comprendre avant de se faire une opinion.</span>
        <Link href="/#inscription" className="rounded-full bg-encre px-3.5 py-1.5 font-medium text-white transition hover:bg-black">S&apos;inscrire</Link>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-5 text-center">
        <Link href="/" aria-label="Éclairage, accueil" className="inline-block">
          <Image src="/logo-eclairage.png" alt="Éclairage" width={260} height={67} priority className="h-auto w-[180px] sm:w-[240px]" />
        </Link>
      </div>
      <nav className="border-t border-filet">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-3 text-[13px] font-medium text-texte [scrollbar-width:none] sm:justify-center">
          {ORDRE.map((r) => (
            <Link key={r} href={`/${r}`} className="flex shrink-0 items-center gap-2 hover:text-encre">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RUBRIQUES[r].couleur }} />{RUBRIQUES[r].court}
            </Link>
          ))}
          <span className="shrink-0 text-filet">|</span>
          <Link href="/archives" className="shrink-0 hover:text-encre">Archives</Link>
        </div>
      </nav>
    </header>
  );
}

export function Pied() {
  return (
    <footer className="mt-24 border-t border-filet bg-creme/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/logo-eclairage.png" alt="Éclairage" width={160} height={41} className="h-auto w-[140px]" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gris">
            Des newsletters quotidiennes pour comprendre l&apos;actualité, les institutions et les grands débats, même quand on part de zéro.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">Rubriques</p>
          <ul className="mt-3 space-y-1.5">
            {ORDRE.map((r) => <li key={r}><Link href={`/${r}`} className="hover:text-encre">{RUBRIQUES[r].nom}</Link></li>)}
          </ul>
        </div>
        <div className="text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">Contact</p>
          <p className="mt-3 select-all">bonjour@eclairagemedia.com</p>
          <p className="mt-4 text-xs leading-relaxed text-gris">Chaque fait est confirmé par au moins trois sources, dont une officielle. Photos Wikimedia Commons.</p>
        </div>
      </div>
    </footer>
  );
}

export function TitreSection({ sur, children, lien }: { sur?: string; children: React.ReactNode; lien?: { href: string; texte: string } }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-encre pb-3">
      <div>
        {sur && <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">{sur}</p>}
        <h2 className="font-serif text-2xl font-medium sm:text-3xl">{children}</h2>
      </div>
      {lien && <Link href={lien.href} className="text-sm font-medium text-encre underline decoration-filet decoration-2 underline-offset-4 hover:decoration-soleil">{lien.texte}</Link>}
    </div>
  );
}

// Carte d'une édition : photo, sujet principal, autres sujets
export function CarteEdition({ e, avecDate = false }: { e: Edition; avecDate?: boolean }) {
  const [p, ...autres] = e.sujets;
  if (!p) return null;
  return (
    <article className="group flex flex-col">
      <Link href={`/${e.rubrique}/${e.date}`} className="block">
        <Visuel s={p} r={e.rubrique} className="aspect-[3/2] w-full rounded-sm" />
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Kicker r={e.rubrique} />
        {avecDate && <span className="text-xs text-gris">{dateLongue(e.date)}</span>}
      </div>
      <Link href={`/${e.rubrique}/${e.date}`}>
        <h3 className="mt-2 font-serif text-[1.35rem] font-medium leading-snug group-hover:underline decoration-soleil decoration-2 underline-offset-4">{p.titre}</h3>
      </Link>
      {p.chapeau && <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-gris">{p.chapeau}</p>}
      {autres.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-filet pt-3">
          {autres.map((s) => (
            <li key={s.n}><Link href={`/${e.rubrique}/${e.date}`} className="block text-[15px] leading-snug text-texte hover:text-encre">{s.titre}</Link></li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function GrilleEditions({ eds, avecDate = false }: { eds: Edition[]; avecDate?: boolean }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {eds.map((e) => <CarteEdition key={e.rubrique + e.date} e={e} avecDate={avecDate} />)}
    </div>
  );
}
