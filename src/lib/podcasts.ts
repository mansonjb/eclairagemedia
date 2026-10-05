import data from "../../content/podcasts.json";

export type Episode = {
  rubrique: string; date: string; url: string; taille: number; duree: number; titre: string;
  sujets: { n: number; titre: string }[]; transcription: { qui: string; texte: string }[];
};
export const episodes = data as unknown as Episode[];
export const SITE = "https://www.eclairagemedia.com";
export const episode = (date: string, rubrique = "politique") => episodes.find((e) => e.date === date && e.rubrique === rubrique);
export const dernier = (rubrique = "politique") => episodes.find((e) => e.rubrique === rubrique);
export const minutes = (s: number) => `${Math.max(1, Math.round(s / 60))} min`;
