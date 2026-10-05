import Link from "next/link";
import { episodes, minutes } from "@/lib/podcasts";
import { dateLongue } from "@/lib/editions";
import Lecteur from "@/components/dyn/Lecteur";

export const metadata = { title: "Podcast Éclairage", description: "L'édition politique du jour en version audio, à deux voix, chaque matin." };

export default function Podcasts() {
  const liste = episodes.filter((e) => e.rubrique === "politique");
  const [premier, ...autres] = liste;
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 pt-6">
      <section className="px-2">
        <span className="pastille bg-jaune text-encre">PODCAST</span>
        <h1 className="d mt-3 text-[34px] leading-none sm:text-[52px]">Éclairage, <span className="surligne whitespace-nowrap">à écouter.</span></h1>
        <p className="mt-3 text-[16px] text-gris">Chaque matin, l&apos;édition politique racontée à deux voix en quelques minutes. <a href="/podcast.xml" className="underline">Flux RSS</a> pour votre application de podcast.</p>
      </section>
      {premier ? <Lecteur src={premier.url} titre={premier.titre} duree={premier.duree} grand /> : <p className="px-2 text-gris">Premier épisode bientôt.</p>}
      <ul className="flex flex-col gap-2.5">
        {liste.map((e) => (
          <li key={e.date}><Link href={`/ecouter/${e.date}`} className="carte flex items-center justify-between gap-3 p-5 hover:bg-lavande">
            <span className="d text-[19px]">{dateLongue(e.date)}</span><span className="text-[13px] font-bold text-gris">{minutes(e.duree)}</span>
          </Link></li>
        ))}
      </ul>
      {autres.length === 0 && null}
    </main>
  );
}
