"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ORDRE, RUBRIQUES } from "@/lib/rubriques-client";

// En-tête : sur grand écran (≥ 1280 px) logo, rubriques et boutons sur une seule ligne ;
// en dessous, logo + recherche + abonnement + bouton menu qui ouvre un panneau avec toutes les rubriques.
export default function Entete() {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const boite = useRef<HTMLElement>(null);
  useEffect(() => setOuvert(false), [chemin]);
  useEffect(() => {
    if (!ouvert) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    const dehors = (e: PointerEvent) => { if (boite.current && !boite.current.contains(e.target as Node)) setOuvert(false); };
    window.addEventListener("keydown", esc);
    window.addEventListener("pointerdown", dehors);
    return () => { window.removeEventListener("keydown", esc); window.removeEventListener("pointerdown", dehors); };
  }, [ouvert]);
  const actif = (href: string) => (href === "/" ? chemin === "/" : !!chemin?.startsWith(href));
  const liens = [{ href: "/", nom: "À la une", couleur: "#14142b" }, ...ORDRE.map((r) => ({ href: `/${r}`, nom: RUBRIQUES[r].court, couleur: RUBRIQUES[r].couleur })), { href: "/barometre", nom: "Baromètre", couleur: "#ff6a3d" }];
  const rond = "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-white hover:bg-lavande";
  return (
    <header ref={boite} className="sticky top-0 z-40 -mx-4 bg-fond/90 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="block shrink-0" aria-label="Éclairage, accueil">
          <Image src="/logo-eclairage-transparent.png" alt="Éclairage" width={976} height={370} priority className="h-[46px] w-auto sm:h-[52px]" />
        </Link>
        <nav aria-label="Rubriques" className="hidden min-w-0 flex-1 justify-center gap-1.5 xl:flex">
          {liens.map((l) => (
            <Link key={l.href} href={l.href} className={`shrink-0 rounded-full px-3.5 py-2.5 text-[14px] font-bold transition ${actif(l.href) ? "bg-encre text-white" : "bg-white hover:bg-lavande"}`}>{l.nom}</Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/archives" className={rond} aria-label="Rechercher dans les archives">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14142b" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          </Link>
          <Link href="#newsletter" className="hidden rounded-full bg-jaune px-[18px] py-3 text-[14px] font-extrabold sm:block">S&apos;abonner</Link>
          <button type="button" onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert} aria-controls="menu-rubriques" aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"} className={`${rond} xl:hidden ${ouvert ? "!bg-encre" : ""}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ouvert ? "#ffffff" : "#14142b"} strokeWidth="2.2" strokeLinecap="round">
              {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {ouvert && (
          <div id="menu-rubriques" className="apparait absolute inset-x-4 top-full mt-1 rounded-[24px] bg-white p-4 shadow-xl sm:inset-x-5 xl:hidden">
            <nav aria-label="Rubriques" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {liens.map((l) => (
                <Link key={l.href} href={l.href} className={`flex items-center gap-2.5 rounded-[16px] px-4 py-3.5 text-[15px] font-bold transition ${actif(l.href) ? "bg-encre text-white" : "bg-fond hover:bg-lavande"}`}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: actif(l.href) ? "#ffffff" : l.couleur }} />{l.nom}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-filet pt-3">
              <Link href="/archives" className="flex-1 rounded-full bg-fond px-4 py-3 text-center text-[14px] font-bold hover:bg-lavande">Archives</Link>
              <Link href="#newsletter" onClick={() => setOuvert(false)} className="flex-1 rounded-full bg-jaune px-4 py-3 text-center text-[14px] font-extrabold">S&apos;abonner</Link>
            </div>
          </div>
      )}
    </header>
  );
}
