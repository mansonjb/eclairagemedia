import { notFound } from "next/navigation";
import { episodes, episode } from "@/lib/podcasts";
import { dateLongue } from "@/lib/editions";
import PageEpisode from "@/components/PageEpisode";

type P = { params: Promise<{ date: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => {
  const l = episodes.filter((e) => e.rubrique === "essentiel").map((e) => ({ date: e.date }));
  return l.length ? l : [{ date: "aucun" }]; // export statique : au moins une page (404 tant qu'il n'y a pas d'épisode)
};
export async function generateMetadata({ params }: P) {
  const { date } = await params;
  if (!episode(date, "essentiel")) return {};
  return { title: `L'essentiel du ${dateLongue(date).replace(/^./, (c) => c.toLowerCase())}, à écouter`, description: "Le tour de l'actualité du jour à deux voix : politique, économie, santé, alimentation, IA et tech." };
}

// Page d'écoute de « L'essentiel du jour »
export default async function EcouterEssentiel({ params }: P) {
  const e = episode((await params).date, "essentiel");
  if (!e) notFound();
  return <PageEpisode e={e} />;
}
