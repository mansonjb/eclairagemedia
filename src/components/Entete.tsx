"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MENU, RUBRIQUES } from "@/lib/rubriques-client";
import { Icone, Ico } from "@/components/Icones";

// En-tête : à partir de 1024 px, logo, rubriques et boutons sur une seule ligne ;
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
  const liens = [{ href: "/", nom: "À la une", couleur: "#14142b" }, ...MENU.map((r) => ({ href: `/${r}`, nom: RUBRIQUES[r].court, couleur: RUBRIQUES[r].couleur })), { href: "/barometre", nom: "Baromètre", couleur: "#ff6a3d" }];
  const rond = "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-white hover:bg-lavande";
  return (
    <header ref={boite} className="sticky top-0 z-40 -mx-4 bg-fond/90 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="block shrink-0" aria-label="Éclairage, accueil">
          <Image src="/logo-eclairage-transparent.png" alt="Éclairage" width={976} height={370} priority className="h-[46px] w-auto sm:h-[52px]" />
        </Link>
        <nav aria-label="Rubriques" className="hidden min-w-0 flex-1 justify-center gap-1.5 lg:flex">
          {liens.map((l) => (
            <Link key={l.href} href={l.href} className={`shrink-0 rounded-full px-3.5 py-2.5 text-[14px] font-bold transition ${actif(l.href) ? "bg-encre text-white" : "bg-white hover:bg-lavande"}`}>{l.nom}</Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/archives" className={rond} aria-label="Rechercher dans les archives">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14142b" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          </Link>
          <Link href="#newsletter" className="hidden rounded-full bg-jaune px-[18px] py-3 text-[14px] font-extrabold sm:block">S&apos;abonner</Link>
          <button type="button" onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert} aria-controls="menu-rubriques" aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"} className={`${rond} lg:hidden ${ouvert ? "!bg-encre" : ""}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ouvert ? "#ffffff" : "#14142b"} strokeWidth="2.2" strokeLinecap="round">
              {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {ouvert && (
        <div id="menu-rubriques" className="apparait absolute inset-x-4 top-full mt-1 max-h-[calc(100dvh-90px)] overflow-y-auto rounded-[28px] bg-encre p-3 text-white shadow-2xl sm:inset-x-5 lg:hidden">
          <Link href="/" className={`flex items-center gap-3 rounded-[20px] px-3 py-3 transition ${actif("/") ? "bg-white/10" : "hover:bg-white/5"}`}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-jaune text-encre"><Ico n="accueil" className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1"><span className="d block text-[20px] leading-tight">À la une</span><span className="block text-[13px] text-white/55">L&apos;essentiel du jour en 5 minutes</span></span>
            <Ico n="droite" className="h-5 w-5 text-white/40" />
          </Link>
          <p className="px-3 pb-1 pt-4 text-[11px] font-extrabold tracking-[0.12em] text-white/40">LES RUBRIQUES</p>
          <nav aria-label="Rubriques" className="grid sm:grid-cols-2">
            {MENU.map((r) => {
              const R = RUBRIQUES[r];
              const on = actif(`/${r}`);
              return (
                <Link key={r} href={`/${r}`} className={`flex items-center gap-3 rounded-[20px] px-3 py-3 transition ${on ? "bg-white/10" : "hover:bg-white/5"}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: R.couleur }}><Icone r={r} className="h-5 w-5 text-white" /></span>
                  <span className="min-w-0 flex-1"><span className="d block text-[20px] leading-tight">{R.court}</span><span className="block text-[13px] text-white/55">Chaque matin à {R.heure}</span></span>
                  {on ? <span className="h-2 w-2 rounded-full bg-jaune" aria-label="Rubrique en cours" /> : <Ico n="droite" className="h-5 w-5 text-white/40" />}
                </Link>
              );
            })}
          </nav>
          <Link href="/barometre" className={`mt-2 flex items-center gap-3 rounded-[20px] border border-white/10 px-3 py-3 transition ${actif("/barometre") ? "bg-white/10" : "hover:bg-white/5"}`}>
            <span className="d flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#ff6a3d] text-[13px]">2027</span>
            <span className="min-w-0 flex-1"><span className="d block text-[20px] leading-tight">Baromètre présidentielle</span><span className="block text-[13px] text-white/55">Qui prend l&apos;avantage&nbsp;? Mis à jour chaque matin</span></span>
            <Ico n="droite" className="h-5 w-5 text-white/40" />
          </Link>
          <div className="mt-3 flex flex-col gap-3 rounded-[22px] bg-jaune p-4 text-encre sm:flex-row sm:items-center">
            <p className="flex-1 text-[15px] font-bold leading-snug">Recevez Éclairage chaque matin, gratuitement, dans votre boîte mail.</p>
            <Link href="#newsletter" onClick={() => setOuvert(false)} className="rounded-full bg-encre px-5 py-3 text-center text-[14px] font-extrabold text-white">S&apos;abonner</Link>
          </div>
          <Link href="/archives" className="mt-1 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[14px] font-bold text-white/70 hover:text-white">
            <Ico n="archives" className="h-4 w-4" />Toutes les éditions passées
          </Link>
        </div>
      )}
    </header>
  );
}
