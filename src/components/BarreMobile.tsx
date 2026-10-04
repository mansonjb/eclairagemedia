import Link from "next/link";
import { Ico } from "@/components/Icones";

// Barre de navigation flottante sur mobile
export default function BarreMobile() {
  const l = "flex flex-col items-center gap-1 rounded-full px-3 py-1 text-[10.5px] font-semibold text-white/80 hover:text-white";
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-sm items-center justify-around rounded-full bg-encre/95 px-2 py-2 shadow-2xl backdrop-blur-md md:hidden" style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
      <Link href="/" className={l}><Ico n="accueil" />Accueil</Link>
      <Link href="/#rubriques" className={l}><Ico n="rubriques" />Rubriques</Link>
      <Link href="/archives" className={l}><Ico n="archives" />Archives</Link>
      <Link href="/#inscription" className={`${l} !text-jaune`}><Ico n="mail" />S&apos;inscrire</Link>
    </nav>
  );
}
