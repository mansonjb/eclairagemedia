import { CreditsPortraits } from "@/components/Portrait";
import barometre from "../../../content/barometre.json";
import Candidats, { type Candidat } from "@/components/dyn/Candidats";
import Podium from "@/components/Podium";
import Classement from "@/components/Classement";

export const metadata = {
  title: "Baromètre présidentielle 2027",
  description: "Sondages, attention en ligne et marchés de prédiction pour chaque personnalité de la présidentielle 2027, avec leurs dernières déclarations.",
};

const fmt = (d: string) => new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(d + "T12:00:00Z"));

export default function Barometre() {
  const b = barometre as unknown as { date: string | null; sondage: { methode?: string; nb?: number; debut?: string; fin?: string; instituts?: string[]; institut?: string; commanditaire?: string; date?: string; url: string; marge?: string } | null; sources_attention: string[]; polymarket_volume: number | null; poids: Record<string, number>; candidats: Candidat[]; serie: { date: string; attention: Record<string, number>; polymarket: Record<string, number> }[] };
  const mesures = [
    { titre: "Les sondages", couleur: "#2f3cff", fond: "#e8eaff", texte: b.sondage
      ? b.sondage.methode === "moyenne"
        ? `Moyenne des ${b.sondage.nb} sondages publiés du ${fmt(b.sondage.debut!)} au ${fmt(b.sondage.fin!)} (${b.sondage.instituts!.join(", ")}).`
        : `${b.sondage.institut} pour ${b.sondage.commanditaire}, publié le ${fmt(b.sondage.date!)}. Marge d'erreur ${b.sondage.marge}.`
      : "Le dernier sondage d'intentions de vote au premier tour, vérifié sur la publication de l'institut. Ajouté par l'édition politique.",
      note: "Une photographie à une date donnée, pas une prédiction." },
    { titre: "L'attention en ligne", couleur: "#ff6a3d", fond: "#ffe4d9", texte: "Un rang parmi les personnalités suivies, sur 7 jours : consultations Wikipedia, engagement sur ses posts, citations par les journalistes et les médias, abonnés gagnés, vues YouTube.",
      note: "Mesure le bruit, pas le soutien : une polémique fait aussi monter l'indice." },
    { titre: "Les marchés de prédiction", couleur: "#14142b", fond: "#ffffff", texte: `Probabilité implicite des paris Polymarket${b.polymarket_volume ? `, ${Math.round(b.polymarket_volume / 1e6)} millions de dollars engagés` : ""}.`,
      note: "Reflète l'avis des parieurs, pas celui des électeurs." },
  ];
  return (
    <main className="flex flex-col gap-5 pt-7">
      <section className="px-2">
        <p className="text-[15px] font-semibold text-gris">{b.date ? `Relevé du ${fmt(b.date)}` : "Baromètre"} · mis à jour chaque matin</p>
        <h1 className="d mt-1.5 text-[34px] leading-none sm:text-[52px]">Présidentielle 2027 : <span className="surligne">qui va prendre l&apos;avantage&nbsp;?</span></h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-gris">Trois mesures publiées telles quelles : les intentions de vote dans les sondages, les paris sur Polymarket et le rang de chacun dans le bruit en ligne. Pas de note globale : ces mesures ne disent pas la même chose, et aucune ne dit qui gagnera l&apos;élection d&apos;avril 2027.</p>
      </section>
      <Podium candidats={b.candidats} />
      <Classement candidats={b.candidats} />
      <div className="grid gap-5 md:grid-cols-3">
        {mesures.map((m) => (
          <div key={m.titre} className="flex flex-col gap-2 rounded-[28px] p-6" style={{ backgroundColor: m.fond }}>
            <span className="pastille self-start text-white" style={{ backgroundColor: m.couleur }}>{m.titre.toUpperCase()}</span>
            <p className="mt-1 text-[15px] font-semibold leading-snug">{m.texte}</p>
            <p className="mt-auto text-[13px] text-gris">{m.note}</p>
          </div>
        ))}
      </div>
      <Candidats candidats={b.candidats} serie={b.serie} />
      <Methode b={b} />
      <div className="px-2"><CreditsPortraits /></div>
      <p className="px-2 text-[12.5px] text-gris">Sources : instituts de sondage (publications originales), statistiques de consultation Wikimedia, <a href="https://www.saper-vedere.eu/presidentielle/p/presidentielle-candidats/" className="underline">Saper Vedere</a> (engagement et citations), <a href="https://www.qui-sera-president.fr/" className="underline">qui-sera-president.fr</a> (abonnés), API YouTube, Polymarket. Étiquettes revendiquées par les personnalités. Le statut « déclaré » n&apos;est affiché qu&apos;avec une source datée.</p>
    </main>
  );
}

