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

export function UneEtapes({ etapes }: { etapes: { nom: string; couleur: string; theme: string }[] }) {
  const { i, choisir } = useContext(Ctx);
  const n = etapes.length;
  const x = etapes[i] ?? etapes[0];
  const fleche = (sens: -1 | 1) => (
    <button type="button" onClick={() => choisir((i + sens + n) % n)} aria-label={sens < 0 ? "Sujet précédent" : "Sujet suivant"} aria-controls="une"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fond text-[18px] font-extrabold active:bg-lavande">{sens < 0 ? "←" : "→"}</button>
  );
  return (
    <>
      {/* Téléphone : flèches et points, sans texte coupé */}
      <div className="flex w-full items-center gap-2 rounded-full bg-white p-1.5 sm:hidden" aria-label="Les trois sujets principaux">
        {fleche(-1)}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            {etapes.map((e, k) => (
              <button key={k} type="button" onClick={() => choisir(k)} aria-label={`Sujet ${k + 1}`} aria-pressed={k === i} aria-controls="une"
                className={`h-2.5 rounded-full transition-all ${k === i ? "w-7" : "w-2.5 bg-encre/20"}`} style={k === i ? { backgroundColor: e.couleur } : undefined} />
            ))}
          </div>
          <p className="truncate text-[13px] font-bold"><span style={{ color: x.couleur }}>Sujet {i + 1} sur {n}</span> · {x.theme}</p>
        </div>
        {fleche(1)}
      </div>
      {/* Tablette et ordinateur : les trois sujets nommés */}
      <ol aria-label="Les trois sujets principaux" className="hidden max-w-full gap-1.5 overflow-x-auto rounded-full bg-white p-1.5 [scrollbar-width:none] sm:flex">
        {etapes.map((e, k) => {
          const actif = k === i;
          return (
            <li key={k} className="shrink-0">
              <button type="button" onClick={() => choisir(k)} aria-pressed={actif} aria-controls="une"
                className={`flex items-center gap-2 rounded-full py-2 pl-2 pr-3.5 text-[14px] font-bold transition-colors ${actif ? "text-white" : "hover:bg-fond"}`}
                style={actif ? { backgroundColor: e.couleur } : undefined}>
                <span className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-[13px] font-extrabold ${actif ? "bg-white" : "bg-fond"}`} style={actif ? { color: e.couleur } : undefined}>{k + 1}</span>
                {e.nom}
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function UneCarte({ cartes }: { cartes: ReactNode[] }) {
  const { i } = useContext(Ctx);
  return <div id="une" key={i} className="apparait flex min-w-0 scroll-mt-24 lg:col-span-2">{cartes[i] ?? cartes[0]}</div>;
}
