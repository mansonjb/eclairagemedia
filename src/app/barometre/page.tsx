import barometre from "../../../content/barometre.json";
import Candidats, { type Candidat } from "@/components/dyn/Candidats";
import Podium from "@/components/Podium";

export const metadata = {
  title: "Baromètre présidentielle 2027",
  description: "Sondages, attention en ligne et marchés de prédiction pour chaque personnalité de la présidentielle 2027, avec leurs dernières déclarations.",
};

const fmt = (d: string) => new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(d + "T12:00:00Z"));

export default function Barometre() {
  const b = barometre as unknown as { date: string | null; sondage: { institut: string; commanditaire: string; date: string; url: string; marge: string } | null; sources_attention: string[]; polymarket_volume: number | null; poids: Record<string, number>; candidats: Candidat[]; serie: { date: string; attention: Record<string, number>; polymarket: Record<string, number> }[] };
  const mesures = [
    { titre: "Les sondages", couleur: "#2f3cff", fond: "#e8eaff", texte: b.sondage
      ? `${b.sondage.institut} pour ${b.sondage.commanditaire}, publié le ${fmt(b.sondage.date)}. Marge d'erreur ${b.sondage.marge}.`
      : "Le dernier sondage d'intentions de vote au premier tour, vérifié sur la publication de l'institut. Ajouté par l'édition politique.",
      note: "Une photographie à une date donnée, pas une prédiction." },
    { titre: "L'attention en ligne", couleur: "#ff6a3d", fond: "#ffe4d9", texte: `Indice sur 100 qui combine ${b.sources_attention.length ? b.sources_attention.join(", ") : "Wikipedia, la presse et Bluesky"} sur 7 jours.`,
      note: "Mesure le bruit, pas le soutien : une polémique fait aussi monter l'indice." },
    { titre: "Les marchés de prédiction", couleur: "#14142b", fond: "#eef0f4", texte: `Probabilité implicite des paris Polymarket${b.polymarket_volume ? `, ${Math.round(b.polymarket_volume / 1e6)} millions de dollars engagés` : ""}.`,
      note: "Reflète l'avis des parieurs, pas celui des électeurs." },
  ];
  return (
    <main className="flex flex-col gap-5 pt-7">
      <section className="px-2">
        <p className="text-[15px] font-semibold text-gris">{b.date ? `Relevé du ${fmt(b.date)}` : "Baromètre"} · mis à jour chaque matin</p>
        <h1 className="d mt-1.5 text-[34px] leading-none sm:text-[52px]">Présidentielle 2027 : <span className="surligne">qui va prendre l&apos;avantage ?</span></h1>
        <p className="mt-4 max-w-3xl text-[16.5px] leading-relaxed text-gris">Le score Éclairage combine trois mesures : les sondages, les paris sur Polymarket et le bruit en ligne, chacune ramenée sur 100. C&apos;est un indicateur de dynamique, pas une prédiction : aucune mesure ne dit qui gagnera l&apos;élection d&apos;avril 2027.{!b.sondage && " Pas encore de sondage vérifié dans ce relevé : le score repose aujourd'hui sur Polymarket et l'attention en ligne."}</p>
      </section>
      <Podium candidats={b.candidats} poids={b.poids} />
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
      <p className="px-2 text-[12.5px] text-gris">Sources : instituts de sondage (publications originales), statistiques de consultation Wikimedia, GDELT, Bluesky, Polymarket. Étiquettes revendiquées par les personnalités. Le statut « déclaré » n&apos;est affiché qu&apos;avec une source datée.</p>
    </main>
  );
}
