import Link from "next/link";
import { episodes, minutes, SITE } from "@/lib/podcasts";
import { dateLongue } from "@/lib/editions";
import Lecteur from "@/components/dyn/Lecteur";
import CopierRss from "@/components/dyn/CopierRss";

export const metadata = {
  title: "Podcast",
  description: "Éclairage à écouter : chaque matin, l'actualité politique racontée à deux voix en quelques minutes, à partir de faits vérifiés.",
};

const mois = (d: string) => new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d + "T12:00:00Z"));

// Le podcast : dernier épisode en grand, puis tous les épisodes regroupés par mois
export default function Podcast() {
  const liste = episodes.filter((e) => e.rubrique === "politique");
  const [dernier, ...autres] = liste;
  const groupes = autres.reduce<Record<string, typeof liste>>((g, e) => ((g[mois(e.date)] ??= []).push(e), g), {});
  return (
    <main className="flex flex-col gap-5 pt-6">
      <section className="grid items-end gap-5 px-2 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="pastille bg-jaune text-encre">PODCAST</span>
          <h1 className="d mt-3 text-balance text-[34px] leading-[1.02] sm:text-[52px]">Éclairage, <span className="surligne whitespace-nowrap">à écouter.</span></h1>
          <p className="mt-3 max-w-2xl text-[16.5px] leading-relaxed text-gris">Chaque matin, Léa et Paul racontent l&apos;actualité politique en quelques minutes, sans prérequis. Le texte reprend uniquement les faits vérifiés et sourcés de l&apos;édition écrite.</p>
        </div>
        <div className="carte flex flex-col gap-3 p-5">
          <p className="text-[13px] font-extrabold tracking-[0.06em]">S&apos;ABONNER AU PODCAST</p>
          <p className="text-[14px] text-gris">Copiez l&apos;adresse du flux dans votre application (Apple Podcasts, Pocket Casts, Podcast Addict…).</p>
          <CopierRss url={`${SITE}/podcast.xml`} />
        </div>
      </section>

      {dernier ? (
        <section className="carte flex flex-col gap-4 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] font-extrabold tracking-[0.06em] text-bleu">DERNIER ÉPISODE · {dateLongue(dernier.date).toUpperCase()} · {minutes(dernier.duree)}</p>
            <Link href={`/ecouter/${dernier.date}`} className="text-[13px] font-bold underline underline-offset-4">Transcription</Link>
          </div>
          <Lecteur src={dernier.url} titre={dernier.titre} duree={dernier.duree} grand />
          {dernier.sujets.length > 0 && (
            <ul className="grid gap-2 md:grid-cols-3">
              {dernier.sujets.map((s) => (
                <li key={s.n}><Link href={`/politique/${dernier.date}/${s.n}`} className="flex h-full items-start gap-2.5 rounded-[16px] bg-fond p-3.5 text-[14.5px] font-bold leading-snug hover:bg-lavande">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bleu text-[12px] text-white">{s.n}</span>{s.titre}
                </Link></li>
              ))}
            </ul>
          )}
        </section>
      ) : <p className="px-2 text-gris">Le premier épisode arrive bientôt.</p>}

      {Object.entries(groupes).map(([m, eps]) => (
        <section key={m} className="flex flex-col gap-3">
          <h2 className="d px-2 pt-3 text-[26px] capitalize">{m}</h2>
          {eps.map((e) => (
            <article key={e.date} className="carte flex flex-col gap-3 p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link href={`/ecouter/${e.date}`} className="d text-[19px] hover:text-bleu">{dateLongue(e.date)}</Link>
                <span className="text-[13px] font-bold text-gris">{minutes(e.duree)}</span>
              </div>
              {e.sujets.length > 0 && <p className="text-[14px] leading-snug text-gris">{e.sujets.map((s) => s.titre.split(" : ")[0]).join(" · ")}</p>}
              <Lecteur src={e.url} titre={e.titre} duree={e.duree} />
            </article>
          ))}
        </section>
      ))}

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Des faits vérifiés", "Le dialogue est écrit à partir de l'édition du jour, où chaque fait est confirmé par au moins trois sources. Rien n'est ajouté à l'oral."],
          ["Deux voix de synthèse", "Léa et Paul sont des voix générées par intelligence artificielle (Gemini). La transcription de chaque épisode est publiée."],
          ["Chaque matin", "Un nouvel épisode avec l'édition politique, disponible ici, sur la page de l'édition et dans votre application de podcast."],
        ].map(([t, x]) => (
          <div key={t} className="rounded-[24px] bg-white p-5"><p className="d text-[19px]">{t}</p><p className="mt-1.5 text-[14.5px] leading-relaxed text-gris">{x}</p></div>
        ))}
      </section>
    </main>
  );
}
