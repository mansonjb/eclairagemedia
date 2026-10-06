// Livre EPUB du jour pour liseuse : toutes les éditions d'une date réunies, une rubrique par chapitre.
// Lit content/index.json, écrit public/epub/eclairage-AAAA-MM-JJ.epub et content/epub.json (liste pour le site).
// Sans dépendance : zip écrit à la main (mimetype non compressé en tête, comme l'exige la norme EPUB).
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";

const DEBUT = "2026-10-06"; // premier livre publié
const OUT = path.resolve("public/epub");
const COUV = path.join(OUT, "couverture.jpg");
const ORDRE = ["politique", "economie", "sante", "local", "food", "tech"];
const NOMS = { politique: "Politique", economie: "Économie", sante: "Santé", local: "La Rochelle", food: "Food & Bio", tech: "IA & Tech" };
const SITE = "https://www.eclairagemedia.com";
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const dateLongue = (d) => { const x = new Date(`${d}T12:00:00Z`); return `${JOURS[x.getUTCDay()]} ${x.getUTCDate()} ${MOIS[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };

// ---------- zip ----------
const TABLE = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (b) => { let c = 0xffffffff; for (const x of b) c = TABLE[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function zip(fichiers) {
  const locaux = [], centraux = []; let pos = 0;
  for (const [nom, contenu, stocke] of fichiers) {
    const data = Buffer.isBuffer(contenu) ? contenu : Buffer.from(contenu, "utf8");
    const comp = stocke ? data : zlib.deflateRawSync(data, { level: 9 });
    const n = Buffer.from(nom, "utf8"), crc = crc32(data), meth = stocke ? 0 : 8;
    const l = Buffer.alloc(30); l.writeUInt32LE(0x04034b50, 0); l.writeUInt16LE(20, 4); l.writeUInt16LE(0x0800, 6); l.writeUInt16LE(meth, 8);
    l.writeUInt16LE(0, 10); l.writeUInt16LE(0x21, 12); l.writeUInt32LE(crc, 14); l.writeUInt32LE(comp.length, 18); l.writeUInt32LE(data.length, 22); l.writeUInt16LE(n.length, 26);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(meth, 10);
    c.writeUInt16LE(0, 12); c.writeUInt16LE(0x21, 14); c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(n.length, 28); c.writeUInt32LE(pos, 42);
    locaux.push(l, n, comp); centraux.push(c, n); pos += 30 + n.length + comp.length;
  }
  const cd = Buffer.concat(centraux), fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0); fin.writeUInt16LE(fichiers.length, 8); fin.writeUInt16LE(fichiers.length, 10); fin.writeUInt32LE(cd.length, 12); fin.writeUInt32LE(pos, 16);
  return Buffer.concat([...locaux, cd, fin]);
}

// ---------- XHTML ----------
const x = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const page = (titre, corps) => `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="fr" lang="fr">
<head><meta charset="utf-8"/><title>${x(titre)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
${corps}
</body>
</html>`;
const CSS = `body{font-family:serif;line-height:1.5;margin:0 0.4em}
h1{font-size:1.6em;margin:0 0 0.2em;page-break-before:always}
h2{font-size:1.25em;margin:1.6em 0 0.3em;page-break-before:always;line-height:1.25}
h3{font-size:1em;margin:1.3em 0 0.3em;text-transform:uppercase;letter-spacing:0.05em}
p{margin:0 0 0.7em;text-align:justify}
.theme{font-size:0.8em;letter-spacing:0.08em;text-transform:uppercase;margin:0}
.meta{font-style:italic;font-size:0.9em}
.chiffre{margin:0 0 0.4em}
blockquote{margin:0.6em 0 0.9em 0.8em;padding-left:0.6em;border-left:3px solid #000}
blockquote p{margin:0 0 0.3em;text-align:left}
.qui{font-size:0.85em;font-style:normal}
ul,ol{margin:0 0 0.8em;padding-left:1.2em}
li{margin-bottom:0.35em}
.sources{font-size:0.8em}
.sources a{word-break:break-all}
dt{font-weight:bold;margin-top:0.5em}
dd{margin:0 0 0.4em 0}
.couv{text-align:center;margin:0;padding:0}
.couv img{max-width:100%;max-height:100%}`;

function chapitre(e) {
  const h = [`<h1 id="debut">${x(NOMS[e.rubrique])}</h1>`, `<p class="meta">${x(dateLongue(e.date))} · ${e.minutes ?? 5} min de lecture</p>`];
  for (const s of e.sujets) {
    h.push(`<h2 id="s${s.n}">${s.n}. ${x(s.titre)}</h2>`, `<p class="theme">${x(s.theme)}</p>`);
    if (s.chiffres?.length) h.push(s.chiffres.map((c) => `<p class="chiffre"><b>${x(c.valeur)}</b> : ${x(c.legende)}</p>`).join("\n"));
    if (s.passe) h.push(`<h3>Ce qui s'est passé</h3>`, `<p>${x(s.passe)}</p>`);
    if (s.points?.length) h.push(`<ul>${s.points.map((p) => `<li>${x(p)}</li>`).join("")}</ul>`);
    if (s.eclairage || s.explication) h.push(`<h3>L'éclairage</h3>`, s.eclairage ? `<p><b>${x(s.eclairage)}</b></p>` : "", s.explication ? `<p>${x(s.explication)}</p>` : "");
    if (s.chronologie?.length) h.push(`<ul>${s.chronologie.map((c) => `<li><b>${x(c.quand)}</b> : ${x(c.texte)}</li>`).join("")}</ul>`);
    if (s.cartes?.length) {
      h.push(`<h3>Ce qu'ils en disent</h3>`);
      for (const c of s.cartes) h.push(`<blockquote><p>${x(c.texte)}</p><p class="qui">${x(c.qui)}${c.parti ? ` (${x(c.parti.charAt(0) + c.parti.slice(1).toLowerCase())})` : ""}${c.contexte ? `, ${x(c.contexte)}` : ""}</p></blockquote>`);
    }
    if (s.change) h.push(`<h3>Ce qui change</h3>`, `<p>${x(s.change)}</p>`);
    if (s.apres) h.push(`<h3>Et après</h3>`, `<p>${x(s.apres)}</p>`);
    if (s.sources?.length) h.push(`<p class="sources">Sources : ${s.sources.map((o) => `<a href="${x(o.url)}">${x(o.nom || new URL(o.url).hostname)}</a>`).join(" · ")}</p>`);
  }
  if (e.agenda?.length) h.push(`<h2>À venir</h2>`, `<ul>${e.agenda.map((a) => `<li><b>${x(a.jour)} ${x(a.mois.toLowerCase())}</b> : ${x(a.texte)}</li>`).join("")}</ul>`);
  if (e.lexique?.length) h.push(`<h3>Les mots du jour</h3>`, `<dl>${e.lexique.map((l) => `<dt>${x(l.terme)}</dt><dd>${x(l.definition)}</dd>`).join("")}</dl>`);
  if (e.quiz) h.push(`<h3>Vrai ou faux ?</h3>`, `<p>${x(e.quiz.affirmation)}</p>`, `<p class="meta">Réponse : ${e.quiz.reponse ? "vrai" : "faux"}. ${x(e.quiz.explication)}</p>`);
  h.push(`<p class="meta">Retrouvez cette édition sur <a href="${SITE}/${e.rubrique}/${e.date}">eclairagemedia.com</a>.</p>`);
  return page(NOMS[e.rubrique], h.join("\n"));
}

function livre(date, eds) {
  const titre = `Éclairage · ${dateLongue(date)}`;
  const uid = `urn:uuid:${crypto.createHash("sha1").update(`eclairage-${date}`).digest("hex").replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*/, "$1-$2-$3-$4-$5")}`;
  const modif = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  const couv = fs.existsSync(COUV);
  const chap = eds.map((e) => ({ id: e.rubrique, fichier: `${e.rubrique}.xhtml`, nom: NOMS[e.rubrique], e }));
  const sommaire = `<h1>${x(titre)}</h1>\n<p class="meta">L'essentiel en 5 minutes, sans prérequis.</p>\n` + chap.map((c) =>
    `<h3><a href="${c.fichier}#debut">${x(c.nom)}</a></h3><ul>${c.e.sujets.map((s) => `<li><a href="${c.fichier}#s${s.n}">${x(s.titre)}</a></li>`).join("")}</ul>`).join("\n");
  const nav = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="fr" lang="fr"><head><meta charset="utf-8"/><title>Sommaire</title></head><body>
<nav epub:type="toc" id="toc"><h1>Sommaire</h1><ol>
<li><a href="sommaire.xhtml">Sommaire</a></li>
${chap.map((c) => `<li><a href="${c.fichier}#debut">${x(c.nom)}</a><ol>${c.e.sujets.map((s) => `<li><a href="${c.fichier}#s${s.n}">${x(s.titre)}</a></li>`).join("")}</ol></li>`).join("\n")}
</ol></nav></body></html>`;
  let ordre = 0;
  const ncx = `<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="${uid}"/></head>
<docTitle><text>${x(titre)}</text></docTitle><navMap>
<navPoint id="n0" playOrder="${++ordre}"><navLabel><text>Sommaire</text></navLabel><content src="sommaire.xhtml"/></navPoint>
${chap.map((c) => `<navPoint id="${c.id}" playOrder="${++ordre}"><navLabel><text>${x(c.nom)}</text></navLabel><content src="${c.fichier}#debut"/>${c.e.sujets.map((s) => `<navPoint id="${c.id}-${s.n}" playOrder="${++ordre}"><navLabel><text>${x(s.titre)}</text></navLabel><content src="${c.fichier}#s${s.n}"/></navPoint>`).join("")}</navPoint>`).join("\n")}
</navMap></ncx>`;
  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="fr">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">${uid}</dc:identifier><dc:title>${x(titre)}</dc:title><dc:language>fr</dc:language>
<dc:creator>Éclairage</dc:creator><dc:publisher>eclairagemedia.com</dc:publisher><dc:date>${date}</dc:date>
<dc:description>${x(chap.map((c) => c.nom).join(", "))}</dc:description>
<meta property="dcterms:modified">${modif}</meta>${couv ? `<meta name="cover" content="couv-img"/>` : ""}
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
<item id="css" href="style.css" media-type="text/css"/>
${couv ? `<item id="couv-img" href="couverture.jpg" media-type="image/jpeg" properties="cover-image"/>\n<item id="couv" href="couverture.xhtml" media-type="application/xhtml+xml"/>` : ""}
<item id="sommaire" href="sommaire.xhtml" media-type="application/xhtml+xml"/>
${chap.map((c) => `<item id="${c.id}" href="${c.fichier}" media-type="application/xhtml+xml"/>`).join("\n")}
</manifest>
<spine toc="ncx">
${couv ? `<itemref idref="couv" linear="yes"/>` : ""}<itemref idref="sommaire"/>
${chap.map((c) => `<itemref idref="${c.id}"/>`).join("\n")}
</spine>
</package>`;
  const f = [
    ["mimetype", "application/epub+zip", true],
    ["META-INF/container.xml", `<?xml version="1.0" encoding="utf-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`],
    ["OEBPS/content.opf", opf], ["OEBPS/nav.xhtml", nav], ["OEBPS/toc.ncx", ncx], ["OEBPS/style.css", CSS],
    ["OEBPS/sommaire.xhtml", page("Sommaire", sommaire)],
    ...chap.map((c) => [`OEBPS/${c.fichier}`, chapitre(c.e)]),
  ];
  if (couv) f.push(["OEBPS/couverture.jpg", fs.readFileSync(COUV), true], ["OEBPS/couverture.xhtml", page(titre, `<div class="couv"><img src="couverture.jpg" alt="${x(titre)}"/></div>`)]);
  return zip(f);
}

// Versions d'un seul fichier pour l'envoi par e-mail (HTML, accepté par Brevo et par Send to Kindle)
// et pour les anciennes Kindle qui ne lisent ni l'EPUB ni le HTML (texte brut, téléchargeable depuis leur navigateur).
function unFichier(date, eds) {
  const titre = `Éclairage · ${dateLongue(date)}`;
  const corps = eds.map((e) => chapitre(e).match(/<body>([\s\S]*)<\/body>/)[1]).join("\n");
  const html = `<!DOCTYPE html>\n<html lang="fr"><head><meta charset="utf-8"/><title>${x(titre)}</title><style>${CSS}</style></head><body>\n<h1>${x(titre)}</h1>\n${corps}\n</body></html>`;
  const txt = html.replace(/<style>[\s\S]*?<\/style>/, "").replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<h[12][^>]*>/g, "\n\n\n").replace(/<h3[^>]*>/g, "\n\n").replace(/<\/h\d>/g, "\n")
    .replace(/<li[^>]*>/g, "\n- ").replace(/<(p|dt|blockquote)[^>]*>/g, "\n").replace(/<dd[^>]*>/g, "\n  ")
    .replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ").replace(/\n[ ]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return { html, txt: "\ufeff" + txt + "\n" };
}

