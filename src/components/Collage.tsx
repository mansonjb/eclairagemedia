/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { RUBRIQUES, type RubriqueId } from "@/lib/editions";

type P = { href: string; image: string; legende: string | null; rubrique: RubriqueId; theme: string };

// Collage de photos du jour, tuiles inclinées qui flottent doucement
const places = [
  "left-[2%] top-[4%] w-[46%] [--r:-6deg]",
  "right-[2%] top-[0%] w-[44%] [--r:5deg]",
  "left-[10%] bottom-[2%] w-[42%] [--r:4deg]",
  "right-[6%] bottom-[8%] w-[40%] [--r:-4deg]",
];
export default function Collage({ photos }: { photos: P[] }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      {photos.slice(0, 4).map((p, i) => (
        <Link key={p.href + i} href={p.href}
          className={`flotte group absolute overflow-hidden rounded-[22px] border-4 border-white bg-white ombre ${places[i]}`}
          style={{ animationDelay: `${i * -1.7}s` }}>
          <img src={p.image} alt={p.legende ?? ""} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />
          <span className="pastille verre absolute bottom-2 left-2 text-white" style={{ backgroundColor: RUBRIQUES[p.rubrique].couleur + "cc" }}>{p.theme}</span>
        </Link>
      ))}
      <span className="halo pointer-events-none absolute left-1/2 top-1/2 -z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  );
}
