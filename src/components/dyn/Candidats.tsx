"use client";
import { useState } from "react";
import Link from "next/link";

type Val = { v: number; d: number | null; parts?: Record<string, number> } | null;
type Decl = { qui: string; texte: string; date: string; sujet: string; href: string; source: string; url: string; contexte: string | null };
export type Candidat = {
  nom: string; etiquette: string; couleur: string; statut: string | null; date_statut: string | null; source_statut: string | null;
  sondage: Val; attention: Val; polymarket: Val; declarations: Decl[]; nbDeclarations: number;
  score: number | null; composantes: Record<string, number>;
  reseaux?: Fiche | null;
  rangs?: { sondage?: number; polymarket?: number };
};
type Pm = { v: number; d: number | null; d24?: number | null; d30?: number | null; vol?: number; vol7?: number; haut?: number | null; bas?: number | null };

const dollars = (n?: number) => (n == null ? "–" : n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(".", ",")} M$` : `${Math.round(n / 1e3)} k$`);
const ordinal = (n: number) => `${n}${n === 1 ? "er" : "e"}`;

// Polymarket en détail : évolutions, argent misé, fourchette sur 30 jours, rang comparé aux sondages
function DetailParis({ c }: { c: Candidat }) {
  const p = c.polymarket as Pm | null;
  if (!p) return null;
  const evo = (t: string, d?: number | null) => (
    <div className="rounded-[12px] bg-white px-3 py-2 text-center">
      <p className="text-[11px] font-extrabold tracking-[0.04em] text-gris">{t}</p>
      <p className={`text-[15px] font-extrabold tabular-nums ${d == null ? "text-gris" : d > 0.4 ? "text-[#0a7d5a]" : d < -0.4 ? "text-[#d7263d]" : ""}`}>
        {d == null ? "–" : `${d > 0 ? "+" : ""}${d.toFixed(1).replace(".", ",")} pt`}
      </p>
    </div>
  );
  const rp = c.rangs?.polymarket, rs = c.rangs?.sondage;
  const lecture = rp && rs ? (rp < rs ? "Les parieurs le placent plus haut que les sondages." : rp > rs ? "Les parieurs le placent plus bas que les sondages." : "Parieurs et sondages lui donnent le même rang.") : null;
  return (
    <div className="flex flex-col gap-3 rounded-[16px] bg-fond p-4 text-[13.5px]">
      <p className="text-[12px] font-extrabold tracking-[0.04em] text-gris">LES PARIS EN DÉTAIL</p>
      <div className="grid grid-cols-3 gap-2">{evo("24 H", p.d24)}{evo("7 JOURS", p.d)}{evo("30 JOURS", p.d30)}</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-[12px] bg-white px-3 py-2">
          <p className="text-[11px] font-extrabold tracking-[0.04em] text-gris">ARGENT MISÉ</p>
          <p className="text-[15px] font-extrabold tabular-nums">{dollars(p.vol)}</p>
          <p className="text-[12px] text-gris">dont {dollars(p.vol7)} cette semaine</p>
        </div>
        <div className="rounded-[12px] bg-white px-3 py-2">
          <p className="text-[11px] font-extrabold tracking-[0.04em] text-gris">SUR 30 JOURS</p>
          <p className="text-[15px] font-extrabold tabular-nums">{p.bas != null && p.haut != null ? `${Math.round(p.bas)} à ${Math.round(p.haut)} %` : "–"}</p>
          <p className="text-[12px] text-gris">plus bas et plus haut</p>
        </div>
      </div>
      {(rp || rs) && (
        <div className="rounded-[12px] bg-white px-3 py-2.5">
          <p className="text-[11px] font-extrabold tracking-[0.04em] text-gris">PARIEURS OU SONDAGES&nbsp;?</p>
          <p className="mt-0.5 text-[15px] font-extrabold">Parieurs : {rp ? ordinal(rp) : "non coté"} · Sondages : {rs ? ordinal(rs) : "non testé"}</p>
          {lecture && <p className="text-[12.5px] text-gris">{lecture} Un rang, pas un chiffre : une probabilité de victoire et une intention de vote ne se comparent pas.</p>}
        </div>
      )}
    </div>
  );
}
type Fiche = {
  url: string; phase?: { note: string; libelle: string; texte: string };
  rangs: { rang: number; libelle: string; valeur: string }[];
  posts: { quand: string; texte: string; chiffres: string; url: string }[];
  citations: { valeur: string; libelle: string; detail: string }[];
  journalistes: { nom: string; role: string; posts: string }[];
};

// Fiche réseaux (Observatoire Présidentielle 2027 de Saper Vedere), repliée par défaut
function Reseaux({ f, couleur }: { f: Fiche; couleur: string }) {
  const court = (l: string) => l.replace("sur 34 en ", "").replace("nombre de ", "").replace(" mesurées", "").replace("engagement moyen par post", "engagement / post");
  const cites = f.citations.find((c) => c.libelle.startsWith("posts qui"));
  const rangCite = f.citations.find((c) => c.libelle.includes("plus cités"));
  const p = f.posts[0];
  return (
    <details open className="group rounded-[16px] bg-fond px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-extrabold tracking-[0.04em] text-gris">
        SUR LES RÉSEAUX SOCIAUX<span className="text-[16px] transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 flex flex-col gap-3.5 text-[13.5px] leading-snug">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {f.rangs.map((r) => (
            <div key={r.libelle} className="rounded-[12px] bg-white px-3 py-2">
              <p className="d text-[20px] leading-none" style={{ color: couleur }}>{r.rang}<sup className="text-[11px]">{r.rang === 1 ? "er" : "e"}</sup><span className="text-[12px] text-gris">/34</span></p>
              <p className="mt-1 text-[11.5px] font-semibold text-gris">{court(r.libelle)}</p>
            </div>
          ))}
        </div>
        {f.phase && <p><b>{f.phase.note} en phase</b> avec les priorités des Français. {f.phase.texte}</p>}
        {p && (
          <div className="rounded-[12px] bg-white p-3">
            <p className="text-[11.5px] font-extrabold tracking-[0.04em] text-gris">SON POST LE PLUS ENGAGEANT (12 MOIS)</p>
            <p className="mt-1 font-semibold">« {p.texte} »</p>
            <p className="mt-1 text-[12px] text-gris">{p.quand} · {p.chiffres} · <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">voir l&apos;original</a></p>
          </div>
        )}
        {cites && (
          <p><b>Cité par les journalistes et médias&nbsp;:</b> {cites.valeur} posts sur 12 mois{rangCite ? `, ${rangCite.valeur}e sur 34` : ""}.
            {f.journalistes.length > 0 && <> Le plus souvent par {f.journalistes.map((j) => `${j.nom} (${j.posts})`).join(", ")}.</>}</p>
        )}
        <p className="text-[11.5px] text-gris">Source : <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Observatoire Présidentielle 2027, Saper Vedere</a></p>
      </div>
    </details>
  );
}
type Serie = { date: string; attention: Record<string, number>; polymarket: Record<string, number> }[];

const fmtDate = (d: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(d + "T12:00:00Z"));

function Delta({ d, unite = "pt" }: { d: number | null | undefined; unite?: string }) {
  if (d === null || d === undefined) return <span className="text-[12px] font-semibold text-gris-clair">—</span>;
  if (Math.abs(d) < 0.5) return <span className="text-[12px] font-bold text-gris">= stable</span>;
  return <span className={`text-[12px] font-extrabold ${d > 0 ? "text-[#0a7d5a]" : "text-[#d7263d]"}`}>{d > 0 ? "▲" : "▼"} {Math.abs(d) < 2 ? Math.abs(d).toFixed(1).replace(".", ",") : Math.abs(d).toFixed(0)} {unite}{Math.abs(d) >= 2 ? "s" : ""}</span>;
}

function Courbe({ points, couleur }: { points: number[]; couleur: string }) {
  if (points.length < 2) return null;
  const max = Math.max(...points, 1), min = Math.min(...points, 0);
  const xy = points.map((p, i) => `${(i / (points.length - 1)) * 100},${28 - ((p - min) / (max - min || 1)) * 26}`).join(" ");
  return <svg viewBox="0 0 100 30" className="h-7 w-24" preserveAspectRatio="none" aria-hidden><polyline points={xy} fill="none" stroke={couleur} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Mesure({ titre, val, libelle, max, couleur, unite, serie, vide = "Non mesuré" }: { titre: string; val: Val; libelle: string; max: number; couleur: string; unite?: string; serie?: number[]; vide?: string }) {
  return (
    <div className="rounded-[16px] bg-fond p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11.5px] font-extrabold tracking-[0.04em] text-gris">{titre}</p>
        {serie && <Courbe points={serie} couleur={couleur} />}
      </div>
      {val ? (
        <>
          <div className="mt-1 flex items-baseline justify-between gap-2"><p className="d text-[26px] leading-none">{libelle}</p><Delta d={val.d} unite={unite} /></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full" style={{ width: `${Math.max(2, (val.v / max) * 100)}%`, backgroundColor: couleur }} /></div>
        </>
      ) : <p className="mt-2 text-[13px] font-semibold text-gris-clair">{vide}</p>}
    </div>
  );
}

export default function Candidats({ candidats, serie }: { candidats: Candidat[]; serie: Serie }) {
  const [tri, setTri] = useState<"score" | "sondage" | "attention" | "polymarket">("score");
  const critere = tri === "sondage" && !candidats.some((c) => c.sondage) ? "score" : tri;
  const val = (c: Candidat) => (critere === "score" ? c.score ?? -1 : c[critere]?.v ?? -1);
  const liste = [...candidats].sort((a, b) => val(b) - val(a));
  const maxS = Math.max(...candidats.map((c) => c.sondage?.v ?? 0), 1);
  const maxP = Math.max(...candidats.map((c) => c.polymarket?.v ?? 0), 1);
  const onglet = (k: typeof tri, nom: string) => (
    <button onClick={() => setTri(k)} className={`rounded-full px-4 py-2.5 text-[14px] font-bold transition ${critere === k ? "bg-encre text-white" : "bg-white hover:bg-lavande"}`}>{nom}</button>
  );
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2 px-2">
        <span className="mr-1 text-[14px] font-semibold text-gris">Classer par</span>
        {onglet("score", "Score Éclairage")}{candidats.some((c) => c.sondage) && onglet("sondage", "Sondages")}{onglet("attention", "Attention en ligne")}{onglet("polymarket", "Polymarket")}
      </div>
      <div key={critere} className="apparait grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        {liste.map((c, rang) => {
          const initiales = c.nom.split(/[ -]/).filter((m) => m && m[0] === m[0].toUpperCase()).map((m) => m[0]).slice(0, 2).join("");
          return (
            <article key={c.nom} className="carte flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex items-center gap-3.5">
                <span className="d flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] text-[20px] text-white" style={{ backgroundColor: c.couleur }}>{initiales}</span>
                <div className="min-w-0 flex-1">
                  <p className="d truncate text-[22px] leading-tight">{c.nom}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="pastille text-white" style={{ backgroundColor: c.couleur }}>{c.etiquette}</span>
                    {c.statut && (c.source_statut
                      ? <a href={c.source_statut} target="_blank" rel="noopener noreferrer" className="pastille bg-lavande text-bleu underline-offset-2 hover:underline">{c.statut}{c.date_statut ? ` · ${fmtDate(c.date_statut)}` : ""}</a>
                      : <span className="pastille bg-lavande text-bleu">{c.statut}</span>)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="d text-[34px] leading-none">{c.score ?? "–"}</p>
                  <p className="text-[11px] font-extrabold tracking-[0.04em] text-gris">SCORE · #{rang + 1}</p>
                </div>
              </div>
              <div className="grid gap-2.5">
                {(critere === "score" || critere === "sondage") && <Mesure titre="SONDAGES (MOYENNE 1er TOUR)" val={c.sondage} libelle={c.sondage ? `${c.sondage.v.toFixed(1).replace(".", ",")} %` : ""} max={maxS} couleur={c.couleur} vide="Non testé dans les sondages récents" />}
                {(critere === "score" || critere === "attention") && <Mesure titre="ATTENTION EN LIGNE /100" val={c.attention} libelle={c.attention ? `${Math.round(c.attention.v)}` : ""} max={100} couleur="#ff6a3d" unite="pt"
                  serie={serie.map((s) => s.attention[c.nom]).filter((x) => x !== undefined)} />}
                {(critere === "score" || critere === "polymarket") && <Mesure titre="POLYMARKET" val={c.polymarket} libelle={c.polymarket ? (c.polymarket.v < 1 ? "< 1 %" : `${Math.round(c.polymarket.v)} %`) : ""} max={maxP} couleur="#14142b"
                  serie={serie.map((s) => s.polymarket[c.nom]).filter((x) => x !== undefined)} />}
              </div>
              {critere === "attention" && c.reseaux && <Reseaux f={c.reseaux} couleur={c.couleur} />}
              {critere === "polymarket" && <DetailParis c={c} />}
              <div className="mt-1 flex flex-1 flex-col">
                <p className="text-[12px] font-extrabold tracking-[0.04em] text-gris">DERNIÈRES DÉCLARATIONS{c.nbDeclarations ? ` (${c.nbDeclarations})` : ""}</p>
                {c.declarations.length ? (
                  <ul className="mt-2 space-y-2.5">
                    {c.declarations.slice(0, 3).map((d, k) => (
                      <li key={k} className="rounded-[14px] border border-filet p-3">
                        <p className="text-[14.5px] font-semibold leading-snug">{d.texte}</p>
                        <p className="mt-1.5 text-[12px] text-gris">{fmtDate(d.date)} · <Link href={d.href} className="underline underline-offset-2 hover:text-bleu">{d.sujet}</Link> · <a href={d.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{d.source}</a></p>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-2 text-[13.5px] text-gris">Aucune déclaration relevée dans les éditions récentes.</p>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
