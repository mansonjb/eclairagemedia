import type { Candidat } from "@/components/dyn/Candidats";

// Le baromètre n'a pas de note globale : on classe d'abord sur la moyenne des sondages (une mesure publiée,
// vérifiable), puis les personnalités non testées, par probabilité Polymarket.
export function parSondage(c: Candidat[]) {
  const testes = c.filter((x) => x.sondage).sort((a, b) => b.sondage!.v - a.sondage!.v);
  const autres = c.filter((x) => !x.sondage).sort((a, b) => (b.polymarket?.v ?? -1) - (a.polymarket?.v ?? -1));
  return [...testes, ...autres];
}
export const pct = (v: number) => `${v.toFixed(1).replace(".", ",")} %`;
export const pctPm = (v: number) => (v < 1 ? "< 1 %" : `${Math.round(v)} %`);
export const ordinal = (n: number) => `${n}${n === 1 ? "er" : "e"}`;
// Rang de chacun sur l'attention en ligne (pas de valeur affichée : l'indice est une construction)
export function rangsAttention(c: Candidat[]) {
  const l = c.filter((x) => x.attention).sort((a, b) => b.attention!.v - a.attention!.v);
  return Object.fromEntries(l.map((x, i) => [x.nom, i + 1])) as Record<string, number>;
}