function Methode({ b }: { b: { sondage: { methode?: string; nb?: number; url: string } | null; polymarket_volume: number | null; candidats: Candidat[] } }) {
  const mesures = [
    ["Sondages", "#2f3cff", "La seule mesure qui interroge des électeurs, avec un échantillon représentatif et une marge d'erreur connue. On affiche la moyenne des sondages du premier tour publiés sur 30 jours, pour lisser les écarts entre instituts. Une personnalité que les instituts ne testent pas est marquée « non testé » : ce n'est pas zéro."],
    ["Paris Polymarket", "#14142b", "De l'argent réel engagé sur l'issue finale de l'élection : une probabilité de victoire selon les parieurs. Elle intègre ce que les sondages ne mesurent pas (candidatures incertaines, second tour), mais les parieurs ne sont pas l'électorat français."],
    ["Attention en ligne", "#ff6a3d", "Un rang, sans note : qui fait le plus parler de lui cette semaine. Il mesure le bruit et non le soutien, une polémique compte autant qu'une adhésion. Le détail par source (Wikipedia, réseaux, citations, abonnés, YouTube) est sur chaque fiche."],
  ];
  return (
    <section id="methode" className="carte flex scroll-mt-28 flex-col gap-5 p-6 sm:p-8">
      <div>
        <span className="pastille bg-encre text-jaune">MÉTHODE</span>
        <h2 className="d mt-3 text-[28px] leading-tight sm:text-[34px]">Pourquoi pas de note globale</h2>
        <p className="mt-2 text-[15.5px] leading-relaxed text-gris">Additionner une intention de vote, une probabilité de pari et un volume de bruit en ligne donnerait un chiffre qui ne correspond à rien de mesurable. Nous publions donc chaque mesure séparément, avec sa source, et le classement par défaut suit les sondages, la seule mesure qui interroge des électeurs.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {mesures.map(([t, c, j]) => (
          <div key={t} className="rounded-[20px] bg-fond p-5">
            <p className="text-[13px] font-extrabold tracking-[0.03em]" style={{ color: c }}>{t.toUpperCase()}</p>
            <p className="mt-2 text-[14.5px] leading-snug">{j}</p>
          </div>
        ))}
      </div>
      <p className="text-[13px] leading-relaxed text-gris">
        <b>Sondages</b> : moyenne des sondages du 1er tour publiés sur 30 jours, d&apos;après la <a href={b.sondage?.url ?? "https://fr.wikipedia.org/wiki/Liste_de_sondages_sur_l%27%C3%A9lection_pr%C3%A9sidentielle_fran%C3%A7aise_de_2027"} className="underline">liste Wikipedia</a> ; un écart de moins de 2 points n&apos;est pas significatif.{" "}
        <b>Paris</b> : probabilité implicite sur <a href="https://polymarket.com/fr/event/next-french-presidential-election" className="underline">Polymarket</a>{b.polymarket_volume ? ` (${Math.round(b.polymarket_volume / 1e6)} M$ engagés)` : ""} ; si la plateforme est injoignable, le dernier relevé de moins de 3 jours est repris.{" "}
        <b>Attention</b> : parts de chaque personnalité sur 7 jours, une personnalité non suivie par une source est classée sur les autres.{" "}
        <b>Notation</b> : n.t. = non testé ; n.m. = non mesuré ; écarts depuis le relevé précédent.
      </p>
    </section>
  );
}
