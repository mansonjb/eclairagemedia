import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Entete, Pied } from "@/components/ui";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", style: ["normal", "italic"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://eclairagemedia.com"),
  title: { default: "Éclairage · Comprendre avant de se faire une opinion", template: "%s · Éclairage" },
  description: "Des newsletters quotidiennes, neutres et pédagogiques : politique, économie, santé, La Rochelle, food & bio, IA & tech. Chaque fait confirmé par au moins trois sources.",
  openGraph: { siteName: "Éclairage", locale: "fr_FR", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased">
        <Entete />
        {children}
        <Pied />
      </body>
    </html>
  );
}
