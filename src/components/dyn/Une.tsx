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

// Numéro du sujet entouré d'un anneau qui se remplit pendant les 20 secondes (sujet actif seulement)
function Anneau({ actif, couleur, fond, n, cle, pause }: { actif: boolean; couleur: string; fond: string; n: number; cle: string; pause: boolean }) {
  const C = 2 * Math.PI * 20;
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      {actif && (
        <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="3" />
          <circle key={cle} cx="24" cy="24" r="20" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray={C}
            style={{ strokeDashoffset: C, animation: `anneau ${DUREE}ms linear forwards`, animationPlayState: pause ? "paused" : "running" }} />
        </svg>
      )}
      <span className="d flex h-9 w-9 items-center justify-center rounded-full text-[19px] leading-none"
        style={actif ? { backgroundColor: "#fff", color: couleur } : { backgroundColor: fond, color: couleur }}>{n}</span>
    </span>
  );
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
              className={`group relative flex min-w-0 items-center gap-3.5 overflow-hidden rounded-[22px] p-4 text-left transition ${actif ? "text-white shadow-lg" : "bg-white hover:-translate-y-0.5 hover:shadow-md"}`}
              style={actif ? { backgroundColor: e.couleur } : undefined}>
              <Anneau actif={actif} couleur={e.couleur} fond={e.fond} n={k + 1} cle={`d${i}-${tour}`} pause={pause} />
              <span className="min-w-0 flex-1">
                <span className={`block text-[11.5px] font-extrabold uppercase tracking-[0.06em] ${actif ? "text-white/80" : ""}`} style={actif ? undefined : { color: e.couleur }}>{e.rubrique}</span>
                <span className="mt-0.5 block text-[16px] font-bold leading-snug">{e.titre}</span>
              </span>
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
