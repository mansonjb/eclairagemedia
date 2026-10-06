import Link from "next/link";
import { type Episode, minutes, lienSujetEpisode } from "@/lib/podcasts";
import { dateLongue, RUBRIQUES, type RubriqueId } from "@/lib/editions";
import Lecteur from "@/components/dyn/Lecteur";
import BoutonSpotify from "@/components/BoutonSpotify";

// Page d'écoute d'un épisode (politique ou « L'essentiel du jour ») : lecteur, sujets, transcription
export default function PageEpisode({ e }: { e: Episode }) {
  const long = e.rubrique !== "politique";
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 pt-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/podcast" className="rounded-full bg-white px-4 py-2.5 text-[14px] font-bold hover:bg-lavande">← Tous les épisodes</Link>
        <span className="pastille bg-jaune text-encre">PODCAST · {minutes(e.duree)}</span>
      </div>
      <section className="px-2">
        <p className="text-[15px] font-semibold text-gris">{dateLongue(e.date)}</p>
        <h1 className="d mt-1.5 text-balance text-[32px] leading-[1.05] sm:text-[46px]">
          {long ? <>L&apos;essentiel du jour, <span className="surligne whitespace-nowrap">à écouter.</span></> : <>L&apos;édition politique, <span className="surligne whitespace-nowrap">à écouter.</span></>}
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-gris">
          {long ? "Léa et Paul font le tour de l'actualité du jour : politique, économie, santé, alimentation, IA et tech. " : "Léa et Paul reprennent les sujets du jour, sans prérequis. "}
          Le texte n&apos;utilise que les faits vérifiés et sourcés des éditions écrites.
        </p>
      </section>
      <Lecteur src={e.url} titre={e.titre} duree={e.duree} grand />
      <div className="flex flex-wrap items-center gap-3 px-2"><BoutonSpotify /><span className="text-[13.5px] text-gris">pour l&apos;écouter dans l&apos;application et recevoir chaque nouvel épisode</span></div>
      {e.sujets.length > 0 && (
        <section className="carte p-6">
          <p className="text-[13px] font-extrabold tracking-[0.06em] text-bleu">DANS CET ÉPISODE</p>
          <ul className="mt-3 divide-y divide-filet">
            {e.sujets.map((s, k) => {
              const R = RUBRIQUES[(s.rubrique ?? e.rubrique) as RubriqueId];
              return (
                <li key={k}><Link href={lienSujetEpisode(e, s)} className="flex items-center gap-3 py-3 text-[16px] font-bold hover:text-bleu">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] text-white" style={{ backgroundColor: R?.couleur ?? "#2f3cff" }}>{k + 1}</span>
                  <span>{long && R && <span className="mr-2 text-[12px] font-extrabold uppercase tracking-[0.05em]" style={{ color: R.couleur }}>{R.court}</span>}{s.titre}</span>
                </Link></li>
              );
            })}
          </ul>
        </section>
      )}
      {e.transcription.length > 0 && (
        <details className="carte p-6">
          <summary className="cursor-pointer text-[15px] font-extrabold">Lire la transcription</summary>
          <div className="mt-4 flex flex-col gap-3 text-[15.5px] leading-relaxed">
            {e.transcription.map((r, k) => <p key={k}><b className={r.qui === "Léa" ? "text-bleu" : "text-[#0a7d5a]"}>{r.qui} :</b> {r.texte}</p>)}
          </div>
        </details>
      )}
      <p className="px-2 text-[13px] text-gris">Voix de synthèse (Gemini). Abonnez-vous au <a href="/podcast.xml" className="underline">flux RSS du podcast</a> dans votre application.</p>
    </main>
  );
}
