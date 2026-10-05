import Link from "next/link";
import { RUBRIQUES, type Edition } from "@/lib/editions";

// « Votre parcours du jour » : les trois premiers sujets, en étapes numérotées
export default function Parcours({ eds, date }: { eds: Edition[]; date: string }) {
  // Les trois sujets principaux du jour, nommés par le début de leur titre (avant les deux-points)
  const court = (t: string) => { const a = t.split(" : ")[0]; return a.length <= 34 ? a : a.split(" ").slice(0, 4).join(" ") + "…"; };
  const etapes = eds.slice(0, 3).map((e) => ({ href: `/${e.rubrique}/${date}`, nom: court(e.sujets[0]?.titre ?? ""), r: e.rubrique }));
  return (
    <ol aria-label="Votre parcours du jour" className="flex max-w-full gap-1.5 overflow-x-auto rounded-full bg-white p-1.5 [scrollbar-width:none]">
      {etapes.map((x, k) => (
        <li key={x.href} className="shrink-0">
          <Link href={x.href} className={`flex items-center gap-2 rounded-full py-2 pl-2 pr-3.5 text-[14px] font-bold ${k === 0 ? "text-white" : "hover:bg-fond"}`} style={k === 0 ? { backgroundColor: RUBRIQUES[x.r].couleur } : undefined}>
            <span className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-[13px] font-extrabold ${k === 0 ? "bg-white" : "bg-fond"}`} style={k === 0 ? { color: RUBRIQUES[x.r].couleur } : undefined}>{k + 1}</span>{x.nom}
          </Link>
        </li>
      ))}
    </ol>
  );
}
