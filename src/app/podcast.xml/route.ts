import { episodes, SITE } from "@/lib/podcasts";

export const dynamic = "force-static";
const x = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Flux RSS du podcast (Apple Podcasts, Spotify, applications de podcast)
export function GET() {
  const items = episodes.filter((e) => e.rubrique === "politique").map((e) => `
    <item>
      <title>${x(e.titre)}</title>
      <link>${SITE}/ecouter/${e.date}</link>
      <guid isPermaLink="false">eclairage-${e.rubrique}-${e.date}</guid>
      <pubDate>${new Date(e.date + "T06:00:00+02:00").toUTCString()}</pubDate>
      <description>${x(e.sujets.map((s) => s.titre).join(" · "))}</description>
      <enclosure url="${SITE}${e.url}" length="${e.taille}" type="audio/mpeg"/>
      <itunes:duration>${e.duree}</itunes:duration>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Éclairage, la politique sans prérequis</title>
    <link>${SITE}/podcast</link>
    <language>fr-fr</language>
    <description>Chaque matin, l'actualité politique expliquée à deux voix, à partir de faits vérifiés et sourcés.</description>
    <itunes:author>Éclairage</itunes:author>
    <itunes:image href="${SITE}/logo-eclairage.png"/>
    <itunes:category text="News"><itunes:category text="Politics"/></itunes:category>
    <itunes:explicit>false</itunes:explicit>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
