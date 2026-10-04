// Copie légère (sans fs) pour les composants client
export const ORDRE = ["politique", "economie", "sante", "local", "food", "tech"] as const;
export const RUBRIQUES: Record<(typeof ORDRE)[number], { court: string; couleur: string }> = {
  politique: { court: "Politique", couleur: "#2f3cff" },
  economie: { court: "Économie", couleur: "#0a7d5a" },
  sante: { court: "Santé", couleur: "#0e8a8a" },
  local: { court: "La Rochelle", couleur: "#0066a6" },
  food: { court: "Food & Bio", couleur: "#4f8a1f" },
  tech: { court: "IA & Tech", couleur: "#5b21b6" },
};
