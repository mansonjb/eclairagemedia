"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import type { QuizData } from "./Quiz";
import { RUBRIQUES } from "@/lib/rubriques-client";

// Pile de quiz « Vrai ou faux » : glisser à droite = vrai, à gauche = faux (ou les flèches), puis carte suivante
export default function QuizPile({ qs }: { qs: QuizData[] }) {
  const [i, setI] = useState(0);
  const [rep, setRep] = useState<(boolean | null)[]>(qs.map(() => null));
  const [dx, setDx] = useState(0);
  const depart = useRef<number | null>(null);
  const fini = i >= qs.length;
  const q = qs[i];
  const repondu = !fini && rep[i] !== null;
  const bonnes = rep.filter((r, k) => r !== null && r === qs[k].reponse).length;

  const repondre = (v: boolean) => { if (fini || repondu) return; setRep((r) => r.map((x, k) => (k === i ? v : x))); };
  const suivante = () => setI((x) => Math.min(x + 1, qs.length));
  const relacher = () => {
    if (Math.abs(dx) > 90) { if (repondu) suivante(); else repondre(dx > 0); }
    setDx(0); depart.current = null;
  };

  return (
    <section className="carte flex flex-col gap-4 !bg-jaune p-6 sm:p-7" aria-label="Quiz du jour">
      <div className="flex items-center justify-between">
        <span className="pastille bg-encre text-jaune">VRAI OU FAUX&nbsp;?</span>
        <span className="flex gap-1.5" aria-label={`Question ${Math.min(i + 1, qs.length)} sur ${qs.length}`}>
          {qs.map((_, k) => <span key={k} className={`h-2.5 w-2.5 rounded-full ${k < i || (k === i && repondu) ? (rep[k] === qs[k].reponse ? "bg-[#0a7d5a]" : "bg-[#d7263d]") : k === i ? "bg-encre" : "bg-encre/25"}`} />)}
        </span>
      </div>

      <div className="relative">
        {/* cartes suivantes, en pile derrière */}
        {!fini && qs.slice(i + 1, i + 3).map((_, k) => (
          <div key={k} className="absolute inset-0 rounded-[22px] bg-white/60" style={{ transform: `translateY(${(k + 1) * 8}px) scale(${1 - (k + 1) * 0.04})`, zIndex: 1 - k }} />
        ))}
        {fini ? (
          <div className="apparait relative z-10 flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-[22px] bg-white p-6 text-center">
            <p className="d text-[48px] leading-none">{bonnes}/{qs.length}</p>
            <p className="text-[16px] font-bold">{bonnes === qs.length ? "Sans faute\u00a0!" : bonnes ? "Pas mal\u00a0!" : "Les explications valent le détour."}</p>
            <button onClick={() => { setI(0); setRep(qs.map(() => null)); }} className="rounded-full bg-encre px-5 py-2.5 text-[14px] font-extrabold text-white">Recommencer</button>
          </div>
        ) : (
          <div key={i}
            className={`apparait relative z-10 flex min-h-[260px] cursor-grab touch-pan-y select-none flex-col gap-3 rounded-[22px] bg-white p-5 shadow-sm active:cursor-grabbing ${depart.current === null ? "transition-transform duration-200" : ""}`}
            style={{ transform: `translateX(${dx}px) rotate(${dx / 18}deg)` }}
            onPointerDown={(e) => { depart.current = e.clientX; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
            onPointerMove={(e) => { if (depart.current !== null) setDx(e.clientX - depart.current); }}
            onPointerUp={relacher} onPointerCancel={relacher}>
            {!repondu && dx !== 0 && (
              <span className={`absolute top-4 rounded-full px-3 py-1 text-[13px] font-extrabold text-white ${dx > 0 ? "right-4 bg-[#0a7d5a]" : "left-4 bg-[#d7263d]"}`} style={{ opacity: Math.min(Math.abs(dx) / 90, 1) }}>{dx > 0 ? "VRAI" : "FAUX"}</span>
            )}
            <span className="pastille self-start text-white" style={{ backgroundColor: RUBRIQUES[q.rubrique as keyof typeof RUBRIQUES]?.couleur ?? "#14142b" }}>{RUBRIQUES[q.rubrique as keyof typeof RUBRIQUES]?.court ?? ""}</span>
            <p className="d text-[21px] leading-[1.15]">{q.affirmation}</p>
            {repondu && (
              <div className="apparait mt-auto rounded-[16px] bg-fond p-3.5" onPointerDown={(e) => e.stopPropagation()}>
                <p className="text-[15px] font-extrabold" style={{ color: rep[i] === q.reponse ? "#0a7d5a" : "#d7263d" }}>{rep[i] === q.reponse ? "Bien vu\u00a0!" : "Raté\u00a0!"} C&apos;est {q.reponse ? "vrai" : "faux"}.</p>
                <p className="mt-1 text-[13.5px] leading-relaxed">{q.explication}</p>
                <Link href={q.href} className="mt-1.5 inline-block text-[13px] font-bold underline underline-offset-4">Comprendre le sujet →</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {!fini && (
        <div className="flex items-center gap-2.5">
          {repondu ? (
            <button onClick={suivante} className="h-[52px] flex-1 rounded-full bg-encre text-[16px] font-extrabold text-white">{i + 1 < qs.length ? "Question suivante →" : "Voir mon score →"}</button>
          ) : (
            <>
              <button onClick={() => repondre(false)} aria-label="Faux" className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-encre text-[16px] font-extrabold hover:bg-white/50">← Faux</button>
              <button onClick={() => repondre(true)} aria-label="Vrai" className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-encre text-[16px] font-extrabold text-white">Vrai →</button>
            </>
          )}
        </div>
      )}
      {!fini && !repondu && <p className="-mt-1 text-center text-[12px] font-semibold text-encre/60">Glissez la carte : à droite vrai, à gauche faux</p>}
    </section>
  );
}
