import data from "../../content/podcasts.json";

export type Episode = {
  rubrique: string; date: string; url: string; taille: number; duree: number; titre: string; titre_episode?: string | null; description?: string | null;
  sujets: { rubrique?: string; n: number; titre: string }[]; transcription: { qui: string; texte: string }[];
};
export const episodes = data as unknown as Episode[];
export const SITE = "https://www.eclairagemedia.com";
export const SPOTIFY = "https://open.spotify.com/show/30PlME95PqcFG6epQNAIAh";
export const episode = (date: string, rubrique = "politique") => episodes.find((e) => e.date === date && e.rubrique === rubrique);
export const dernier = (rubrique = "politique") => episodes.find((e) => e.rubrique === rubrique);
export const minutes = (s: number) => `${Math.max(1, Math.round(s / 60))} min`;

// Deux émissions : l'édition politique (courte) et « L'essentiel du jour » (toutes rubriques sauf local)
export const EMISSIONS: Record<string, { nom: string; court: string }> = {
  politique: { nom: "L'édition politique", court: "Politique" },
  essentiel: { nom: "L'essentiel du jour", court: "L'essentiel" },
};
export const lienEpisode = (e: { rubrique: string; date: string }) => (e.rubrique === "politique" ? `/ecouter/${e.date}` : `/ecouter/${e.rubrique}/${e.date}`);
export const lienSujetEpisode = (e: Episode, s: Episode["sujets"][number]) => `/${s.rubrique ?? e.rubrique}/${e.date}/${s.n}`;
