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
  const photos = { ...lire(path.resolve("content/photos.json")), ...lire(path.join(path.dirname(SRC), "photos.json")) };
  for (const s of data.sujets) {
    const p = photos[`${rubrique}/${date}/${s.n}`];
    if (p) { s.image = p.url; s.legende = p.legende; s.credit = { auteur: p.auteur, licence: p.licence, licence_url: p.licence_url, page: p.page }; }
  }
  // Pas de photo dans l'édition : illustration neutre de la banque, différente pour chaque sujet du jour
  const banque = JSON.parse(fs.readFileSync(path.resolve("content/illustrations.json"), "utf8"));
  const prises = new Set(data.sujets.map((s) => s.image));
  for (const s of data.sujets) {
    if (s.image) continue;
    const t = PAR_THEME[rubrique];
    const choix = [...(t[s.theme] || []), ...t._].filter((k) => banque[k] && !prises.has(banque[k].url));
    const k = choix.length ? choix[hache(s.titre) % Math.min(choix.length, (t[s.theme] || []).length || choix.length)] : t._[0];
    s.image = banque[k].url; s.legende = banque[k].legende + " (illustration)"; s.illustration = true;
    prises.add(s.image);
  }
  // Quiz « Vrai ou faux » inscrit par la routine dans l'édition : <!-- QUIZ {"affirmation","reponse","explication"} -->
  const qz = html.match(/<!-- QUIZ (\{[\s\S]*?\}) -->/);
  if (qz) { try { data.quiz = JSON.parse(qz[1]); } catch { /* quiz mal formé : ignoré */ } }
  index.push({ rubrique, date, minutes, ...data });
}
index.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.rubrique.localeCompare(b.rubrique)));
// Typographie française : la ponctuation haute et les guillemets ne passent jamais seuls à la ligne
const insecable = (k, v) => (typeof v === "string" && !/^(https?:|\/)/.test(v)
  ? v.replace(/ ([?!:;»%])/g, "\u00a0$1").replace(/« /g, "«\u00a0") : v);
fs.writeFileSync(path.resolve("content/index.json"), JSON.stringify(index, insecable, 1));
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
