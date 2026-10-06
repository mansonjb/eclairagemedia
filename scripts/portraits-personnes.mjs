// Petits portraits des personnalités politiques citées (« Qui dit quoi »), d'après Wikipédia et Wikimedia Commons.
// Garde-fous contre les homonymes : la page doit être celle d'un être humain (Wikidata P31 = Q5) ayant
// une fonction publique (P39) ou la profession d'homme ou femme politique (P106 = Q82955).
// Cache : content/portraits-personnes.json (null = pas de portrait fiable). Appelé par sync-editions.mjs.
import fs from "node:fs";
import path from "node:path";

const UA = { "User-Agent": "EclairageBot/1.0 (bonjour@eclairagemedia.com)" };
const F = path.resolve("content/portraits-personnes.json");
const api = async (hote, params) => (await fetch(`https://${hote}/w/api.php?format=json&${new URLSearchParams(params)}`, { headers: UA })).json();
const nettoie = (s) => (s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const paquets = (t, n = 50) => Array.from({ length: Math.ceil(t.length / n) }, (_, k) => t.slice(k * n, k * n + n));

export async function portraitsPersonnes(index) {
  const cache = fs.existsSync(F) ? JSON.parse(fs.readFileSync(F, "utf8")) : {};
  const noms = [...new Set(index.flatMap((e) => e.sujets.flatMap((s) => s.cartes.map((c) => c.qui))))]
    .filter((n) => !(n in cache) && /^[A-ZÀ-Ý][\p{L}'’.-]+( [\p{L}'’.-]+){0,3}$/u.test(n));
  try {
    for (const lot of paquets(noms)) {
      const r = await api("fr.wikipedia.org", { action: "query", titles: lot.join("|"), redirects: 1, prop: "pageimages|pageprops", piprop: "thumbnail|name", pithumbsize: 160, ppprop: "wikibase_item|disambiguation" });
      const vers = Object.fromEntries([...(r.query.normalized || []), ...(r.query.redirects || [])].map((x) => [x.from, x.to]));
      const pages = Object.fromEntries(Object.values(r.query.pages).map((p) => [p.title, p]));
      const trouve = {};
      for (const n of lot) {
        let t = n; while (vers[t]) t = vers[t];
        const p = pages[t];
        cache[n] = null;
        if (p && !p.missing && p.thumbnail && p.pageprops?.wikibase_item && !("disambiguation" in (p.pageprops || {}))) trouve[n] = p;
      }
      const ids = Object.values(trouve).map((p) => p.pageprops.wikibase_item);
      const ent = ids.length ? (await api("www.wikidata.org", { action: "wbgetentities", ids: ids.join("|"), props: "claims" })).entities : {};
      const vals = (e, p) => (e?.claims?.[p] || []).map((c) => c.mainsnak.datavalue?.value?.id);
      const fichiers = [];
      for (const [n, p] of Object.entries(trouve)) {
        const e = ent[p.pageprops.wikibase_item];
        if (!vals(e, "P31").includes("Q5") || !(vals(e, "P39").length || vals(e, "P106").includes("Q82955"))) continue;
        cache[n] = { src: p.thumbnail.source, fichier: p.pageimage, page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.pageimage)}` };
        fichiers.push(p.pageimage);
      }
      if (fichiers.length) {
        const ii = await api("commons.wikimedia.org", { action: "query", titles: fichiers.map((f) => `File:${f}`).join("|"), prop: "imageinfo", iiprop: "extmetadata" });
        const meta = Object.fromEntries(Object.values(ii.query.pages).filter((p) => p.imageinfo).map((p) => [p.title.replace(/^File:/, "").replace(/ /g, "_"), p.imageinfo[0].extmetadata]));
        for (const v of Object.values(cache)) if (v && !v.licence && meta[v.fichier]) {
          v.auteur = nettoie(meta[v.fichier].Artist?.value).slice(0, 80);
          v.licence = nettoie(meta[v.fichier].LicenseShortName?.value);
        }
        // Image hors Commons (copie locale de fr.wikipedia, souvent non libre) : on n'affiche rien
        for (const [n, v] of Object.entries(cache)) if (v && !v.licence && fichiers.includes(v.fichier)) cache[n] = null;
      }
    }
  } catch (e) {
    console.log(`portraits : réseau indisponible (${e.message}), cache conservé`);
  }
  fs.writeFileSync(F, JSON.stringify(cache, null, 1));
  console.log(`portraits : ${Object.values(cache).filter(Boolean).length} personnalités avec photo`);
}
