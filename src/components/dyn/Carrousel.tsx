"use client";
import { useRef, useState } from "react";
import { CarteImage, type Item } from "./CarteImage";

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
          {[["←", -1], ["→", 1]].map(([f, d]) => (
            <button key={f} aria-label={d === -1 ? "Précédent" : "Suivant"} onClick={() => aller(Math.min(items.length - 1, Math.max(0, actif + (d as number))))}
              className="h-10 w-10 rounded-full bg-white text-lg font-bold shadow-sm transition hover:bg-encre hover:text-white">{f}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
