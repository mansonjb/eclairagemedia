/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { RUBRIQUES, type RId } from "@/lib/rubriques-client";
import { Icone } from "@/components/Icones";

export type Item = { href: string; rubrique: RId; theme: string; titre: string; image: string | null; legende?: string | null; minutes?: number; date?: string; chapeau?: string | null };

// Fond : la photo, ou un visuel de rubrique (teinte, halo, pictogramme)
export function Fond({ it, className = "" }: { it: Item; className?: string }) {
  const R = RUBRIQUES[it.rubrique];
  if (it.image) return <img src={it.image} alt={it.legende ?? ""} loading="lazy" className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${className}`} />;
  return (
    <div className={`relative h-full w-full ${className}`} style={{ backgroundColor: R.fond }}>
      <span className="halo absolute -right-16 -top-16 h-72 w-72 rounded-full" />
      <span className="absolute right-6 top-6 transition duration-700 group-hover:rotate-6 group-hover:scale-110" style={{ color: R.couleur }}><Icone r={it.rubrique} className="h-24 w-24 opacity-20" /></span>
    </div>
  );
}

// Carte photo avec le titre posé sur l'image, en étiquettes blanches (inspiration magazine)
export function CarteImage({ it, taille = "m" }: { it: Item; taille?: "s" | "m" | "l" }) {
  const R = RUBRIQUES[it.rubrique];
  const h = taille === "l" ? "min-h-[420px] sm:min-h-[520px]" : taille === "m" ? "min-h-[300px]" : "min-h-[240px]";
  const t = taille === "l" ? "text-[22px] sm:text-[30px]" : taille === "m" ? "text-[17px]" : "text-[15px]";
  return (
    <Link href={it.href} className={`group relative flex overflow-hidden rounded-[24px] bg-encre ${h}`}>
      <div className="absolute inset-0"><Fond it={it} /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-encre/75 via-encre/10 to-transparent" />
      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
        <span className="pastille text-white" style={{ backgroundColor: R.couleur }}>{R.court}</span>
        {it.minutes && <span className="pastille bg-white/25 text-white backdrop-blur-md">{it.minutes} min</span>}
      </div>
      <div className="relative mt-auto p-4 sm:p-5">
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-jaune">{it.theme}</p>
        <h3 className={`font-extrabold leading-[1.45] ${t}`}>
          <span className="rounded-[8px] bg-white px-2 py-0.5 text-encre [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{it.titre}</span>
        </h3>
        {taille === "l" && it.chapeau && <p className="mt-4 line-clamp-2 max-w-2xl text-[15px] leading-relaxed text-white/90">{it.chapeau}</p>}
      </div>
    </Link>
  );
}

// Ligne compacte : vignette + titre + méta (liste « sélectionnés pour vous »)
export function LigneArticle({ it }: { it: Item }) {
  const R = RUBRIQUES[it.rubrique];
  return (
    <Link href={it.href} className="group flex items-center gap-4 py-3">
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[16px] sm:h-24 sm:w-32"><Fond it={it} /></div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.06em]" style={{ color: R.couleur }}>
          <Icone r={it.rubrique} className="h-3.5 w-3.5" />{R.court}
        </p>
        <p className="mt-1 line-clamp-2 text-[16px] font-bold leading-snug group-hover:underline decoration-jaune decoration-[3px] underline-offset-4">{it.titre}</p>
      </div>
      {it.minutes && <span className="hidden shrink-0 rounded-full border border-filet px-2.5 py-1 text-[12px] font-semibold text-gris sm:inline">{it.minutes} min</span>}
    </Link>
  );
}
