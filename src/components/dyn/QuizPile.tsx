"use client";
import { useState } from "react";
import Link from "next/link";
import type { QuizData } from "./Quiz";
import { RUBRIQUES } from "@/lib/rubriques-client";

// Quiz du jour « Vrai ou faux » : une question à la fois, flèches pour passer de l'une à l'autre
export default function QuizPile({ qs }: { qs: QuizData[] }) {
  const [i, setI] = useState(0);
  const [rep, setRep] = useState<(boolean | null)[]>(qs.map(() => null));
  const q = qs[i];
  const r = rep[i];
  const R = RUBRIQUES[q.rubrique as keyof typeof RUBRIQUES];
  const fleche = (sens: -1 | 1) => {
    const cible = i + sens;
    const off = cible < 0 || cible >= qs.length;
    return (
      <button onClick={() => setI(cible)} disabled={off} aria-label={sens < 0 ? "Question précédente" : "Question suivante"}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[18px] font-extrabold transition hover:bg-encre hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-encre">
        {sens < 0 ? "←" : "→"}
      </button>
    );
  };
  const bouton = (v: boolean) => {
    const cls = r === null ? (v ? "bg-encre text-white" : "bg-transparent")
      : v === q.reponse ? "bg-[#0a7d5a] border-[#0a7d5a] text-white" : r === v ? "bg-[#d7263d] border-[#d7263d] text-white" : "opacity-40";
    return <button disabled={r !== null} onClick={() => setRep((x) => x.map((y, k) => (k === i ? v : y)))} className={`h-[52px] flex-1 rounded-full border-2 border-encre text-[16px] font-extrabold transition ${cls}`}>{v ? "Vrai" : "Faux"}</button>;
  };
  return (
    <section className="carte flex flex-col gap-3.5 !bg-jaune p-6 sm:p-7" aria-label="Quiz du jour">
      <div className="flex items-center justify-between gap-3">
        <span className="pastille bg-encre text-jaune">VRAI OU FAUX&nbsp;?</span>
        {qs.length > 1 && (
          <div className="flex items-center gap-2">
            {fleche(-1)}
            <span className="min-w-[38px] text-center text-[13px] font-extrabold tabular-nums">{i + 1}/{qs.length}</span>
            {fleche(1)}
          </div>
        )}
      </div>
      <div key={i} className="apparait flex flex-col gap-3.5">
        {R && <span className="pastille self-start text-white" style={{ backgroundColor: R.couleur }}>{R.court}</span>}
        <p className="d text-[22px] leading-[1.15]">{q.affirmation}</p>
        <div className="flex gap-2.5">{bouton(true)}{bouton(false)}</div>
        {r !== null && (
          <div className="apparait rounded-[18px] bg-white/70 p-4">
            <p className="text-[15px] font-extrabold">{r === q.reponse ? "Bien vu !" : "Raté !"} C&apos;est {q.reponse ? "vrai" : "faux"}.</p>
            <p className="mt-1 text-[14px] leading-relaxed">{q.explication}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <Link href={q.href} className="text-[13px] font-bold underline underline-offset-4">Comprendre le sujet →</Link>
              {i + 1 < qs.length && <button onClick={() => setI(i + 1)} className="rounded-full bg-encre px-4 py-2 text-[13px] font-extrabold text-white">Question suivante →</button>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
