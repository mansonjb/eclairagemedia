import fs from "node:fs";
import path from "node:path";
import indexData from "../../content/index.json";

export type Sujet = {
  n: number; theme: string; titre: string; image: string | null; legende: string | null;
  chapeau: string | null; eclairage: string | null; change: string | null; chiffres: { valeur: string; legende: string }[];
  passe: string | null; points: string[]; explication?: string | null; chronologie?: { quand: string; texte: string }[]; apres: string | null; sources: { url: string; nom: string }[];
  cartes: { fond: string; couleur: string; parti: string; qui: string; contexte: string | null; texte: string; url: string; source: string }[];
};
export type Edition = { rubrique: RubriqueId; date: string; minutes: number; sujets: Sujet[]; lexique: { terme: string; definition: string }[]; agenda: { jour: string; mois: string; texte: string }[];
  quiz?: { affirmation: string; reponse: boolean; explication: string } };
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

// Le sujet mis « à la une » d'un jour : le premier sujet illustré, dans l'ordre des rubriques
export function une(date: string): { e: Edition; s: Sujet } | null {
  const eds = parDate(date);
  for (const e of eds) { const s = e.sujets.find((x) => x.image); if (s) return { e, s }; }
  return eds[0]?.sujets[0] ? { e: eds[0], s: eds[0].sujets[0] } : null;
}
// Un chiffre par rubrique, avec le sujet dont il vient (titre, photo) pour donner le contexte
export function chiffresDuJour(date: string) {
  return parDate(date).flatMap((e) => {
    const s = e.sujets.find((x) => x.chiffres.length);
    return s ? [{ ...s.chiffres[0], rubrique: e.rubrique, date: e.date, titre: s.titre, image: s.image, theme: s.theme, n: s.n }] : [];
  });
}
export function motDuJour(date: string) {
  for (const e of parDate(date)) if (e.lexique[0]) return { ...e.lexique[0], rubrique: e.rubrique };
  return null;
}

export function agendaDuJour(date: string) {
  return parDate(date).flatMap((e) => e.agenda.slice(0, 3).map((a) => ({ ...a, rubrique: e.rubrique, href: `/${e.rubrique}/${e.date}` }))).slice(0, 6);
}
export function lexiqueDuJour(date: string) {
  return parDate(date).flatMap((e) => e.lexique.slice(0, 1).map((l) => ({ ...l, rubrique: e.rubrique, href: `/${e.rubrique}/${e.date}` })));
}

// Données sérialisables pour les composants interactifs (cartes photo, onglets, carrousel)
export function items(date: string) {
  return parDate(date).flatMap((e) => e.sujets.map((s) => ({
    href: `/${e.rubrique}/${e.date}/${s.n}`, rubrique: e.rubrique, theme: s.theme, titre: s.titre,
    image: s.image, legende: s.legende, minutes: e.minutes, chapeau: s.chapeau, date: e.date,
  })));
}

import quizManuel from "../../content/quiz-manuel.json";
// Quiz du jour : celui d'une édition (politique d'abord), sinon le quiz rédigé à la main
// Jusqu'à 3 quiz du jour, de rubriques différentes (dans l'ordre des rubriques), sinon le quiz rédigé à la main
export function quizDuJourListe(date: string, k = 3) {
  const liste = parDate(date).filter((e) => e.quiz).map((e) => ({ ...e.quiz!, href: `/${e.rubrique}/${e.date}`, rubrique: e.rubrique }));
  if (liste.length) return liste.slice(0, k);
  const q = quizDuJour(date);
  return q ? [q] : [];
}
export function quizDuJour(date: string) {
  const e = parDate(date).find((x) => x.quiz);
  if (e?.quiz) return { ...e.quiz, href: `/${e.rubrique}/${e.date}`, rubrique: e.rubrique };
  const m = (quizManuel as unknown as Record<string, { affirmation: string; reponse: boolean; explication: string; rubrique: string }>)[date];
  return m ? { ...m, href: `/${m.rubrique}/${date}` } : null;
}

// Les trois sujets principaux du jour : d'abord un sujet avec une vraie photo, puis deux autres rubriques
export function unesDuJour(date: string): { e: Edition; s: Sujet }[] {
  const eds = parDate(date).filter((e) => e.sujets[0]);
  const vraie = (e: Edition) => !!e.sujets[0].image && !e.sujets[0].legende?.endsWith("(illustration)");
  const lead = eds.find(vraie) ?? eds[0];
  if (!lead) return [];
  return [lead, ...eds.filter((e) => e !== lead)].slice(0, 3).map((e) => ({ e, s: e.sujets[0] }));
}

// Lien vers la page d'un sujet
export const lienSujet = (e: { rubrique: string; date: string }, s: { n: number }) => `/${e.rubrique}/${e.date}/${s.n}`;

// Sujets complémentaires : mots partagés (titre, thème, chapeau), même thème, même rubrique, proximité de date
const VIDES = new Set("avec dans pour sans plus sont cette leur leurs elle elles mais comme entre vers chez apres avant depuis encore aussi tout tous toute toutes selon fait faire etre avoir deux trois quoi dont".split(" "));
const motsDe = (t: string) => new Set(t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[^a-z0-9]+/).filter((m) => m.length > 3 && !VIDES.has(m)));
export function complementaires(e: Edition, s: Sujet, k = 3) {
  const ref = motsDe(`${s.titre} ${s.theme} ${s.chapeau ?? ""}`);
  return editions.flatMap((x) => x.sujets.map((t) => ({ e: x, s: t })))
    .filter((x) => !(x.e === e && x.s.n === s.n))
    .map((x) => {
      let c = 0;
      for (const m of motsDe(`${x.s.titre} ${x.s.theme} ${x.s.chapeau ?? ""}`)) if (ref.has(m)) c++;
      const jours = Math.abs(Date.parse(x.e.date) - Date.parse(e.date)) / 864e5;
      return { ...x, score: c + (x.s.theme === s.theme ? 2 : 0) + (x.e.rubrique === e.rubrique ? 1 : 0) - jours / 30 };
    })
    .sort((a, b) => b.score - a.score).slice(0, k);
}