// ---------- génération : un livre par jour, refait seulement si la journée a changé ----------
const index = JSON.parse(fs.readFileSync(path.resolve("content/index.json"), "utf8"));
const fManif = path.resolve("content/epub.json");
const avant = fs.existsSync(fManif) ? JSON.parse(fs.readFileSync(fManif, "utf8")) : [];
fs.mkdirSync(OUT, { recursive: true });
const livres = [];
for (const date of [...new Set(index.map((e) => e.date))].filter((d) => d >= DEBUT).sort().reverse()) {
  const eds = ORDRE.map((r) => index.find((e) => e.date === date && e.rubrique === r)).filter(Boolean);
  const empreinte = crypto.createHash("sha1").update(JSON.stringify(eds)).digest("hex").slice(0, 12);
  const fichier = `eclairage-${date}.epub`;
  const ancien = avant.find((l) => l.date === date);
  if (!ancien || ancien.empreinte !== empreinte || !fs.existsSync(path.join(OUT, fichier)) || !fs.existsSync(path.join(OUT, fichier.replace(".epub", ".txt")))) {
    fs.writeFileSync(path.join(OUT, fichier), livre(date, eds));
    const u = unFichier(date, eds);
    fs.writeFileSync(path.join(OUT, fichier.replace(".epub", ".html")), u.html);
    fs.writeFileSync(path.join(OUT, fichier.replace(".epub", ".txt")), u.txt);
  }
  livres.push({ date, url: `/epub/${fichier}`, txt: `/epub/${fichier.replace(".epub", ".txt")}`, taille: fs.statSync(path.join(OUT, fichier)).size, rubriques: eds.map((e) => e.rubrique), sujets: eds.reduce((n, e) => n + e.sujets.length, 0), empreinte });
}
fs.writeFileSync(fManif, JSON.stringify(livres, null, 1));
console.log(`epub : ${livres.length} livre(s)`);
