import type { Candidat } from "@/components/dyn/Candidats";

const NOMS: Record<string, string> = { sondage: "Sondages", polymarket: "Polymarket", attention: "Attention" };
const initiales = (n: string) => n.split(/[ -]/).filter((m) => m && m[0] === m[0].toUpperCase()).map((m) => m[0]).slice(0, 2).join("");

// Podium : 2e à gauche, 1er au centre (plus haut), 3e à droite
export default function Podium({ candidats, poids }: { candidats: Candidat[]; poids: Record<string, number> }) {
  const [p1, p2, p3] = candidats;
  const marche = (c: Candidat | undefined, rang: number, h: string, fond: string) => c && (
    <div className={`flex flex-col items-center ${rang === 1 ? "order-2" : rang === 2 ? "order-1" : "order-3"}`}>
      <span className={`d flex items-center justify-center rounded-[22px] text-white shadow-lg ${rang === 1 ? "h-24 w-24 text-[34px]" : "h-20 w-20 text-[28px]"}`} style={{ backgroundColor: c.couleur }}>{initiales(c.nom)}</span>
      <p className={`d mt-3 text-center leading-tight ${rang === 1 ? "text-[24px]" : "text-[19px]"}`}>{c.nom}</p>
      <span className="pastille mt-1.5 text-white" style={{ backgroundColor: c.couleur }}>{c.etiquette}</span>
      <div className={`mt-4 flex w-full flex-col items-center justify-start rounded-t-[22px] pt-5 ${h}`} style={{ backgroundColor: fond }}>
        <p className={`d leading-none ${rang === 1 ? "text-[64px]" : "text-[48px]"}`}>{c.score}</p>
        <p className="mt-1 text-[12px] font-extrabold tracking-[0.04em] opacity-70">SCORE /100</p>
        <p className="d mt-3 text-[30px] leading-none opacity-80">{rang}<sup className="text-[14px]">{rang === 1 ? "er" : "e"}</sup></p>
      </div>
    </div>
  );
  return (
    <section className="carte overflow-hidden px-4 pt-7 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="pastille bg-jaune text-encre">LE PODIUM DU JOUR</span>
        <p className="text-[13px] font-semibold text-gris">Score Éclairage = {Object.entries(poids).map(([k, v]) => `${NOMS[k]} ${Math.round(v * 100)} %`).join(" + ")}</p>
      </div>
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 items-end gap-3 sm:gap-5">
        {marche(p1, 1, "h-56", "#ffd60a")}
        {marche(p2, 2, "h-40", "#e8eaff")}
        {marche(p3, 3, "h-32", "#ffe4d9")}
      </div>
    </section>
  );
}
