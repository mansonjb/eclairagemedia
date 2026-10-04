import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Entete from "@/components/Entete";
import { Pied } from "@/components/ui";
import BarreMobile from "@/components/BarreMobile";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://eclairagemedia.com"),
  title: { default: "Éclairage · L'essentiel en 5 minutes, sans prérequis", template: "%s · Éclairage" },
  description: "Des newsletters quotidiennes, neutres et pédagogiques : politique, économie, santé, La Rochelle, food & bio, IA & tech. Chaque fait confirmé par au moins trois sources.",
  openGraph: { siteName: "Éclairage", locale: "fr_FR", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${figtree.variable} ${bricolage.variable}`}>
      <body className="font-sans antialiased pb-24 md:pb-0">
        <div className="mx-auto max-w-[1320px] px-4 pt-5 sm:px-5">
          <Entete />
          {children}
          <Pied />
        </div>
        <BarreMobile />
      </body>
    </html>
  );
}
