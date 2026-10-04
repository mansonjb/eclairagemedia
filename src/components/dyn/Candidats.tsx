"use client";
import { useState } from "react";
import Link from "next/link";

type Val = { v: number; d: number | null; parts?: Record<string, number> } | null;
type Decl = { qui: string; texte: string; date: string; sujet: string; href: string; source: string; url: string; contexte: string | null };
export type Candidat = {
  nom: string; etiquette: string; couleur: string; statut: string | null; date_statut: string | null; source_statut: string | null;
  sondage: Val; attention: Val; polymarket: Val; declarations: Decl[]; nbDeclarations: number;
  score: number | null; composantes: Record<string, number>;
};
type Serie = { date: string; attention: Record<string, number>; polymarket: Record<string, number> }[];

const fmtDate = (d: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(d + "T12:00:00Z"));

function Delta({ d, unite = "pt" }: { d: number | null | undefined; unite?: string }) {
  if (d === null || d === undefined) return <span className="text-[12px] font-semibold text-gris-clair">—</span>;
  if (Math.abs(d) < 0.5) return <span className="text-[12px] font-bold text-gris">= stable</span>;
  return <span className={`text-[12px] font-extrabold ${d > 0 ? "text-[#0a7d5a]" : "text-[#d7263d]"}`}>{d > 0 ? "▲" : "▼"} {Math.abs(d).toFixed(0)} {unite}{Math.abs(d) >= 2 ? "s" : ""}</span>;
}

function Courbe({ points, couleur }: { points: number[]; couleur: string }) {
  if (points.length < 2) return null;
  const max = Math.max(...points, 1), min = Math.min(...points, 0);
  const xy = points.map((p, i) => `${(i / (points.length - 1)) * 100},${28 - ((p - min) / (max - min || 1)) * 26}`).join(" ");
  return <svg viewBox="0 0 100 30" className="h-7 w-24" preserveAspectRatio="none" aria-hidden><polyline points={xy} fill="none" stroke={couleur} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Mesure({ titre, val, libelle, max, couleur, unite, serie }: { titre: string; val: Val; libelle: string; max: number; couleur: string; unite?: string; serie?: number[] }) {
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
      ) : <p className="mt-2 text-[13px] font-semibold text-gris-clair">Non mesuré</p>}
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
                <Mesure titre="SONDAGE (1er TOUR)" val={c.sondage} libelle={c.sondage ? `${c.sondage.v} %` : ""} max={maxS} couleur={c.couleur} />
                <Mesure titre="ATTENTION EN LIGNE /100" val={c.attention} libelle={c.attention ? `${Math.round(c.attention.v)}` : ""} max={100} couleur="#ff6a3d" unite="pt"
                  serie={serie.map((s) => s.attention[c.nom]).filter((x) => x !== undefined)} />
                <Mesure titre="POLYMARKET" val={c.polymarket} libelle={c.polymarket ? (c.polymarket.v < 1 ? "< 1 %" : `${Math.round(c.polymarket.v)} %`) : ""} max={maxP} couleur="#14142b"
                  serie={serie.map((s) => s.polymarket[c.nom]).filter((x) => x !== undefined)} />
              </div>
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
