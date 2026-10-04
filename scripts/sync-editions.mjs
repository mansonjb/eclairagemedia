// Copie les éditions envoyées (dépôt privé mansonjb/eclairage, dossier editions/) dans content/editions
// et génère content/index.json : par édition, les sujets (thème, titre, photo, chapeau, chiffres)
// plus le chiffre du jour et le lexique.
// Usage : EDITIONS_DIR=../revue-politique/editions npm run sync
import fs from "node:fs";
import path from "node:path";

const SRC = process.env.EDITIONS_DIR || path.resolve("../revue-politique/editions");
const OUT = path.resolve("content/editions");
const PREFIX = { "": "politique", eco: "economie", sante: "sante", local: "local", food: "food", tech: "tech" };
const SKIP = new Set(["2026-09-28.html"]); // ancienne maquette « La Revue. »

const ent = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const strip = (s) => ent(s.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").replace(/ ([,.)])/g, "$1").trim();
const coupe = (t, n) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(" ", n)) + "…");
// Deux premières phrases d'un paragraphe
const chapeau = (t) => { const p = t.match(/[^.!?]+[.!?]+(\s|$)/g) || [t]; return coupe(p.slice(0, 2).join("").trim(), 320); };

function extraire(html) {
  const tetes = [...html.matchAll(/(\d) · ([A-ZÉÈÊÀÂÎÔÛÇ&;' \-]+)<\/div>\s*<div[^>]*>([\s\S]{3,400}?)<\/div>/g)];
  const vus = new Set();
  const sujets = [];
  tetes.forEach((m, i) => {
    const n = Number(m[1]);
    if (vus.has(n)) return;
    vus.add(n);
    const fin = tetes.slice(i + 1).find((x) => Number(x[1]) !== n)?.index ?? html.length;
    const bloc = html.slice(m.index, fin);
    // La photo d'un sujet est placée juste AVANT son étiquette « N · THÈME »
    const avant = html.slice(i ? tetes[i - 1].index : 0, m.index);
    const tags = [...avant.matchAll(/<img[^>]*src="https:\/\/upload\.wikimedia\.org[^>]*>/g)];
    const tag = tags.length ? tags[tags.length - 1][0] : null;
    const img = tag && [null, tag.match(/src="([^"]+)"/)[1], (tag.match(/alt="([^"]*)"/) || [])[1]];
    const passe = bloc.match(/Ce qui s'est passé\.<\/b>([\s\S]*?)<\/p>/);
    const ecl = bloc.match(/L'ÉCLAIRAGE<\/span>\s*<div[^>]*>([\s\S]*?)<\/div>/);
    const chiffres = [...bloc.matchAll(/font-size:24px;font-weight:900[^>]*>([^<]{1,12})<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>/g)]
      .slice(0, 3).map((c) => ({ valeur: strip(c[1]), legende: strip(c[2]) }));
    sujets.push({
      n, theme: strip(m[2]), titre: strip(m[3]),
      image: img ? img[1] : null, legende: img && img[2] ? ent(img[2]) : null,
      chapeau: passe ? chapeau(strip(passe[1])) : null,
      eclairage: ecl ? strip(ecl[1]) : null,
      chiffres,
      change: (bloc.match(/CE QUE ÇA CHANGE<\/b><br>\s*<span[^>]*>([\s\S]*?)<\/span>/) || [])[1] ? coupe(strip(bloc.match(/CE QUE ÇA CHANGE<\/b><br>\s*<span[^>]*>([\s\S]*?)<\/span>/)[1]), 260) : null,
    });
  });
  const cj = html.match(/CHIFFRE DU JOUR<\/div>\s*<div[^>]*>([^<]{1,16})<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>/);
  const lex = html.indexOf("LEXIQUE DU JOUR");
  const lexique = lex < 0 ? [] : [...html.slice(lex, lex + 6000).matchAll(/<b[^>]*>([^<]{2,60})<\/b><br>([\s\S]*?)<\/div>/g)]
    .slice(0, 6).map((x) => ({ terme: strip(x[1]), definition: strip(x[2]) }));
  const agenda = [...html.matchAll(/font-size:22px;font-weight:900;line-height:1;[^>]*>([^<]{1,3})<\/div>\s*<div[^>]*>([^<]{2,12})<\/div>\s*<\/div>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/g)]
    .slice(0, 6).map((x) => ({ jour: strip(x[1]), mois: strip(x[2]), texte: coupe(strip(x[3]), 160) }));
  return { sujets, agenda, chiffreDuJour: cj ? { valeur: strip(cj[1]), texte: strip(cj[2]) } : null, lexique };
}

fs.rmSync(OUT, { recursive: true, force: true });
const index = [];
for (const file of fs.readdirSync(SRC).sort()) {
  if (!file.endsWith(".html") || SKIP.has(file) || file.startsWith("test")) continue;
  const m = file.match(/^(?:([a-z]+)-)?(\d{4}-\d{2}-\d{2})(-eclairage)?\.html$/);
  const rubrique = m && PREFIX[m[1] ?? ""];
  if (!rubrique) continue;
  const date = m[2];
  let html = fs.readFileSync(path.join(SRC, file), "utf8");
  html = html.replace(/src="assets\/logo-eclairage\.png"/g, 'src="/logo-eclairage.png"');
  fs.mkdirSync(path.join(OUT, rubrique), { recursive: true });
  fs.writeFileSync(path.join(OUT, rubrique, `${date}.html`), html);
  index.push({ rubrique, date, ...extraire(html) });
}
index.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.rubrique.localeCompare(b.rubrique)));
fs.writeFileSync(path.resolve("content/index.json"), JSON.stringify(index, null, 1));
const stats = (k) => index.reduce((n, e) => n + e.sujets.filter((s) => s[k]).length, 0);
const total = index.reduce((n, e) => n + e.sujets.length, 0);
console.log(`${index.length} éditions, ${total} sujets : ${stats("image")} photos, ${stats("chapeau")} chapeaux, ${stats("eclairage")} éclairages ; ${index.filter((e) => e.chiffreDuJour).length} chiffres du jour, ${index.filter((e) => e.lexique.length).length} lexiques`);
