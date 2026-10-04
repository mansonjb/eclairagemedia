"use client";
import { useEffect, useState } from "react";
import { Ico } from "@/components/Icones";

// Barre de progression de lecture + barre d'actions flottante (copier, partager, haut de page)
export function Progression({ couleur }: { couleur: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => { const h = document.documentElement; setP(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))); };
    f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f);
  }, []);
  return <div className="fixed inset-x-0 top-0 z-50 h-1" aria-hidden><div className="h-full origin-left transition-transform duration-150" style={{ transform: `scaleX(${p})`, backgroundColor: couleur }} /></div>;
}

export function Actions({ titre }: { titre: string }) {
  const [copie, setCopie] = useState(false);
  const copier = async () => { try { await navigator.clipboard.writeText(location.href); setCopie(true); setTimeout(() => setCopie(false), 1800); } catch {} };
  const partager = async () => { if (navigator.share) { try { await navigator.share({ title: titre, url: location.href }); } catch {} } else copier(); };
  const b = "flex h-10 min-w-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[13px] font-bold text-white transition hover:bg-white/15";
  return (
    <div className="fixed bottom-24 right-4 z-40 flex sm:left-1/2 sm:right-auto sm:-translate-x-1/2 gap-1 rounded-full bg-encre/90 p-1.5 shadow-xl backdrop-blur-md md:bottom-6">
      <button onClick={partager} className={b} aria-label="Partager"><Ico n="partager" className="h-4 w-4" /><span className="hidden sm:inline">Partager</span></button>
      <button onClick={copier} className={b} aria-label="Copier le lien"><Ico n={copie ? "ok" : "lien"} className="h-4 w-4" /><span className="hidden sm:inline">{copie ? "Lien copié" : "Copier le lien"}</span></button>
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={b} aria-label="Haut de page"><Ico n="haut" className="h-4 w-4" /></button>
    </div>
  );
}

// Bascule « L'essentiel » / « Édition complète »
export function Bascule({ essentiel, complete }: { essentiel: React.ReactNode; complete: React.ReactNode }) {
  const [vue, setVue] = useState<"e" | "c">("e");
  const b = (a: boolean) => `flex-1 rounded-full px-5 py-2.5 text-[14px] font-semibold transition ${a ? "bg-encre text-white" : "text-encre hover:bg-fond"}`;
  return (
    <div>
      <div className="mx-auto flex max-w-md gap-1 rounded-full bg-white p-1 shadow-sm">
        <button onClick={() => setVue("e")} className={b(vue === "e")}>L&apos;essentiel</button>
        <button onClick={() => setVue("c")} className={b(vue === "c")}>Édition complète</button>
      </div>
      <div key={vue} className="apparait mt-6">{vue === "e" ? essentiel : complete}</div>
    </div>
  );
}
