/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { RUBRIQUES, ORDRE, dateLongue, type Edition, type Sujet, type RubriqueId } from "@/lib/editions";
import Inscription from "@/components/Inscription";

const R = RUBRIQUES;

export function Pastille({ r, children, plein = false }: { r: RubriqueId; children?: React.ReactNode; plein?: boolean }) {
  return (
    <span className="pastille" style={plein ? { backgroundColor: R[r].couleur, color: "#fff" } : { backgroundColor: R[r].fond, color: R[r].couleur }}>
      {children ?? R[r].court}
    </span>
  );
}

// Titre de section façon maquette : grand titre + lien à droite
export function Section({ children, lien, id }: { children: React.ReactNode; lien?: { href: string; texte: string }; id?: string; couleur?: string; texte?: string }) {
  return (
    <div id={id} className="flex scroll-mt-6 items-baseline justify-between gap-4 px-2 pt-7">
      <h2 className="d text-[26px] sm:text-[30px]">{children}</h2>
      {lien && <Link href={lien.href} className="shrink-0 text-[14px] font-bold underline underline-offset-4 hover:text-bleu">{lien.texte}</Link>}
    </div>
  );
}

export function Visuel({ s, className = "aspect-[16/10]" }: { s: Sujet; r?: RubriqueId; className?: string; grand?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[20px] bg-filet ${className}`}>
      {s.image && <img src={s.image} alt={s.legende ?? ""} loading="lazy" className="h-full w-full object-cover" />}
      {s.legende?.endsWith("(illustration)") && <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-[10.5px] font-semibold text-white backdrop-blur-sm">Illustration</span>}
    </div>
  );
}

export function Tuiles({ r, s, max = 3 }: { r: RubriqueId; s: Sujet; max?: number }) {
  if (!s.chiffres.length) return null;
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${Math.min(max, s.chiffres.length)}, minmax(0, 1fr))` }}>
      {s.chiffres.slice(0, max).map((c) => (
        <div key={c.valeur + c.legende} className="rounded-[16px] px-2 py-3 text-center" style={{ backgroundColor: R[r].fond }}>
          <p className="d whitespace-nowrap text-[22px] leading-none" style={{ color: R[r].couleur }}>{c.valeur}</p>
          <p className="mt-1.5 text-[11.5px] font-semibold leading-snug text-gris">{c.legende}</p>
        </div>
      ))}
    </div>
  );
}

export function Eclairage({ texte }: { texte: string }) {
  return (
    <div className="rounded-[20px] bg-jaune-pale px-4 py-3.5">
      <p className="text-[11.5px] font-extrabold tracking-[0.04em] text-encre/70">L&apos;ÉCLAIRAGE</p>
      <p className="mt-1 text-[14.5px] font-bold leading-snug">{texte}</p>
    </div>
  );
}

export function CeQueCaChange({ texte }: { texte: string }) {
  return (
    <div className="rounded-[20px] bg-encre px-4 py-3.5 text-white">
      <p className="text-[11.5px] font-extrabold tracking-[0.04em] text-jaune">CE QUE ÇA CHANGE</p>
      <p className="mt-1 text-[14.5px] leading-relaxed">{texte}</p>
    </div>
  );
}

export function Etiquette({ r, s }: { r: RubriqueId; s: Sujet }) {
  return <p className="text-[12px] font-extrabold uppercase tracking-[0.04em]" style={{ color: R[r].couleur }}>{s.n} · {s.theme}</p>;
}

export function Meta({ s, minutes }: { s: Sujet; minutes: number }) {
  return <span className="text-[13px] font-semibold text-gris">{s.sources.length ? `${s.sources.length} sources vérifiées · ` : ""}{minutes} min de lecture</span>;
}

