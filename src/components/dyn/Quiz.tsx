"use client";
import { useState } from "react";
import Link from "next/link";

export type QuizData = { affirmation: string; reponse: boolean; explication: string; href: string; rubrique: string };

// « Vrai ou faux ? » : on répond, la réponse et l'explication s'affichent
export default function Quiz({ q }: { q: QuizData }) {
  const [choix, setChoix] = useState<boolean | null>(null);
  const juste = choix !== null && choix === q.reponse;
  const bouton = (v: boolean) => {
    const choisi = choix === v;
    const cls = choix === null ? (v ? "bg-encre text-white" : "bg-transparent")
      : v === q.reponse ? "bg-[#0a7d5a] border-[#0a7d5a] text-white" : choisi ? "bg-[#d7263d] border-[#d7263d] text-white" : "opacity-40";
    return <button disabled={choix !== null} onClick={() => setChoix(v)} className={`h-[52px] flex-1 rounded-full border-2 border-encre text-[16px] font-extrabold transition ${cls}`}>{v ? "Vrai" : "Faux"}</button>;
  };
  return (
    <section className="carte flex flex-col gap-3.5 !bg-jaune p-6 sm:p-7" aria-label="Quiz">
      <div className="flex items-center justify-between">
        <span className="pastille bg-encre text-jaune">VRAI OU FAUX ?</span>
        <span className="text-[13px] font-bold">10 secondes</span>
      </div>
      <p className="d text-[24px] leading-[1.12]">{q.affirmation}</p>
      <div className="flex gap-2.5">{bouton(true)}{bouton(false)}</div>
      {choix !== null && (
        <div className="apparait rounded-[18px] bg-white/70 p-4">
          <p className="text-[15px] font-extrabold">{juste ? "Bien vu !" : "Raté !"} C&apos;est {q.reponse ? "vrai" : "faux"}.</p>
          <p className="mt-1 text-[14px] leading-relaxed">{q.explication}</p>
          <Link href={q.href} className="mt-2 inline-block text-[13px] font-bold underline underline-offset-4">Comprendre le sujet →</Link>
        </div>
      )}
    </section>
  );
}
