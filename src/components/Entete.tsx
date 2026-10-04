"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ORDRE, RUBRIQUES } from "@/lib/rubriques-client";

// En-tête : marque, rubriques en pastilles (pastille active en noir), baromètre, abonnement
export default function Entete() {
  const chemin = usePathname();
  const liens = [{ href: "/", nom: "À la une" }, ...ORDRE.map((r) => ({ href: `/${r}`, nom: RUBRIQUES[r].court })), { href: "/barometre", nom: "Baromètre 2027" }];
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <Link href="/" className="block" aria-label="Éclairage, accueil">
        <Image src="/logo-eclairage-transparent.png" alt="Éclairage" width={976} height={370} priority className="h-[52px] w-auto sm:h-[58px]" />
      </Link>
      <nav aria-label="Rubriques" className="order-3 -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:justify-center lg:px-0">
        {liens.map((l) => {
          const actif = l.href === "/" ? chemin === "/" : chemin?.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={`shrink-0 rounded-full px-[18px] py-3 text-[14px] font-bold transition ${actif ? "bg-encre text-white" : "bg-white hover:bg-lavande"}`}>
              {l.nom}
            </Link>
          );
        })}
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
