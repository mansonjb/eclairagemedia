import barometre from "../../../content/barometre.json";
import Candidats, { type Candidat } from "@/components/dyn/Candidats";
import Podium from "@/components/Podium";

export const metadata = {
  title: "Baromètre présidentielle 2027",
  description: "Sondages, attention en ligne et marchés de prédiction pour chaque personnalité de la présidentielle 2027, avec leurs dernières déclarations.",
};

const fmt = (d: string) => new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(d + "T12:00:00Z"));

// Score recalculé avec d'autres poids, pour montrer si le podium dépend du choix de pondération
function podiumAvec(cands: Candidat[], p: Record<string, number>) {
  const cles = ["sondage", "polymarket", "attention"] as const;
  const maxi = Object.fromEntries(cles.map((k) => [k, Math.max(0, ...cands.map((c) => c[k]?.v ?? 0))]));
  const act = cles.filter((k) => maxi[k] > 0);
  const somme = act.reduce((n, k) => n + p[k], 0) || 1;
  return cands.map((c) => ({ nom: c.nom, s: act.reduce((n, k) => n + (p[k] * 100 * (c[k]?.v ?? 0)) / maxi[k], 0) / somme }))
    .sort((a, b) => b.s - a.s).slice(0, 3).map((x) => x.nom);
}

export default function Barometre() {
  const b = barometre as unknown as { date: string | null; sondage: { methode?: string; nb?: number; debut?: string; fin?: string; instituts?: string[]; institut?: string; commanditaire?: string; date?: string; url: string; marge?: string } | null; sources_attention: string[]; polymarket_volume: number | null; poids: Record<string, number>; candidats: Candidat[]; serie: { date: string; attention: Record<string, number>; polymarket: Record<string, number> }[] };
  const mesures = [
    { titre: "Les sondages", couleur: "#2f3cff", fond: "#e8eaff", texte: b.sondage
      ? b.sondage.methode === "moyenne"
        ? `Moyenne des ${b.sondage.nb} sondages publiés du ${fmt(b.sondage.debut!)} au ${fmt(b.sondage.fin!)} (${b.sondage.instituts!.join(", ")}).`
        : `${b.sondage.institut} pour ${b.sondage.commanditaire}, publié le ${fmt(b.sondage.date!)}. Marge d'erreur ${b.sondage.marge}.`
      : "Le dernier sondage d'intentions de vote au premier tour, vérifié sur la publication de l'institut. Ajouté par l'édition politique.",
      note: "Une photographie à une date donnée, pas une prédiction." },
    { titre: "L'attention en ligne", couleur: "#ff6a3d", fond: "#ffe4d9", texte: "Indice sur 100 qui combine, sur 7 jours, les consultations Wikipedia, l'engagement sur ses posts, ses citations par les journalistes et les médias, les abonnés gagnés sur les réseaux et les vues de ses vidéos YouTube.",
      note: "Mesure le bruit, pas le soutien : une polémique fait aussi monter l'indice." },
    { titre: "Les marchés de prédiction", couleur: "#14142b", fond: "#eef0f4", texte: `Probabilité implicite des paris Polymarket${b.polymarket_volume ? `, ${Math.round(b.polymarket_volume / 1e6)} millions de dollars engagés` : ""}.`,
      note: "Reflète l'avis des parieurs, pas celui des électeurs." },
  ];
  return (
    <main className="flex flex-col gap-5 pt-7">
      <section className="px-2">
        <p className="text-[15px] font-semibold text-gris">{b.date ? `Relevé du ${fmt(b.date)}` : "Baromètre"} · mis à jour chaque matin</p>
        <h1 className="d mt-1.5 text-[34px] leading-none sm:text-[52px]">Présidentielle 2027 : <span className="surligne">qui va prendre l&apos;avantage ?</span></h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-gris">Le score Éclairage combine trois mesures : les sondages, les paris sur Polymarket et le bruit en ligne, chacune ramenée sur 100. C&apos;est un indicateur de dynamique, pas une prédiction : aucune mesure ne dit qui gagnera l&apos;élection d&apos;avril 2027.{!b.sondage && " Pas encore de sondage vérifié dans ce relevé : le score repose aujourd'hui sur Polymarket et l'attention en ligne."}</p>
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
      <Methode b={b} />
      <p className="px-2 text-[12.5px] text-gris">Sources : instituts de sondage (publications originales), statistiques de consultation Wikimedia, <a href="https://www.saper-vedere.eu/presidentielle/p/presidentielle-candidats/" className="underline">Saper Vedere</a> (engagement et citations), <a href="https://www.qui-sera-president.fr/" className="underline">qui-sera-president.fr</a> (abonnés), API YouTube, Polymarket. Étiquettes revendiquées par les personnalités. Le statut « déclaré » n&apos;est affiché qu&apos;avec une source datée.</p>
    </main>
  );
}

