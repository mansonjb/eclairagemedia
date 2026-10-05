"use client";
import { useEffect, useRef, useState } from "react";

const hms = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
const VITESSES = [1, 1.25, 1.5, 0.75];

// Lecteur audio de l'édition : lecture, barre de progression cliquable, reculer/avancer 15 s, vitesse
export default function Lecteur({ src, titre, duree, grand = false }: { src: string; titre: string; duree: number; grand?: boolean }) {
  const a = useRef<HTMLAudioElement>(null);
  const [lit, setLit] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(duree);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = a.current;
    if (!el) return;
    const maj = () => setT(el.currentTime);
    const meta = () => isFinite(el.duration) && setD(el.duration);
    const on = () => setLit(true);
    const off = () => setLit(false);
    const ev: [string, () => void][] = [["timeupdate", maj], ["loadedmetadata", meta], ["play", on], ["pause", off], ["ended", off]];
    ev.forEach(([n, f]) => el.addEventListener(n, f));
    return () => ev.forEach(([n, f]) => el.removeEventListener(n, f));
  }, []);
  // l'état du bouton suit les événements play/pause de l'élément audio (lecture refusée = reste sur « Écouter »)
  const basculer = () => { const el = a.current; if (!el) return; if (el.paused) el.play().catch(() => setLit(false)); else el.pause(); };
  const saut = (s: number) => { const el = a.current; if (el) el.currentTime = Math.min(Math.max(0, el.currentTime + s), d); };
  const vitesse = () => { const k = (v + 1) % VITESSES.length; setV(k); if (a.current) a.current.playbackRate = VITESSES[k]; };
  const pct = d ? (100 * t) / d : 0;
  return (
    <div className={`flex items-center gap-3 rounded-[22px] bg-encre text-white ${grand ? "p-4 sm:p-5" : "p-3"}`}>
      <audio ref={a} src={src} preload="metadata" />
      <button type="button" onClick={basculer} aria-label={lit ? "Pause" : "Écouter"}
        className={`flex shrink-0 items-center justify-center rounded-full bg-jaune text-encre transition hover:scale-105 ${grand ? "h-16 w-16" : "h-12 w-12"}`}>
        {lit
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-extrabold ${grand ? "text-[16px]" : "text-[14px]"}`}>{titre}</p>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="w-9 shrink-0 text-[11.5px] tabular-nums text-white/70">{hms(t)}</span>
          <input type="range" min={0} max={d || 1} step={0.5} value={t} aria-label="Position dans l'épisode"
            onChange={(e) => { if (a.current) a.current.currentTime = Number(e.target.value); setT(Number(e.target.value)); }}
            className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full accent-jaune"
            style={{ background: `linear-gradient(to right, #ffd60a ${pct}%, rgba(255,255,255,.2) ${pct}%)` }} />
          <span className="w-9 shrink-0 text-right text-[11.5px] tabular-nums text-white/70">{hms(d)}</span>
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-1 sm:flex">
        <button type="button" onClick={() => saut(-15)} aria-label="Reculer de 15 secondes" className="rounded-full px-2.5 py-2 text-[12px] font-extrabold text-white/80 hover:bg-white/10">−15 s</button>
        <button type="button" onClick={() => saut(15)} aria-label="Avancer de 15 secondes" className="rounded-full px-2.5 py-2 text-[12px] font-extrabold text-white/80 hover:bg-white/10">+15 s</button>
      </div>
      <button type="button" onClick={vitesse} aria-label="Vitesse de lecture" className="shrink-0 rounded-full bg-white/10 px-2.5 py-2 text-[12px] font-extrabold tabular-nums hover:bg-white/20">×{String(VITESSES[v]).replace(".", ",")}</button>
    </div>
  );
}
