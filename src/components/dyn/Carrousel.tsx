"use client";
import { useRef, useState } from "react";
import { CarteImage, type Item } from "./CarteImage";
import { Ico } from "@/components/Icones";

// Carrousel « À la une » : défilement par glissement, points et flèches
export default function Carrousel({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [actif, setActif] = useState(0);
  const aller = (i: number) => {
    const el = ref.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };
  return (
    <div>
      <div ref={ref} onScroll={(e) => { const el = e.currentTarget; setActif(Math.round(el.scrollLeft / (el.scrollWidth / items.length))); }}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none]">
        {items.map((it) => (
          <div key={it.href + it.titre} className="w-[86%] shrink-0 snap-start sm:w-[62%] lg:w-[48%]"><CarteImage it={it} taille="l" /></div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button key={i} aria-label={`Sujet ${i + 1}`} onClick={() => aller(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === actif ? "w-7 bg-encre" : "w-2 bg-encre/20"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          {([["gauche", -1], ["droite", 1]] as const).map(([n, d]) => (
            <button key={n} aria-label={d === -1 ? "Précédent" : "Suivant"} onClick={() => aller(Math.min(items.length - 1, Math.max(0, actif + d)))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-filet bg-white transition hover:border-encre hover:bg-encre hover:text-white"><Ico n={n} className="h-4 w-4" /></button>
          ))}
        </div>
      </div>
    </div>
  );
}
