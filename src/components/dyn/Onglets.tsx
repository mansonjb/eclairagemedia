"use client";
import { useState } from "react";
import { ORDRE, RUBRIQUES, type RId } from "@/lib/rubriques-client";
import { Icone } from "@/components/Icones";
import { CarteImage, LigneArticle, type Item } from "./CarteImage";

// Onglets de rubriques qui filtrent en direct (« Pour vous », « Politique »…)
export default function Onglets({ items }: { items: Item[] }) {
  const [filtre, setFiltre] = useState<RId | "tout">("tout");
  const liste = filtre === "tout" ? items : items.filter((i) => i.rubrique === filtre);
  const [a, b, c, ...suite] = liste;
  const [tout, setTout] = useState(false);
  const reste = tout ? suite : suite.slice(0, 6);
  const onglet = (actif: boolean) => `flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] font-semibold transition ${actif ? "border-encre bg-encre text-white" : "border-filet bg-white text-encre hover:border-encre/40"}`;
  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <button onClick={() => { setFiltre("tout"); setTout(false); }} className={onglet(filtre === "tout")}>À la une</button>
        {ORDRE.map((r) => (
          <button key={r} onClick={() => { setFiltre(r); setTout(false); }} className={onglet(filtre === r)}>
            <span style={{ color: filtre === r ? "#ffd60a" : RUBRIQUES[r].couleur }}><Icone r={r} className="h-4 w-4" /></span>{RUBRIQUES[r].court}
          </button>
        ))}
      </div>
      <div key={filtre} className="apparait mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {a && <CarteImage it={a} taille="l" />}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {b && <CarteImage it={b} taille="s" />}
          {c && <CarteImage it={c} taille="s" />}
        </div>
      </div>
      {reste.length > 0 && (
        <div key={filtre + "l"} className="apparait carte mt-4 divide-y divide-filet px-4 sm:px-6">
          {reste.map((it) => <LigneArticle key={it.href + it.titre} it={it} />)}
          {suite.length > 6 && (
            <button onClick={() => setTout(!tout)} className="w-full py-3 text-sm font-extrabold text-bleu">{tout ? "Voir moins" : `Voir les ${suite.length - 6} autres sujets`}</button>
          )}
        </div>
      )}
    </div>
  );
}
