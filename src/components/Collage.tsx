/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type P = { href: string; image: string; alt: string; label: string; couleur: string };

// Mosaïque de l'accueil : trois photos neutres (lieux, objets), jamais de portrait
export default function Collage({ photos }: { photos: P[] }) {
  const [a, b, c] = photos;
  const tuile = (p: P, cls: string) => (
    <Link href={p.href} className={`group relative overflow-hidden rounded-[22px] bg-fond ombre ${cls}`}>
      <img src={p.image} alt={p.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      <span className="absolute inset-0 bg-gradient-to-t from-encre/50 via-transparent to-transparent" />
      <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11.5px] font-semibold text-encre">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.couleur }} />{p.label}
      </span>
    </Link>
  );
  return (
    <div className="grid h-[340px] grid-cols-2 grid-rows-2 gap-3 sm:h-[420px]">
      {a && tuile(a, "row-span-2")}
      {b && tuile(b, "")}
      {c && tuile(c, "")}
    </div>
  );
}