function Methode({ b }: { b: { sondage: { methode?: string; nb?: number; url: string } | null; polymarket_volume: number | null; candidats: Candidat[] } }) {
  const ref = podiumAvec(b.candidats, { sondage: 0.5, polymarket: 0.3, attention: 0.2 }).join(", ");
  const variantes = [
    ["poids égaux (un tiers chacun)", { sondage: 1, polymarket: 1, attention: 1 }],
    ["sondages renforcés (60 / 30 / 10)", { sondage: 0.6, polymarket: 0.3, attention: 0.1 }],
    ["paris renforcés (40 / 40 / 20)", { sondage: 0.4, polymarket: 0.4, attention: 0.2 }],
  ] as const;
  const poids = [
    ["Sondages", "50 %", "#2f3cff", "La seule mesure qui interroge des électeurs, avec un échantillon représentatif et une marge d'erreur connue. On prend la moyenne des sondages du premier tour sur 30 jours, pour lisser les écarts entre instituts."],
    ["Paris Polymarket", "30 %", "#14142b", "De l'argent réel engagé sur l'issue finale : les paris intègrent ce que les sondages ne mesurent pas (candidatures incertaines, décisions de justice, second tour). Mais les parieurs ne sont pas l'électorat français, d'où un poids inférieur."],
    ["Attention en ligne", "20 %", "#ff6a3d", "Signale une dynamique (une personnalité dont on parle), mais mesure le bruit et non le soutien : une polémique la fait monter autant qu'une adhésion. Poids le plus faible."],
  ];
  const att = [["Engagement sur ses posts (Saper Vedere)", "30 %"], ["Citations par journalistes et médias (Saper Vedere)", "25 %"], ["Consultations Wikipedia", "20 %"], ["Abonnés gagnés (qui-sera-president.fr)", "15 %"], ["Vues YouTube", "10 %"]];
  return (
    <section id="methode" className="carte flex scroll-mt-28 flex-col gap-5 p-6 sm:p-8">
      <div>
        <span className="pastille bg-encre text-jaune">MÉTHODE</span>
        <h2 className="d mt-3 text-[28px] leading-tight sm:text-[34px]">Comment le score est calculé</h2>
        <p className="mt-2 text-[15.5px] leading-relaxed text-gris">Chaque mesure est ramenée sur 100 (100 = la personnalité en tête sur cette mesure), puis les trois sont combinées. Une personnalité non testée dans les sondages ou absente des paris compte 0 sur cette mesure. La pondération est un choix éditorial, pas une vérité scientifique : nous la publions et vérifions qu&apos;elle ne décide pas seule du classement.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {poids.map(([t, p, c, j]) => (
          <div key={t} className="rounded-[20px] bg-fond p-5">
            <p className="flex items-baseline justify-between gap-2"><span className="text-[13px] font-extrabold tracking-[0.03em]" style={{ color: c }}>{t.toUpperCase()}</span><span className="d text-[30px] leading-none">{p}</span></p>
            <p className="mt-2 text-[14.5px] leading-snug">{j}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="d text-[20px]">Le podium tient-il avec d&apos;autres poids ?</h3>
          <p className="mt-1 text-[14px] text-gris">Podium actuel : {ref}.</p>
          <ul className="mt-2 space-y-1.5 text-[14.5px]">
            {variantes.map(([l, p]) => { const v = podiumAvec(b.candidats, p).join(", "); return (
              <li key={l}><b>{l}</b> : {v === ref ? "même podium" : v}</li>); })}
          </ul>
        </div>
        <div>
          <h3 className="d text-[20px]">L&apos;attention en ligne, en détail</h3>
          <p className="mt-1 text-[14px] text-gris">Parts de chaque personnalité sur 7 jours, comparées aux 7 jours précédents, pondérées ainsi :</p>
          <ul className="mt-2 space-y-1 text-[14.5px]">{att.map(([t, p]) => <li key={t} className="flex justify-between gap-3 border-b border-filet py-1"><span>{t}</span><b>{p}</b></li>)}</ul>
          <p className="mt-2 text-[13px] text-gris">Une personnalité non suivie par une source est notée sur les autres (« indice partiel », marqué *). Sans chaîne YouTube, elle compte 0 vue.</p>
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-gris">
        <b>Sondages</b> : moyenne des sondages du 1er tour publiés sur 30 jours, d&apos;après la <a href={b.sondage?.url ?? "https://fr.wikipedia.org/wiki/Liste_de_sondages_sur_l%27%C3%A9lection_pr%C3%A9sidentielle_fran%C3%A7aise_de_2027"} className="underline">liste Wikipedia</a> ; un écart de moins de 2 points n&apos;est pas significatif.{" "}
        <b>Paris</b> : probabilité implicite sur <a href="https://polymarket.com/fr/event/next-french-presidential-election" className="underline">Polymarket</a>{b.polymarket_volume ? ` (${Math.round(b.polymarket_volume / 1e6)} M$ engagés)` : ""}, écart sur 7 jours ; si la plateforme est injoignable, le dernier relevé de moins de 3 jours est repris.{" "}
        <b>Notation</b> : n.t. = non testé ou non mesuré ; écarts depuis le relevé précédent.
      </p>
    </section>
  );
}
