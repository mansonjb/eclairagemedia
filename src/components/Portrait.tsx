import portraits from "../../content/portraits.json";
import personnes from "../../content/portraits-personnes.json";

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

const PERS = personnes as Record<string, { src: string; auteur?: string; licence?: string } | null>;

// En-tête d'une prise de parole : petit portrait (si une photo libre et fiable existe), nom, étiquette du parti
export function Orateur({ qui, parti, couleur }: { qui: string; parti: string; couleur: string }) {
  const p = P[qui] ?? PERS[qui];
  if (!p) return <div className="flex flex-wrap items-center gap-2"><span className="pastille text-white" style={{ backgroundColor: couleur }}>{parti}</span><span className="text-[13.5px] font-extrabold">{qui}</span></div>;
  return (
    <div className="flex items-center gap-3">
      <img src={p.src} alt={qui} title={`Photo : ${p.auteur ?? ""}${p.licence ? `, ${p.licence}` : ""}, Wikimedia Commons`} loading="lazy"
        className="h-12 w-12 shrink-0 rounded-full bg-white object-cover object-top" style={{ boxShadow: `0 0 0 2.5px ${couleur}` }} />
      <div className="flex min-w-0 flex-col items-start gap-1">
        <span className="text-[14.5px] font-extrabold leading-tight">{qui}</span>
        <span className="pastille text-white" style={{ backgroundColor: couleur }}>{parti}</span>
      </div>
    </div>
  );
}
