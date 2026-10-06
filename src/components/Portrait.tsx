import portraits from "../../content/portraits.json";

const P = portraits as Record<string, { src: string; auteur: string; licence: string; page: string }>;
const initiales = (n: string) => n.split(/[ -]/).filter((m) => m && m[0] === m[0].toUpperCase()).map((m) => m[0]).slice(0, 2).join("");

// Photo d'une personnalité (Wikimedia Commons), sinon ses initiales sur sa couleur
export default function Portrait({ nom, couleur, className = "", texte = "" }: { nom: string; couleur: string; className?: string; texte?: string }) {
  const p = P[nom];
  if (p) return <img src={p.src} alt={nom} title={`Photo : ${p.auteur}, ${p.licence}, Wikimedia Commons`} loading="lazy" className={`shrink-0 object-cover ${className}`} style={{ boxShadow: `0 0 0 3px ${couleur}` }} />;
  return <span className={`d flex shrink-0 items-center justify-center text-white ${className} ${texte}`} style={{ backgroundColor: couleur }}>{initiales(nom)}</span>;
}

export function CreditsPortraits() {
  return (
    <p className="text-[12.5px] leading-relaxed text-gris">
      Portraits : Wikimedia Commons.{" "}
      {Object.entries(P).map(([nom, p], k) => (
        <span key={nom}>{k > 0 && " · "}<a href={p.page} target="_blank" rel="noopener noreferrer" className="hover:underline">{nom}</a> ({p.auteur}, {p.licence})</span>
      ))}
    </p>
  );
}
