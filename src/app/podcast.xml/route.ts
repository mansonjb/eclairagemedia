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
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Éclairage, la politique sans prérequis</title>
    <link>${SITE}/podcast</link>
    <atom:link href="${SITE}/podcast.xml" rel="self" type="application/rss+xml"/>
    <language>fr-fr</language>
    <description>Chaque matin, l'actualité politique française expliquée à deux voix, en quelques minutes et sans prérequis, à partir de faits vérifiés et sourcés. Voix de synthèse générées par intelligence artificielle ; transcription de chaque épisode sur eclairagemedia.com.</description>
    <itunes:author>Éclairage</itunes:author>
    <itunes:owner><itunes:name>Éclairage</itunes:name><itunes:email>bonjour@eclairagemedia.com</itunes:email></itunes:owner>
    <itunes:image href="${SITE}/podcast-cover.jpg"/>
    <image><url>${SITE}/podcast-cover.jpg</url><title>Éclairage, la politique sans prérequis</title><link>${SITE}/podcast</link></image>
    <itunes:type>episodic</itunes:type>
    <copyright>Éclairage ${new Date().getFullYear()}</copyright>
    <itunes:category text="News"><itunes:category text="Politics"/></itunes:category>
    <itunes:explicit>false</itunes:explicit>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
