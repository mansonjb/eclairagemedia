/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { RUBRIQUES, ORDRE, dates, dateLongue, type Edition, type Sujet, type RubriqueId } from "@/lib/editions";
import { Icone } from "@/components/Icones";

const R = RUBRIQUES;

export function Pastille({ r, children, plein = true }: { r: RubriqueId; children?: React.ReactNode; plein?: boolean }) {
  return (
    <span className="pastille" style={plein ? { backgroundColor: R[r].couleur, color: "#fff" } : { backgroundColor: R[r].fond, color: R[r].couleur }}>
      {children ?? R[r].court}
    </span>
  );
}

// Grande pastille de section, comme « FRANCE » ou « À VENIR » dans la newsletter
export function Section({ couleur = "#14142b", texte = "#fff", children }: { couleur?: string; texte?: string; children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full px-4 py-2 text-[13px] font-extrabold uppercase tracking-[0.06em]" style={{ backgroundColor: couleur, color: texte }}>
      {children}
    </span>
  );
}

export function Entete() {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-4">
      <div className="rounded-[28px] bg-creme px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" aria-label="Éclairage, accueil">
            <Image src="/logo-eclairage.png" alt="Éclairage" width={220} height={57} priority className="h-auto w-[150px] sm:w-[190px]" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="pastille hidden bg-jaune text-encre sm:inline-flex">{dateLongue(dates()[0])}</span>
            <Link href="/#inscription" className="pastille bg-encre py-2 text-white hover:bg-black">S&apos;inscrire</Link>
          </div>
        </div>
        <nav className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {ORDRE.map((r) => (
            <Link key={r} href={`/${r}`} className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-bold transition hover:bg-white"
              style={{ borderColor: R[r].couleur, color: R[r].couleur }}
              data-r={r}>
              <Icone r={r} className="h-4 w-4" />{R[r].court}
            </Link>
          ))}
          <Link href="/archives" className="flex shrink-0 items-center rounded-full border border-encre/20 px-3 py-1.5 text-[13px] font-bold text-encre hover:bg-white">Archives</Link>
        </nav>
      </div>
    </header>
  );
}

export function Pied() {
  return (
    <footer className="mx-auto mt-20 max-w-6xl px-4 pb-8">
      <div className="rounded-[28px] bg-encre px-6 py-10 text-lavande sm:px-10">
        <span className="pastille bg-jaune text-encre">Éclairage</span>
        <p className="mt-4 max-w-xl text-xl font-bold text-white">Comprendre avant de se faire une opinion.</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed">
          Des newsletters quotidiennes pour comprendre l&apos;actualité, les institutions et les grands débats, même quand on part de zéro.
          Chaque fait est confirmé par au moins trois sources, dont une officielle. Photos Wikimedia Commons.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          {ORDRE.map((r) => <Link key={r} href={`/${r}`} className="text-white/80 hover:text-white">{R[r].nom}</Link>)}
          <Link href="/archives" className="text-white/80 hover:text-white">Archives</Link>
        </div>
        <p className="mt-6 select-all text-sm text-white">bonjour@eclairagemedia.com</p>
      </div>
    </footer>
  );
}

// Photo du sujet, ou visuel de rubrique (pictogramme et thème) quand il n'y en a pas
export function Visuel({ s, r, className = "aspect-[16/10]", grand = false }: { s: Sujet; r: RubriqueId; className?: string; grand?: boolean }) {
  if (s.image) {
    return <img src={s.image} alt={s.legende ?? ""} loading={grand ? "eager" : "lazy"} className={`w-full rounded-[18px] object-cover ${className}`} />;
  }
  return (
    <div className={`relative w-full overflow-hidden rounded-[18px] ${className}`} style={{ backgroundColor: R[r].fond }} aria-hidden>
      <span className="halo absolute -right-16 -top-16 h-64 w-64 rounded-full" />
      <Icone r={r} className="absolute bottom-4 right-4 h-20 w-20 opacity-25" />
      <div className="absolute bottom-4 left-5" style={{ color: R[r].couleur }}>
        <Icone r={r} className={grand ? "h-9 w-9" : "h-7 w-7"} />
        <p className={`mt-2 font-extrabold uppercase tracking-[0.06em] ${grand ? "text-lg" : "text-sm"}`}>{s.theme}</p>
      </div>
    </div>
  );
}

export function Etiquette({ r, s }: { r: RubriqueId; s: Sujet }) {
  return <p className="text-[12px] font-extrabold uppercase tracking-[0.06em]" style={{ color: R[r].couleur }}>{s.n} · {s.theme}</p>;
}