// Carte « autre sujet du jour »
export function CarteSujet({ e, s }: { e: Edition; s: Sujet; grand?: boolean }) {
  const lien = `/${e.rubrique}/${e.date}`;
  return (
    <article className="carte flex flex-col p-3">
      <Link href={lien}><Visuel s={s} /></Link>
      <div className="flex flex-1 flex-col gap-3 px-3 pb-2.5 pt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Pastille r={e.rubrique} />
          <span className="text-[12px] font-extrabold uppercase tracking-[0.04em] text-gris">{s.theme}</span>
        </div>
        <Link href={lien} className="d text-[23px] leading-[1.08] hover:text-bleu">{s.titre}</Link>
        {s.chiffres.length > 0 ? <Tuiles r={e.rubrique} s={s} /> : s.eclairage && <Eclairage texte={s.eclairage} />}
        <div className="mt-auto pt-1"><Meta s={s} minutes={e.minutes} /></div>
      </div>
    </article>
  );
}

export function CarteEdition({ e, avecDate = false }: { e: Edition; avecDate?: boolean }) {
  const [p, ...autres] = e.sujets;
  if (!p) return null;
  const lien = `/${e.rubrique}/${e.date}`;
  return (
    <article className="carte flex flex-col p-3">
      <Link href={lien}><Visuel s={p} /></Link>
      <div className="flex flex-1 flex-col gap-3 px-3 pb-2.5 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Pastille r={e.rubrique} />
          <span className="text-[12.5px] font-semibold text-gris">{avecDate ? dateLongue(e.date) : `${e.minutes} min`}</span>
        </div>
        <Link href={lien} className="d text-[22px] leading-[1.1] hover:text-bleu">{p.titre}</Link>
        {autres.length > 0 && (
          <ul className="space-y-1.5 border-t border-filet pt-3">
            {autres.map((s) => (
              <li key={s.n} className="flex gap-2.5 text-[14px] leading-snug">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[3px]" style={{ backgroundColor: R[e.rubrique].couleur }} />
                <Link href={lien} className="hover:text-bleu">{s.titre}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function GrilleEditions({ eds, avecDate = false }: { eds: Edition[]; avecDate?: boolean }) {
  return (
    <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {eds.map((e) => <CarteEdition key={e.rubrique + e.date} e={e} avecDate={avecDate} />)}
    </div>
  );
}

export function TuileDate({ jour, mois, couleur = "#ff6a3d", fond = "#ffe4d9" }: { jour: string; mois: string; couleur?: string; fond?: string }) {
  return (
    <div className="w-16 shrink-0 rounded-[16px] py-2 text-center" style={{ backgroundColor: fond, color: couleur }}>
      <p className="d text-[22px] leading-none">{jour}</p>
      <p className="mt-0.5 text-[11px] font-bold uppercase">{mois}</p>
    </div>
  );
}

export function jourMois(date: string) {
  const d = new Date(date + "T12:00:00Z");
  return { jour: String(d.getUTCDate()), mois: new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" }).format(d).replace(".", "") };
}

// Bandeau d'abonnement bleu + pied de page
export function Pied() {
  return (
    <>
      <section id="newsletter" className="mt-10 grid scroll-mt-6 items-center gap-6 rounded-[28px] bg-bleu px-6 py-9 text-white sm:px-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="d text-[30px] leading-[1.05] sm:text-[38px]">Vous avez décroché de l&apos;actualité ? On reprend depuis le début.</p>
          <p className="mt-3 text-[15px] text-white/85">Un sujet, son contexte, les faits et les différentes positions. Chaque matin, gratuitement, dans votre boîte mail.</p>
        </div>
        <Inscription />
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-4 px-2 py-8 text-[13.5px] text-gris">
        <div className="flex items-center gap-3"><img src="/logo-eclairage-transparent.png" alt="Éclairage" className="h-9 w-auto" /><span className="font-semibold">Comprendre avant de se faire une opinion.</span></div>
        <nav className="flex flex-wrap gap-x-5 gap-y-1 font-semibold">
          {ORDRE.map((r) => <Link key={r} href={`/${r}`} className="hover:text-encre">{R[r].court}</Link>)}
          <Link href="/barometre" className="hover:text-encre">Baromètre</Link>
          <Link href="/archives" className="hover:text-encre">Archives</Link>
          <span className="select-all">bonjour@eclairagemedia.com</span>
        </nav>
      </footer>
    </>
  );
}
