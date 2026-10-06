import Portrait from "@/components/Portrait";
import type { Candidat } from "@/components/dyn/Candidats";

const NOMS: Record<string, string> = { sondage: "Sondages", polymarket: "Polymarket", attention: "Attention" };

// Podium : 2e à gauche, 1er au centre (plus haut), 3e à droite
export default function Podium({ candidats, poids }: { candidats: Candidat[]; poids: Record<string, number> }) {
  const [p1, p2, p3] = candidats;
  const marche = (c: Candidat | undefined, rang: number, h: string) => c && (
    <div className={`flex flex-col items-center ${rang === 1 ? "order-2" : rang === 2 ? "order-1" : "order-3"}`}>
      <Portrait nom={c.nom} couleur={c.couleur} className={`rounded-full shadow-lg ${rang === 1 ? "h-28 w-28" : "h-24 w-24"}`} texte={rang === 1 ? "text-[34px]" : "text-[28px]"} />
      <p className={`d mt-3 text-center leading-tight ${rang === 1 ? "text-[24px]" : "text-[19px]"}`}>{c.nom}</p>
      <span className="pastille mt-1.5 text-white" style={{ backgroundColor: c.couleur }}>{c.etiquette}</span>
      {/* marches de couleur unique, seule la hauteur change ; le rang est toujours au même endroit, en bas */}
      <div className={`mt-4 flex w-full flex-col items-center justify-between rounded-t-[22px] bg-lavande pb-6 pt-6 ${h}`}>
        <div className="flex flex-col items-center">
          <p className={`d leading-none ${rang === 1 ? "text-[64px]" : "text-[48px]"}`}>{c.score}</p>
          <p className="mt-1 text-[12px] font-extrabold tracking-[0.04em] text-gris">SCORE /100</p>
        </div>
        <p className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[17px] font-extrabold">{rang}<sup className="text-[10px]">{rang === 1 ? "er" : "e"}</sup></p>
      </div>
    </div>
  );
  return (
    <section className="carte overflow-hidden px-4 pt-7 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="pastille bg-jaune text-encre">LE PODIUM DU JOUR</span>
        <p className="text-[13px] font-semibold text-gris">Score Éclairage = {Object.entries(poids).map(([k, v]) => `${NOMS[k]} ${Math.round(v * 100)} %`).join(" + ")}</p>
      </div>
      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 items-end gap-3 sm:gap-5">
        {marche(p1, 1, "h-64")}
        {marche(p2, 2, "h-52")}
        {marche(p3, 3, "h-44")}
      </div>
    </section>
  );
}
