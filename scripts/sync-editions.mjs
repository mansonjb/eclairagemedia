// Copie les éditions envoyées (dépôt privé mansonjb/eclairage, dossier editions/) dans content/editions
// et génère content/index.json (rubrique, date, titres, « En 30 secondes »).
// Usage : EDITIONS_DIR=../revue-politique/editions node scripts/sync-editions.mjs
import fs from "node:fs";
import path from "node:path";

const SRC = process.env.EDITIONS_DIR || path.resolve("../revue-politique/editions");
const OUT = path.resolve("content/editions");
const PREFIX = { "": "politique", eco: "economie", sante: "sante", local: "local", food: "food", tech: "tech" };
// Éditions à ignorer (essais techniques, ancienne maquette « La Revue. »)
const SKIP = new Set(["2026-09-28.html"]);

const strip = (s) =>
  s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'")
   .replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

fs.rmSync(OUT, { recursive: true, force: true });
const index = [];
for (const file of fs.readdirSync(SRC).sort()) {
  if (!file.endsWith(".html") || SKIP.has(file) || file.startsWith("test")) continue;
  const m = file.match(/^(?:([a-z]+)-)?(\d{4}-\d{2}-\d{2})(-eclairage)?\.html$/);
  if (!m || !(m[1] ?? "") in PREFIX) continue;
  const rubrique = PREFIX[m[1] ?? ""];
  if (!rubrique) continue;
  const date = m[2];
  let html = fs.readFileSync(path.join(SRC, file), "utf8");
  html = html.replace(/src="assets\/logo-eclairage\.png"/g, 'src="/logo-eclairage.png"');
  const sujets = [...html.matchAll(/(\d) · ([A-ZÉÈÊÀÂÎÔÛÇ&;' \-]+)<\/div>\s*<div[^>]*>([\s\S]{3,400}?)<\/div>/g)]
    .map((x) => ({ n: Number(x[1]), theme: strip(x[2]), titre: strip(x[3]) }))
    .filter((s, i, a) => a.findIndex((t) => t.n === s.n) === i);
  fs.mkdirSync(path.join(OUT, rubrique), { recursive: true });
  fs.writeFileSync(path.join(OUT, rubrique, `${date}.html`), html);
  index.push({ rubrique, date, sujets });
}
index.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.rubrique.localeCompare(b.rubrique)));
fs.writeFileSync(path.resolve("content/index.json"), JSON.stringify(index, null, 1));
console.log(`${index.length} éditions synchronisées depuis ${SRC}`);
