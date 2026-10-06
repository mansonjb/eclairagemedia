import { dateLongue, RUBRIQUES, type RubriqueId } from "@/lib/editions";
import InscriptionLiseuse from "@/components/dyn/InscriptionLiseuse";
import livres from "../../../content/epub.json";

export const metadata = {
  title: "Sur liseuse",
  description: "Éclairage sur liseuse : chaque jour, toutes les éditions réunies dans un livre numérique, à télécharger ou à recevoir automatiquement sur Kindle ou PocketBook.",
};

type Livre = { date: string; url: string; txt?: string; taille: number; rubriques: RubriqueId[]; sujets: number };
const ko = (n: number) => `${Math.max(1, Math.round(n / 1024))} Ko`;

// Éclairage sur liseuse : livre du jour à télécharger, envoi automatique, archives
export default function Liseuse() {
  const [dernier, ...autres] = livres as Livre[];
  return (
    <main className="flex flex-col gap-5 pt-6">
      <section className="px-2">
        <span className="pastille bg-jaune text-encre">LISEUSE</span>
        <h1 className="d mt-3 text-balance text-[34px] leading-[1.02] sm:text-[52px]">Éclairage, <span className="surligne whitespace-nowrap">sur liseuse.</span></h1>
        <p className="mt-3 max-w-2xl text-[16.5px] leading-relaxed text-gris">Chaque jour, toutes les éditions réunies dans un livre numérique : un chapitre par rubrique, un sommaire cliquable, sans publicité. Le livre est complet vers 8h30.</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {dernier && (
          <section className="carte flex flex-col gap-4 p-5 sm:p-7">
            <p className="text-[13px] font-extrabold tracking-[0.06em] text-bleu">LIVRE DU JOUR · {dateLongue(dernier.date).toUpperCase()}</p>
            <div className="flex flex-wrap gap-2">
              {dernier.rubriques.map((r) => <span key={r} className="pastille" style={{ backgroundColor: RUBRIQUES[r].fond, color: RUBRIQUES[r].couleur }}>{RUBRIQUES[r].court}</span>)}
            </div>
            <a href={dernier.url} download className="self-start rounded-full bg-encre px-6 py-3 text-[15px] font-bold text-white hover:bg-bleu">Télécharger l&apos;EPUB ({dernier.sujets} sujets, {ko(dernier.taille)})</a>
            {dernier.txt && <p className="text-[14px] text-gris">Ancienne Kindle (avant 2012) : <a href={dernier.txt} download className="font-bold text-encre underline underline-offset-4">version texte (.txt)</a>, à télécharger depuis le navigateur de la liseuse.</p>}
            <p className="text-[14px] text-gris">Depuis la liseuse, tapez simplement <b className="text-encre">eclairagemedia.com/read</b> dans son navigateur.</p>
          </section>
        )}
        <section className="carte flex flex-col gap-4 p-5 sm:p-7">
          <p className="text-[13px] font-extrabold tracking-[0.06em] text-bleu">CHAQUE MATIN SUR VOTRE KINDLE OU POCKETBOOK</p>
          <ol className="flex flex-col gap-3 text-[15px] leading-relaxed">
            <li><b>1. Donnez l&apos;adresse e-mail de votre liseuse</b> (Kindle : se termine par @kindle.com ; PocketBook : par @pbsync.com).
              <div className="mt-2"><InscriptionLiseuse /></div></li>
            <li><b>2. Autorisez notre adresse</b> <span className="select-all font-bold">bonjour@eclairagemedia.com</span>. Kindle : sur amazon.fr, Gérer votre contenu et vos appareils, onglet Préférences, Paramètres des documents personnels, Liste des adresses approuvées. PocketBook : dans l&apos;application Send-to-PocketBook, liste des expéditeurs.</li>
            <li><b>3. C&apos;est tout.</b> Le livre arrive chaque matin vers 8h30, dès que la liseuse se connecte au Wi-Fi.</li>
          </ol>
        </section>
      </div>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          ["Kobo", "Ouvrez eclairagemedia.com/read dans le navigateur de la Kobo (Paramètres, Fonctions bêta) et touchez « Télécharger l'EPUB », ou copiez le fichier en USB."],
          ["Kindle", "Le plus simple : l'envoi automatique ci-dessus. Sinon, envoyez le fichier avec Send to Kindle (site, application ou e-mail) : Amazon le convertit."],
          ["PocketBook et autres", "Envoi automatique ci-dessus, téléchargement depuis le navigateur de la liseuse, ou copie du fichier en USB. L'EPUB est lu par toutes les liseuses récentes."],
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
