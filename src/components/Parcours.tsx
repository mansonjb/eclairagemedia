import { RUBRIQUES, unesDuJour, titreCourt } from "@/lib/editions";
import { UneEtapes } from "@/components/dyn/Une";

// Les trois sujets principaux du jour, en étapes : un clic change la grande carte, sans changer de page
export default function Parcours({ date }: { date: string }) {
  return <UneEtapes etapes={unesDuJour(date).map(({ e, s }) => ({ nom: titreCourt(e, s), titre: titreCourt(e, s), couleur: RUBRIQUES[e.rubrique].couleur, fond: RUBRIQUES[e.rubrique].fond, rubrique: RUBRIQUES[e.rubrique].court, theme: s.theme.charAt(0) + s.theme.slice(1).toLowerCase() }))} />;
}
