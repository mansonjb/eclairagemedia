import { notFound } from "next/navigation";
import { episodes, episode } from "@/lib/podcasts";
import { dateLongue } from "@/lib/editions";
import PageEpisode from "@/components/PageEpisode";

type P = { params: Promise<{ date: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => episodes.filter((e) => e.rubrique === "politique").map((e) => ({ date: e.date }));
export async function generateMetadata({ params }: P) {
  const { date } = await params;
  return { title: `Écouter Éclairage du ${dateLongue(date).replace(/^./, (c) => c.toLowerCase())}`, description: "L'édition politique du jour en version audio, à deux voix." };
}

// Page d'écoute de l'épisode politique (lien du bouton « Écouter » de la newsletter)
export default async function Ecouter({ params }: P) {
  const e = episode((await params).date);
  if (!e) notFound();
  return <PageEpisode e={e} />;
}
