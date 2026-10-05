"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

// État partagé entre les étapes 1/2/3 du haut de page et la grande carte du sujet principal
const Ctx = createContext<{ i: number; choisir: (k: number) => void }>({ i: 0, choisir: () => {} });

export function UneProvider({ children }: { children: ReactNode }) {
  const [i, setI] = useState(0);
  const choisir = (k: number) => {
    setI(k);
    const carte = document.getElementById("une");
    if (carte && carte.getBoundingClientRect().top > window.innerHeight * 0.6) carte.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <Ctx.Provider value={{ i, choisir }}>{children}</Ctx.Provider>;
}

export function UneEtapes({ etapes }: { etapes: { nom: string; couleur: string }[] }) {
  const { i, choisir } = useContext(Ctx);
  return (
    <ol aria-label="Les trois sujets principaux" className="flex max-w-full gap-1.5 overflow-x-auto rounded-full bg-white p-1.5 [scrollbar-width:none]">
      {etapes.map((x, k) => {
        const actif = k === i;
        return (
          <li key={k} className="shrink-0">
            <button type="button" onClick={() => choisir(k)} aria-pressed={actif} aria-controls="une"
              className={`flex items-center gap-2 rounded-full py-2 pl-2 pr-3.5 text-[14px] font-bold transition-colors ${actif ? "text-white" : "hover:bg-fond"}`}
              style={actif ? { backgroundColor: x.couleur } : undefined}>
              <span className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-[13px] font-extrabold ${actif ? "bg-white" : "bg-fond"}`} style={actif ? { color: x.couleur } : undefined}>{k + 1}</span>
              {x.nom}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function UneCarte({ cartes }: { cartes: ReactNode[] }) {
  const { i } = useContext(Ctx);
  return <div id="une" key={i} className="apparait flex min-w-0 scroll-mt-24 lg:col-span-2">{cartes[i] ?? cartes[0]}</div>;
}
