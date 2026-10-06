import { dateLongue, RUBRIQUES, type RubriqueId } from "@/lib/editions";
import livres from "../../../content/epub.json";

export const metadata = {
  title: "Sur liseuse",
  description: "Éclairage en livre numérique : chaque jour, toutes les éditions réunies dans un fichier EPUB à lire sur Kobo, Kindle, PocketBook ou toute liseuse.",
};

type Livre = { date: string; url: string; taille: number; rubriques: RubriqueId[]; sujets: number };
const ko = (n: number) => `${Math.max(1, Math.round(n / 1024))} Ko`;

// Les éditions du jour en EPUB, du plus récent au plus ancien
export default function Liseuse() {
  const [dernier, ...autres] = livres as Livre[];
  return (
    <main className="flex flex-col gap-5 pt-6">
      <section className="px-2">
        <span className="pastille bg-jaune text-encre">LISEUSE</span>
        <h1 className="d mt-3 text-balance text-[34px] leading-[1.02] sm:text-[52px]">Éclairage, <span className="surligne whitespace-nowrap">sur liseuse.</span></h1>
        <p className="mt-3 max-w-2xl text-[16.5px] leading-relaxed text-gris">Chaque jour, toutes les éditions réunies dans un livre numérique (EPUB) : un chapitre par rubrique, un sommaire cliquable, sans images ni publicité. Le livre se complète au fil de la matinée, il est entier vers 8h30.</p>
      </section>

      {dernier && (
        <section className="carte flex flex-col gap-4 p-5 sm:p-7">
          <p className="text-[13px] font-extrabold tracking-[0.06em] text-bleu">LIVRE DU JOUR · {dateLongue(dernier.date).toUpperCase()}</p>
          <div className="flex flex-wrap gap-2">
            {dernier.rubriques.map((r) => <span key={r} className="pastille" style={{ backgroundColor: RUBRIQUES[r].fond, color: RUBRIQUES[r].couleur }}>{RUBRIQUES[r].court}</span>)}
          </div>
          <a href={dernier.url} download className="self-start rounded-full bg-encre px-6 py-3 text-[15px] font-bold text-white hover:bg-bleu">Télécharger l&apos;EPUB ({dernier.sujets} sujets, {ko(dernier.taille)})</a>
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-3">
        {[
          ["Kobo", "Branchez la liseuse en USB et glissez le fichier dans sa mémoire, ou ouvrez cette page dans le navigateur de la Kobo et touchez « Télécharger »."],
          ["Kindle", "Envoyez le fichier avec Send to Kindle (site amazon.fr/sendtokindle, application ou e-mail vers votre adresse @kindle.com) : Amazon le convertit."],
          ["PocketBook et autres", "Téléchargement direct depuis le navigateur de la liseuse, ou copie du fichier en USB. Le format EPUB est lu par toutes les liseuses."],
        ].map(([t, d]) => (
          <div key={t} className="carte p-6"><h2 className="d text-[20px]">{t}</h2><p className="mt-2 text-[15px] leading-relaxed text-gris">{d}</p></div>
        ))}
      </section>

      {autres.length > 0 && (
        <section className="carte p-5 sm:p-7">
          <h2 className="d mb-3 text-[22px]">Les jours précédents</h2>
          {autres.map((l, k) => (
            <a key={l.date} href={l.url} download className={`flex items-center justify-between gap-3 py-3 text-[15px] hover:text-bleu ${k < autres.length - 1 ? "border-b border-filet" : ""}`}>
              <span className="font-semibold">{dateLongue(l.date)}</span><span className="text-gris">{l.sujets} sujets · {ko(l.taille)}</span>
            </a>
          ))}
        </section>
      )}
    </main>
  );
}
