import fs from "node:fs";
import path from "node:path";
import indexData from "../../content/index.json";

export type Sujet = { n: number; theme: string; titre: string };
export type Edition = { rubrique: RubriqueId; date: string; sujets: Sujet[] };
export type RubriqueId = "politique" | "economie" | "sante" | "local" | "food" | "tech";

export const RUBRIQUES: Record<RubriqueId, { nom: string; court: string; couleur: string; fond: string; accroche: string; heure: string }> = {
  politique: { nom: "Éclairage", court: "Politique", couleur: "#2f3cff", fond: "#e8eaff", heure: "6h30",
    accroche: "Vous avez décroché de la politique ? On reprend depuis le début. France, Europe, monde : un sujet, son contexte, les faits et les différentes positions." },
  economie: { nom: "Éclairage Économie", court: "Économie", couleur: "#0a7d5a", fond: "#e0f4ec", heure: "6h50",
    accroche: "Une entreprise, un secteur, un chiffre : le contexte, les faits et les différents points de vue, de la tech à l'industrie." },
  sante: { nom: "Éclairage Santé", court: "Santé", couleur: "#0e8a8a", fond: "#e0f4f4", heure: "7h10",
    accroche: "Une étude, une technique, un traitement : ce qui change vraiment en médecine et en chirurgie, et ce que les résultats prouvent ou non." },
  local: { nom: "Éclairage Local", court: "La Rochelle", couleur: "#0066a6", fond: "#e3f0fa", heure: "7h35",
    accroche: "Ce qui se décide près de chez vous : La Rochelle, son agglomération et la Charente-Maritime, expliqués simplement." },
  food: { nom: "Éclairage Food & Bio", court: "Food & Bio", couleur: "#4f8a1f", fond: "#eaf4e0", heure: "8h00",
    accroche: "Ce qu'on mange est en train de changer : cuisine végétale, bio, nouvelles cultures, filières et nouvelles adresses." },
  tech: { nom: "Éclairage IA & Tech", court: "IA & Tech", couleur: "#5b21b6", fond: "#efe8ff", heure: "8h20",
    accroche: "L'IA va plus vite que les explications : un modèle, une loi, une puce, ce qui a changé et comment ça marche." },
};
export const ORDRE: RubriqueId[] = ["politique", "economie", "sante", "local", "food", "tech"];

export const editions = indexData as Edition[];

export const dates = (): string[] => [...new Set(editions.map((e) => e.date))].sort().reverse();
export const parDate = (date: string) =>
  ORDRE.map((r) => editions.find((e) => e.date === date && e.rubrique === r)).filter(Boolean) as Edition[];
export const parRubrique = (r: RubriqueId) => editions.filter((e) => e.rubrique === r);
export const trouver = (r: string, date: string) => editions.find((e) => e.rubrique === r && e.date === date);

export function htmlEdition(r: string, date: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content/editions", r, `${date}.html`), "utf8");
}

// Semaine ISO : « 2026-S40 » (lundi → dimanche)
export function semaineDe(date: string): string {
  const d = new Date(date + "T12:00:00Z");
  const jour = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - jour + 3);
  const premierJeudi = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const n = 1 + Math.round(((d.getTime() - premierJeudi.getTime()) / 864e5 - 3 + ((premierJeudi.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-S${String(n).padStart(2, "0")}`;
}
export const semaines = () => [...new Set(dates().map(semaineDe))];
export const joursDeSemaine = (s: string) => dates().filter((d) => semaineDe(d) === s).sort();
export const estWeekEnd = (date: string) => [0, 6].includes(new Date(date + "T12:00:00Z").getUTCDay());

const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", ...o });
const maj = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
export const dateLongue = (d: string) => maj(fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(d + "T12:00:00Z")));
export const dateCourte = (d: string) => fmt({ weekday: "short", day: "numeric", month: "short" }).format(new Date(d + "T12:00:00Z"));
export function libelleSemaine(s: string) {
  const j = joursDeSemaine(s);
  return j.length ? `du ${fmt({ day: "numeric", month: "long" }).format(new Date(j[0] + "T12:00:00Z"))} au ${fmt({ day: "numeric", month: "long" }).format(new Date(j[j.length - 1] + "T12:00:00Z"))}` : s;
}