export function Tuiles({ r, s, max = 3 }: { r: RubriqueId; s: Sujet; max?: number }) {
  if (!s.chiffres.length) return null;
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(max, s.chiffres.length)}, minmax(0, 1fr))` }}>
      {s.chiffres.slice(0, max).map((c) => (
        <div key={c.valeur + c.legende} className="rounded-[14px] px-2 py-3 text-center" style={{ backgroundColor: R[r].fond }}>
          <p className="whitespace-nowrap text-xl font-extrabold leading-tight tracking-tight" style={{ color: R[r].couleur }}>{c.valeur}</p>
          <p className="mt-1 text-[11.5px] font-semibold leading-snug text-gris">{c.legende}</p>
        </div>
      ))}
    </div>
  );
}

export function Eclairage({ texte }: { texte: string }) {
  return (
    <div className="rounded-[18px] bg-jaune-pale px-5 py-4">
      <span className="pastille bg-encre text-jaune">L&apos;éclairage</span>
      <p className="mt-2.5 text-[16px] font-bold leading-snug">{texte}</p>
    </div>
  );
}

export function CeQueCaChange({ texte }: { texte: string }) {
  return (
    <div className="rounded-[18px] bg-encre px-5 py-4 text-[14.5px] leading-relaxed text-white">
      <p className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-jaune">Ce que ça change</p>
      <p className="mt-1.5">{texte}</p>
    </div>
  );
}

// Sujet complet, composé comme dans la newsletter
export function CarteSujet({ e, s, grand = false }: { e: Edition; s: Sujet; grand?: boolean }) {
  const lien = `/${e.rubrique}/${e.date}`;
  return (
    <article className={`carte p-4 sm:p-5 ${grand ? "lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-7" : ""}`}>
      <div>
        <Link href={lien}><Visuel s={s} r={e.rubrique} grand={grand} className={grand ? "aspect-[4/3]" : "aspect-[16/10]"} /></Link>
        {s.legende && <p className="mt-2 px-1 text-[11.5px] text-gris-clair">{s.legende} · Wikimedia Commons</p>}
      </div>
      <div className={`px-1 pt-4 sm:px-2 ${grand ? "lg:pt-1" : ""}`}>
        <Etiquette r={e.rubrique} s={s} />
        <Link href={lien}>
          <h3 className={`mt-1.5 font-extrabold leading-[1.15] hover:underline decoration-jaune decoration-[3px] underline-offset-4 ${grand ? "text-[28px] sm:text-[32px]" : "text-[22px]"}`}>{s.titre}</h3>
        </Link>
        <div className="mt-4"><Tuiles r={e.rubrique} s={s} /></div>
        {s.chapeau && <p className="mt-4 text-[15px] leading-relaxed"><b>Ce qui s&apos;est passé.</b> {s.chapeau}</p>}
        <div className="mt-4 space-y-3">
          {s.eclairage && <Eclairage texte={s.eclairage} />}
          {grand && s.change && <CeQueCaChange texte={s.change} />}
        </div>
        <Link href={lien} className="mt-4 inline-block text-sm font-extrabold" style={{ color: R[e.rubrique].couleur }}>Lire l&apos;édition complète →</Link>
      </div>
    </article>
  );
}

// Carte compacte d'une édition (une rubrique, un jour)
export function CarteEdition({ e, avecDate = false }: { e: Edition; avecDate?: boolean }) {
  const [p, ...autres] = e.sujets;
  if (!p) return null;
  const lien = `/${e.rubrique}/${e.date}`;
  return (
    <article className="carte flex flex-col p-4">
      <div className="flex items-center justify-between gap-2 px-1 pb-3">
        <span className="flex items-center gap-2" style={{ color: R[e.rubrique].couleur }}>
          <Icone r={e.rubrique} className="h-5 w-5" /><Pastille r={e.rubrique} />
        </span>
        <span className="text-xs font-semibold text-gris">{avecDate ? dateLongue(e.date) : R[e.rubrique].heure}</span>
      </div>
      <Link href={lien}><Visuel s={p} r={e.rubrique} className="aspect-[16/10]" /></Link>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <Etiquette r={e.rubrique} s={p} />
        <Link href={lien}><h3 className="mt-1.5 text-[19px] font-extrabold leading-snug hover:underline decoration-jaune decoration-[3px] underline-offset-4">{p.titre}</h3></Link>
        {p.chiffres[0] && <div className="mt-3"><Tuiles r={e.rubrique} s={p} max={2} /></div>}
        {autres.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-filet pt-3">
            {autres.map((s) => (
              <li key={s.n} className="flex gap-2 text-[14.5px] leading-snug">
                <span className="font-extrabold" style={{ color: R[e.rubrique].couleur }}>→</span>
                <Link href={lien} className="hover:underline">{s.titre}</Link>
              </li>
            ))}
          </ul>
        )}
        <Link href={lien} className="mt-auto pt-4 text-sm font-extrabold" style={{ color: R[e.rubrique].couleur }}>Lire l&apos;édition →</Link>
      </div>
    </article>
  );
}

export function GrilleEditions({ eds, avecDate = false }: { eds: Edition[]; avecDate?: boolean }) {
  return (
    <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {eds.map((e) => <CarteEdition key={e.rubrique + e.date} e={e} avecDate={avecDate} />)}
    </div>
  );
}

// Tuile de date façon agenda de la newsletter
export function TuileDate({ jour, mois, couleur = "#ff6a3d", fond = "#ffe4d9" }: { jour: string; mois: string; couleur?: string; fond?: string }) {
  return (
    <div className="w-16 shrink-0 rounded-[16px] py-2 text-center" style={{ backgroundColor: fond, color: couleur }}>
      <p className="text-[22px] font-extrabold leading-none">{jour}</p>
      <p className="mt-0.5 text-[11px] font-bold uppercase">{mois}</p>
    </div>
  );
}

export function jourMois(date: string) {
  const d = new Date(date + "T12:00:00Z");
  return { jour: String(d.getUTCDate()), mois: new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" }).format(d).replace(".", "") };
}
