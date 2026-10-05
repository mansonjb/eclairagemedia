import { RUBRIQUES, unesDuJour } from "@/lib/editions";
import { UneEtapes } from "@/components/dyn/Une";

// Les trois sujets principaux du jour, en étapes : un clic change la grande carte, sans changer de page
export default function Parcours({ date }: { date: string }) {
  const court = (t: string) => { const a = t.split(" : ")[0]; return a.length <= 34 ? a : a.split(" ").slice(0, 4).join(" ") + "…"; };
  return <UneEtapes etapes={unesDuJour(date).map(({ e, s }) => ({ nom: court(s.titre), couleur: RUBRIQUES[e.rubrique].couleur, theme: s.theme.charAt(0) + s.theme.slice(1).toLowerCase() }))} />;
}
