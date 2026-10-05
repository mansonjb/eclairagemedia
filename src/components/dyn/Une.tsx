"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const DUREE = 20000; // un sujet toutes les 20 secondes

// État partagé entre les étapes 1/2/3 du haut de page et la grande carte du sujet principal.
// Les sujets défilent seuls, en boucle ; le défilement se met en pause au survol et quand l'onglet est caché,
// et repart de zéro après un choix manuel.
const Ctx = createContext<{ i: number; tour: number; pause: boolean; choisir: (k: number) => void; setPause: (p: boolean) => void }>(
  { i: 0, tour: 0, pause: false, choisir: () => {}, setPause: () => {} });

export function UneProvider({ children, n = 3 }: { children: ReactNode; n?: number }) {
  const [i, setI] = useState(0);
  const [tour, setTour] = useState(0);
  const [survol, setPause] = useState(false);
  const [cache, setCache] = useState(false);
  const pause = survol || cache;
  useEffect(() => {
    const vis = () => setCache(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);
  useEffect(() => {
    if (pause || n < 2) return;
    const t = setTimeout(() => { setI((x) => (x + 1) % n); setTour((x) => x + 1); }, DUREE);
    return () => clearTimeout(t);
  }, [i, tour, pause, n]);
  const choisir = (k: number) => {
    setI(k);
    setTour((x) => x + 1);
    const carte = document.getElementById("une");
    if (carte && carte.getBoundingClientRect().top > window.innerHeight * 0.6) carte.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <Ctx.Provider value={{ i, tour, pause, choisir, setPause }}>{children}</Ctx.Provider>;
}

// Barre qui se remplit pendant les 20 secondes du sujet affiché
function Jauge({ couleur, cle, pause }: { couleur: string; cle: string; pause: boolean }) {
  return <span key={cle} aria-hidden className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
    style={{ backgroundColor: couleur, animation: `remplir ${DUREE}ms linear forwards`, animationPlayState: pause ? "paused" : "running" }} />;
}

export function UneEtapes({ etapes }: { etapes: { nom: string; titre: string; couleur: string; fond: string; rubrique: string; theme: string }[] }) {
  const { i, tour, pause, choisir, setPause } = useContext(Ctx);
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
                className={`relative h-2.5 overflow-hidden rounded-full bg-encre/20 transition-all ${k === i ? "w-9" : "w-2.5"}`}>
                {k === i && <Jauge couleur={e.couleur} cle={`m${i}-${tour}`} pause={pause} />}
              </button>
            ))}
          </div>
          <p className="truncate text-[13px] font-bold"><span style={{ color: x.couleur }}>Sujet {i + 1} sur {n}</span> · {x.theme}</p>
        </div>
        {fleche(1)}
      </div>
      {/* Tablette et ordinateur : trois cartes-onglets pleine largeur (numéro, rubrique, titre, jauge) */}
      <div role="tablist" aria-label="Les trois sujets principaux" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}
        className="hidden w-full grid-cols-3 gap-3 sm:grid">
        {etapes.map((e, k) => {
          const actif = k === i;
          return (
            <button key={k} type="button" role="tab" onClick={() => choisir(k)} aria-selected={actif} aria-controls="une"
              className={`group relative flex min-w-0 items-start gap-3.5 overflow-hidden rounded-[22px] p-4 text-left transition ${actif ? "text-white shadow-lg" : "bg-white hover:-translate-y-0.5 hover:shadow-md"}`}
              style={actif ? { backgroundColor: e.couleur } : undefined}>
              <span className={`d flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-[22px] leading-none ${actif ? "bg-white" : ""}`}
                style={actif ? { color: e.couleur } : { backgroundColor: e.fond, color: e.couleur }}>{k + 1}</span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[11.5px] font-extrabold uppercase tracking-[0.06em] ${actif ? "text-white/80" : ""}`} style={actif ? undefined : { color: e.couleur }}>{e.rubrique} · {e.theme}</span>
                <span className="mt-1 line-clamp-2 block text-[15px] font-bold leading-snug">{e.titre}</span>
              </span>
              {actif && <span className="absolute inset-x-4 bottom-2 h-[3px] overflow-hidden rounded-full bg-white/25"><Jauge couleur="rgba(255,255,255,.9)" cle={`d${i}-${tour}`} pause={pause} /></span>}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function UneCarte({ cartes }: { cartes: ReactNode[] }) {
  const { i, setPause } = useContext(Ctx);
  return (
    <div id="une" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)} className="flex min-w-0 scroll-mt-24 lg:col-span-2">
      <div key={i} className="apparait flex w-full min-w-0">{cartes[i] ?? cartes[0]}</div>
    </div>
  );
}
