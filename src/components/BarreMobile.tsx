import Link from "next/link";

// Barre de navigation flottante sur mobile (inspiration application)
export default function BarreMobile() {
  const l = "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold text-white/85 hover:text-jaune";
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-sm items-center justify-around rounded-full bg-encre/95 px-2 py-2 shadow-2xl backdrop-blur-md md:hidden" style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
      <Link href="/" className={l}><span className="text-lg leading-none">⌂</span>Accueil</Link>
      <Link href="/#rubriques" className={l}><span className="text-lg leading-none">◎</span>Rubriques</Link>
      <Link href="/archives" className={l}><span className="text-lg leading-none">▤</span>Archives</Link>
      <Link href="/#inscription" className={`${l} text-jaune`}><span className="text-lg leading-none">✉</span>S&apos;inscrire</Link>
    </nav>
  );
}
