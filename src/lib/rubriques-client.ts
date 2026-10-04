// Copie légère (sans fs) pour les composants client
export const ORDRE = ["politique", "economie", "sante", "local", "food", "tech"] as const;
export type RId = (typeof ORDRE)[number];
export const RUBRIQUES: Record<RId, { court: string; couleur: string; fond: string }> = {
  politique: { court: "Politique", couleur: "#2f3cff", fond: "#e8eaff" },
  economie: { court: "Économie", couleur: "#0a7d5a", fond: "#e0f4ec" },
  sante: { court: "Santé", couleur: "#0e8a8a", fond: "#e0f4f4" },
  local: { court: "La Rochelle", couleur: "#0066a6", fond: "#e3f0fa" },
  food: { court: "Food & Bio", couleur: "#4f8a1f", fond: "#eaf4e0" },
  tech: { court: "IA & Tech", couleur: "#5b21b6", fond: "#efe8ff" },
};
