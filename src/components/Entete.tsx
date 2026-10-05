"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ORDRE, RUBRIQUES } from "@/lib/rubriques-client";

// En-tête : marque, rubriques en pastilles (pastille active en noir), baromètre, abonnement.
// Les rubriques ont toujours leur propre ligne, centrée ; sur petit écran elle défile, sans jamais couper le logo ni les boutons.
export default function Entete() {
  const chemin = usePathname();
  const liens = [{ href: "/", nom: "À la une" }, ...ORDRE.map((r) => ({ href: `/${r}`, nom: RUBRIQUES[r].court })), { href: "/barometre", nom: "Baromètre 2027" }];
  return (
    <header className="sticky top-0 z-40 -mx-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-fond/90 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <Link href="/" className="block" aria-label="Éclairage, accueil">
        <Image src="/logo-eclairage-transparent.png" alt="Éclairage" width={976} height={370} priority className="h-[52px] w-auto sm:h-[58px]" />
      </Link>
      <nav aria-label="Rubriques" className="order-3 -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-5 sm:w-[calc(100%+2.5rem)] sm:px-5">
        <div className="mx-auto flex w-max gap-2">
        {liens.map((l) => {
          const actif = l.href === "/" ? chemin === "/" : chemin?.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={`shrink-0 rounded-full px-[18px] py-3 text-[14px] font-bold transition ${actif ? "bg-encre text-white" : "bg-white hover:bg-lavande"}`}>
              {l.nom}
            </Link>
          );
        })}
        </div>
      </nav>
      <div className="flex items-center gap-2.5">
        <Link href="/archives" className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white hover:bg-lavande" aria-label="Archives">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14142b" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        </Link>
        <Link href="#newsletter" className="rounded-full bg-jaune px-[18px] py-3 text-[14px] font-extrabold">S&apos;abonner</Link>
      </div>
    </header>
  );
}
