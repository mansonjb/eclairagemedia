// Copie les éditions envoyées (dépôt privé mansonjb/eclairage, dossier editions/) dans content/editions
// et génère content/index.json : par édition, les sujets (thème, titre, photo, chapeau, chiffres)
// plus le chiffre du jour et le lexique.
// Usage : EDITIONS_DIR=../revue-politique/editions npm run sync
import fs from "node:fs";
import path from "node:path";
import { PAR_THEME, hache } from "./illustrations.mjs";

const SRC = process.env.EDITIONS_DIR || path.resolve("../revue-politique/editions");
const OUT = path.resolve("content/editions");
const PREFIX = { "": "politique", eco: "economie", sante: "sante", local: "local", food: "food", tech: "tech" };
const SKIP = new Set(["2026-09-28.html"]); // ancienne maquette « La Revue. »

const ent = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const strip = (s) => ent(s.replace(/<br\s*\/?>/g, " ").replace(/<\/?(?:b|strong|i|em|a|span|u)\b[^>]*>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").replace(/ ([,.)])/g, "$1").trim();
// Raccourcit en phrases entières, jamais de « … » : autant de phrases que la limite le permet, au moins la première
const coupe = (t, n) => {
  const p = t.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [t];
  let r = p[0];
  for (const x of p.slice(1)) { if ((r + x).length > n) break; r += x; }
  return r.trim();
};
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
      n, theme: strip(m[2]), titre: strip(m[3]), court: (bloc.match(/<!--\s*court\s*:\s*([^>]*?)\s*-->/) || [])[1] || null,
      image: img ? img[1] : null, legende: img && img[2] ? ent(img[2]) : null,
      chapeau: passe ? chapeau(strip(passe[1])) : null,
      eclairage: ecl ? strip(ecl[1]) : null,
      chiffres,
      passe: passe ? strip(passe[1]) : null,
      ...(() => {
        // L'encadré « L'ÉCLAIRAGE » : titre, paragraphe d'explication, points numérotés ou chronologie datée
        const i = bloc.indexOf("L'ÉCLAIRAGE");
        if (i < 0) return { points: [], explication: null, chronologie: [] };
        const fins = ["QUI DIT QUOI", "LES POINTS DE VUE", "CE QUE ÇA CHANGE"].map((m) => bloc.indexOf(m, i)).filter((x) => x > 0);
        const zone = bloc.slice(i, fins.length ? Math.min(...fins) : bloc.length);
        const paras = [...zone.matchAll(/<div style="font-size:1[45](?:\.5)?px;line-height[^"]*">([\s\S]*?)<\/div>/g)].map((x) => strip(x[1])).filter((t) => t.length > 40);
        return {
          points: [...zone.matchAll(/<td[^>]*>(\d)\.<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/g)].slice(0, 5).map((x) => strip(x[2])),
          explication: paras.join(" ") || null,
          chronologie: [...zone.matchAll(/<span[^>]*>([^<]{2,24})<\/span><\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/g)].slice(0, 6).map((x) => ({ quand: strip(x[1]), texte: strip(x[2]) })),
        };
      })(),
      sources: (() => {
        const r = bloc.match(/SOURCES ·([\s\S]*?)<\/div>/);
        return r ? [...r[1].matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((x) => ({ url: x[1], nom: strip(x[2]) })) : [];
      })(),
      cartes: [...bloc.matchAll(/<div style="background-color:(#[0-9a-f]{6});border-radius:18px;padding:14px 16px;[^"]*"><span style="background-color:(#[0-9a-f]{6});[^"]*">([^<]+)<\/span>\s*<span[^>]*>([^<]+)<\/span>\s*(?:<span[^>]*>([^<]*)<\/span>)?\s*<div[^>]*>([\s\S]*?)<\/div>\s*(?:<div[^>]*>[\s\S]*?<\/div>\s*)?<a href="([^"]+)"[^>]*>([^<]*)<\/a>/g)]
        .map((x) => ({ fond: x[1], couleur: x[2], parti: strip(x[3]), qui: strip(x[4]), contexte: x[5] ? strip(x[5]) : null, texte: strip(x[6]), url: x[7], source: strip(x[8]).replace(/^Source : |→$/g, "").trim() })),
      apres: (bloc.match(/ET APRÈS \?<\/b><br>\s*<span[^>]*>([\s\S]*?)<\/span>/) || [])[1] ? strip(bloc.match(/ET APRÈS \?<\/b><br>\s*<span[^>]*>([\s\S]*?)<\/span>/)[1]) : null,
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
// Largeur originale des photos Wikimedia Commons, en cache (content/images-verifiees.json) pour ne pas redemander chaque jour
const fCache = path.resolve("content/images-verifiees.json");
const cacheImg = fs.existsSync(fCache) ? JSON.parse(fs.readFileSync(fCache, "utf8")) : {};
async function assezGrande(url) {
  const m = decodeURIComponent(url).match(/wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/);
  if (!m) return true; // hors Commons (Unsplash…) : servi en grand format
  const nom = m[1];
  if (!(nom in cacheImg)) {
    try {
      const r = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=size&titles=File:${encodeURIComponent(nom)}`,
        { headers: { "User-Agent": "EclairageBot/1.0 (bonjour@eclairagemedia.com)" } });
      const p = Object.values((await r.json()).query.pages)[0];
      cacheImg[nom] = p.imageinfo ? p.imageinfo[0].width : 0;
    } catch { return true; } // réseau indisponible : on ne retire rien
  }
  return cacheImg[nom] >= 1000;
}
// Banque d'illustrations (content/illustrations.json) et crédits Commons associés, en cache dans images-verifiees.json
const illustrations = JSON.parse(fs.readFileSync(path.resolve("content/illustrations.json"), "utf8"));
async function creditCommons(url) {
  const m = decodeURIComponent(url).match(/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/);
  if (!m) return null;
  const k = `credit:${m[1]}`;
  if (!(k in cacheImg)) {
    try {
      const r = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=File:${encodeURIComponent(m[1])}`,
        { headers: { "User-Agent": "EclairageBot/1.0 (bonjour@eclairagemedia.com)" } });
      const x = Object.values((await r.json()).query.pages)[0].imageinfo?.[0]?.extmetadata;
      const net = (v) => (v || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      cacheImg[k] = x ? { auteur: net(x.Artist?.value).slice(0, 80), licence: net(x.LicenseShortName?.value), licence_url: x.LicenseUrl?.value || null,
        page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(m[1])}` } : null;
    } catch { return null; }
  }
  return cacheImg[k];
}
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
  const minutes = Math.max(2, Math.round(strip(html).split(" ").length / 220));
  const data = extraire(html);
  // Photos choisies et vérifiées pour le site (content/photos.json, clé « rubrique/date/n ») : priment sur celles de l'email
  // registre du site + registre tenu par les routines dans le dépôt des éditions (photos des nouvelles éditions)
  const lire = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {});
  const site = lire(path.resolve("content/photos.json")), depot = lire(path.join(path.dirname(SRC), "photos.json"));
  // Ordre de préférence : registre des routines, registre du site, photo de l'email ; la première assez grande l'emporte.
  // Contrôle de qualité : une photo Commons dont l'original fait moins de 1000 px de large est écartée.
  for (const s of data.sujets) {
    const k = `${rubrique}/${date}/${s.n}`;
    const choix = [depot[k], site[k], s.image && { url: s.image, legende: s.legende }].filter(Boolean);
    s.image = null; s.legende = null; delete s.credit;
    for (const p of choix) {
      if (!(await assezGrande(p.url))) continue;
      s.image = p.url; s.legende = p.legende ?? null;
      if (p.auteur) s.credit = { auteur: p.auteur, licence: p.licence, licence_url: p.licence_url, page: p.page };
      break;
    }
    // Filet de sécurité : jamais de sujet sans photo. Illustration neutre de la banque, selon la rubrique et le thème, créditée.
    if (!s.image) {
      const t = PAR_THEME[rubrique] || {}, cles = t[s.theme] || t._ || ["hemicycle"];
      const cle = cles[hache(s.titre || k) % cles.length], ill = illustrations[cle];
      if (ill) {
        s.image = ill.url; s.legende = `${ill.legende} (illustration)`;
      }
    }
    if (s.image && !s.credit) { const c = await creditCommons(s.image); if (c) s.credit = c; }
  }
  // Quiz « Vrai ou faux » inscrit par la routine dans l'édition : <!-- QUIZ {"affirmation","reponse","explication"} -->
  const qz = html.match(/<!-- QUIZ (\{[\s\S]*?\}) -->/);
  if (qz) { try { data.quiz = JSON.parse(qz[1]); } catch { /* quiz mal formé : ignoré */ } }
  index.push({ rubrique, date, minutes, ...data });
}
fs.writeFileSync(fCache, JSON.stringify(cacheImg, null, 1));
index.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.rubrique.localeCompare(b.rubrique)));
// Typographie française : la ponctuation haute et les guillemets ne passent jamais seuls à la ligne
const insecable = (k, v) => (typeof v === "string" && !/^(https?:|\/)/.test(v)
  ? v.replace(/ ([?!:;»%])/g, "\u00a0$1").replace(/« /g, "«\u00a0") : v);
fs.writeFileSync(path.resolve("content/index.json"), JSON.stringify(index, insecable, 1));
await (await import("./portraits-personnes.mjs")).portraitsPersonnes(index);
const stats = (k) => index.reduce((n, e) => n + e.sujets.filter((s) => s[k]).length, 0);
const total = index.reduce((n, e) => n + e.sujets.length, 0);
console.log(`${index.length} éditions, ${total} sujets : ${stats("image")} photos, ${stats("chapeau")} chapeaux, ${stats("eclairage")} éclairages ; ${index.filter((e) => e.chiffreDuJour).length} chiffres du jour, ${index.filter((e) => e.lexique.length).length} lexiques`);

// ---------- Baromètre présidentielle : scores du dernier relevé + dernières déclarations ----------
const DEPOT = path.dirname(SRC);
const fCand = path.join(DEPOT, "barometre_candidats.json");
const fHist = path.join(DEPOT, "barometre_historique.json");
if (fs.existsSync(fCand)) {
  const cands = JSON.parse(fs.readFileSync(fCand, "utf8")).candidats;
  const hist = fs.existsSync(fHist) ? JSON.parse(fs.readFileSync(fHist, "utf8")) : [];
  const dernier = hist[hist.length - 1] || {};
  const fFiches = path.join(DEPOT, "barometre_fiches.json");
  const fiches = fs.existsSync(fFiches) ? JSON.parse(fs.readFileSync(fFiches, "utf8")).fiches : {};
  // le dernier sondage connu, même s'il n'a pas été relevé le dernier jour
  const sondage = [...hist].reverse().find((h) => h.sondage)?.sondage || null;
  const val = (bloc, nom) => (bloc && bloc[nom] !== undefined ? (typeof bloc[nom] === "object" ? bloc[nom] : { v: bloc[nom], d: null }) : null);
  const candidats = cands.map((c) => {
    const nomFamille = c.nom.split(" ").slice(-1)[0];
    const declarations = index.flatMap((e) => e.sujets.flatMap((s) => s.cartes
      .filter((k) => k.qui.includes(c.nom) || (k.qui.includes(nomFamille) && k.qui.split(" ").length <= 3 && k.qui.includes(c.nom.split(" ")[0])))
      .map((k) => ({ ...k, date: e.date, rubrique: e.rubrique, sujet: s.titre, href: `/${e.rubrique}/${e.date}/${s.n}` }))));
    return {
      ...c,
      sondage: sondage ? val(sondage.scores, c.nom) : null,
      attention: val(dernier.attention, c.nom),
      polymarket: val(dernier.polymarket, c.nom),
      declarations: declarations.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6),
      nbDeclarations: declarations.length,
      reseaux: fiches[c.nom] || null,
    };
  });
  // Score Éclairage /100 : moyenne pondérée des mesures disponibles, chacune ramenée sur 100 (100 = le premier).
  // Sondages 50 %, marchés de prédiction 30 %, attention en ligne 20 %. Mesure absente pour tous : retirée du calcul.
  const POIDS = { sondage: 0.5, polymarket: 0.3, attention: 0.2 };
  const maxi = Object.fromEntries(Object.keys(POIDS).map((k) => [k, Math.max(0, ...candidats.map((c) => c[k]?.v ?? 0))]));
  const actives = Object.keys(POIDS).filter((k) => maxi[k] > 0);
  const somme = actives.reduce((n, k) => n + POIDS[k], 0) || 1;
  for (const c of candidats) {
    c.composantes = Object.fromEntries(actives.map((k) => [k, Math.round((100 * (c[k]?.v ?? 0)) / maxi[k])]));
    c.score = actives.length ? Math.round(actives.reduce((n, k) => n + POIDS[k] * c.composantes[k], 0) / somme) : null;
  }
  candidats.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  // Rang chez les parieurs et dans les sondages (comparaison de classements, pas de chiffres)
  for (const k of ["sondage", "polymarket"]) {
    const tri = candidats.filter((c) => c[k]?.v != null).sort((a, b) => b[k].v - a[k].v);
    tri.forEach((c, i) => { c.rangs = { ...(c.rangs || {}), [k]: i + 1 }; });
  }
  // séries limitées aux personnalités suivies (une personne retirée de la liste disparaît aussi des courbes)
  const suivis = new Set(cands.map((c) => c.nom));
  const garder = (bloc) => Object.fromEntries(Object.entries(bloc || {}).filter(([k]) => suivis.has(k)).map(([k, v]) => [k, typeof v === "object" ? v.v : v]));
  const serie = hist.slice(-60).map((h) => ({ date: h.date, attention: garder(h.attention), polymarket: garder(h.polymarket) }));
  fs.writeFileSync(path.resolve("content/barometre.json"), JSON.stringify({
    date: dernier.date || null, sondage: sondage && { ...sondage, scores: undefined }, sources_attention: dernier.sources_attention || [],
    polymarket_volume: dernier.polymarket_volume || null, poids: Object.fromEntries(actives.map((k) => [k, POIDS[k] / somme])), candidats, serie }, insecable, 1));
  console.log(`baromètre : ${candidats.length} personnalités, ${candidats.reduce((n, c) => n + c.nbDeclarations, 0)} déclarations, relevé du ${dernier.date || "—"}`);
}

// ---------- Podcast : MP3 générés par la routine (dépôt des éditions, dossier podcasts/) ----------
{
  const dossier = path.join(path.dirname(SRC), "podcasts");
  const pub = path.resolve("public/podcasts");
  const episodes = [];
  if (fs.existsSync(dossier)) {
    fs.mkdirSync(pub, { recursive: true });
    for (const f of fs.readdirSync(dossier).filter((x) => /^[a-z]+-\d{4}-\d{2}-\d{2}\.mp3$/.test(x)).sort().reverse()) {
      const [, rubrique, date] = f.match(/^([a-z]+)-(\d{4}-\d{2}-\d{2})\.mp3$/);
      const src = path.join(dossier, f);
      const taille = fs.statSync(src).size;
      if (!fs.existsSync(path.join(pub, f)) || fs.statSync(path.join(pub, f)).size !== taille) fs.copyFileSync(src, path.join(pub, f));
      const dlg = path.join(dossier, "dialogues", f.replace(".mp3", ".json"));
      const d = fs.existsSync(dlg) ? JSON.parse(fs.readFileSync(dlg, "utf8")) : {};
      const ed = index.find((e) => e.rubrique === rubrique && e.date === date);
      episodes.push({
        rubrique, date, url: `/podcasts/${f}`, taille,
        duree: d.duree || Math.round((taille * 8) / 64000), // durée notée par podcast.py, sinon MP3 à 64 kbit/s
        titre: d.titre || `Éclairage, ${date}`,
        titre_episode: d.titre_episode || null,
        description: d.description || null,
        // épisode long : sujets choisis dans plusieurs rubriques (liste « sujets » du dialogue)
        sujets: Array.isArray(d.sujets)
          ? d.sujets.map((x) => ({ rubrique: x.rubrique, n: x.n, titre: index.find((e) => e.rubrique === x.rubrique && e.date === date)?.sujets.find((t) => t.n === x.n)?.titre })).filter((x) => x.titre)
          : ed ? ed.sujets.map((s) => ({ rubrique, n: s.n, titre: s.titre })) : [],
        transcription: (d.repliques || []).map((r) => ({ qui: r.qui === "Lea" ? "Léa" : r.qui, texte: r.texte.replace(/\[[^\]]*\]\s*/g, "") })), // sans les balises de jeu [ton] d'ElevenLabs
      });
    }
  }
  episodes.sort((a, b) => b.date.localeCompare(a.date) || (a.rubrique === "essentiel" ? -1 : 1));
  fs.writeFileSync(path.resolve("content/podcasts.json"), JSON.stringify(episodes, insecable, 1));
  console.log(`podcast : ${episodes.length} épisode(s)`);
}
await import("./epub.mjs");
