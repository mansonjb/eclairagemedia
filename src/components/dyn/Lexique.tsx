"use client";
import { useState } from "react";
import Link from "next/link";

type Mot = { terme: string; definition: string; href: string };

// Lexique interactif : on touche un mot, sa définition s'affiche
export default function Lexique({ mots }: { mots: Mot[] }) {
  const [i, setI] = useState(0);
  const m = mots[i];
  return (
    <section className="carte flex h-full flex-col gap-5 !bg-encre p-6 text-white sm:p-7" aria-label="Lexique du jour">
      <div className="flex items-center justify-between">
        <span className="pastille bg-jaune text-encre">LE LEXIQUE DU JOUR</span>
        <span className="text-[13px] font-semibold text-white/60">Touchez un mot</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {mots.map((x, k) => (
          <button key={x.terme} onClick={() => setI(k)}
            className={`rounded-full border px-3.5 py-2 text-[13.5px] font-bold transition ${k === i ? "border-jaune bg-jaune text-encre" : "border-white/25 text-white hover:border-white/60"}`}>
            {x.terme}
          </button>
        ))}
      </div>
      {m && (
        <div key={m.terme} className="apparait mt-auto">
          <p className="d text-[34px] leading-none text-jaune">{m.terme}</p>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-white/90">{m.definition}</p>
          <Link href={m.href} className="mt-3 inline-block text-[13px] font-bold text-white/70 underline underline-offset-4 hover:text-white">Voir le mot dans son contexte →</Link>
        </div>
      )}
    </section>
  );
}
