/* eslint-disable @next/next/no-img-element */
import { RUBRIQUES, dateLongue, type Sujet, type Edition as Ed } from "@/lib/editions";

const etiquette = "text-[13px] font-extrabold tracking-[0.06em]";
// classes statiques (Tailwind) selon le nombre d'éléments, pour que chaque ligne remplisse toute la largeur
const COLS: Record<number, string> = { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4", 5: "md:grid-cols-3 xl:grid-cols-5" };

// « Mardi 6 octobre : journée de mobilisation ; 16 octobre : premier bilan » -> étapes datées
function etapes(apres: string | null) {
  return (apres ?? "").split(/\s*;\s*|\.\s+(?=[A-ZÉÀ])/).map((x) => x.trim().replace(/\.$/, "")).filter(Boolean).slice(0, 5)
    .map((x) => { const m = x.match(/^([^:]{2,40}?)\s*:\s*(.+)$/); return m ? { quand: m[1], texte: m[2] } : { quand: null, texte: x }; });
}

// Un sujet seul, en mosaïque pleine largeur : chaque ligne s'adapte au contenu présent
export default function Bento({ e, s }: { e: Ed; s: Sujet }) {
  const R = RUBRIQUES[e.rubrique];
  const suite = etapes(s.apres);
  const tuiles = s.chiffres.length + (s.sources.length ? 1 : 0);
  return (
    <article className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-6 rounded-[24px] p-6 text-white sm:p-8" style={{ backgroundColor: R.couleur }}>
          <p className={etiquette}>{s.n} · {s.theme}</p>
          <h1 className="d text-[30px] leading-[1.02] sm:text-[44px]">{s.titre}</h1>
          <p className="text-[13.5px] font-semibold text-white/85">{dateLongue(e.date)}{s.sources.length ? ` · ${s.sources.length} sources` : ""} · {e.minutes} min de lecture</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden rounded-[24px] bg-white">
          {s.image && <img src={s.image} alt={s.legende ?? ""} className="absolute inset-0 h-full w-full object-cover" />}
          {s.legende && <span className="absolute bottom-3 left-3 max-w-[85%] rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">{s.legende}</span>}
        </div>
      </div>

      {tuiles > 0 && (
        <div className={`grid gap-4 sm:grid-cols-2 ${tuiles === 4 ? "lg:grid-cols-4" : tuiles === 3 ? "lg:grid-cols-3" : ""}`}>
          {s.chiffres.map((c) => (
            <div key={c.valeur + c.legende} className="flex flex-col justify-end rounded-[24px] p-6" style={{ backgroundColor: R.fond }}>
              <p className="d text-[44px] leading-none sm:text-[52px]" style={{ color: R.couleur }}>{c.valeur}</p>
              <p className="mt-2 text-[14px] font-semibold leading-snug">{c.legende}</p>
            </div>
          ))}
          {s.sources.length > 0 && (
            <div className="rounded-[24px] bg-white p-6">
              <p className={etiquette}>SOURCES</p>
              <ul className="mt-3 space-y-1.5 text-[14px] font-semibold">
                {s.sources.map((x) => <li key={x.url}><a href={x.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-bleu">{x.nom}</a></li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className={`grid gap-4 ${s.passe && (s.eclairage || s.explication) ? "lg:grid-cols-2" : ""}`}>
        {s.passe && (
          <div className="rounded-[24px] bg-white p-6 sm:p-8">
            <p className={etiquette} style={{ color: R.couleur }}>CE QUI S&apos;EST PASSÉ</p>
            <p className="mt-3 text-[16.5px] leading-[1.7]">{s.passe}</p>
          </div>
        )}
        {(s.eclairage || s.explication || s.points.length > 0) && (
          <div className="flex flex-col gap-4 rounded-[24px] bg-jaune-pale p-6 sm:p-8">
            <span className="pastille self-start bg-encre text-jaune">L&apos;ÉCLAIRAGE</span>
            {s.eclairage && <p className="d text-[26px] leading-tight">{s.eclairage}</p>}
            {s.explication && <p className="text-[16px] leading-[1.7]">{s.explication}</p>}
            {s.points.length > 0 && (
              <ol className="space-y-3">
                {s.points.map((p, k) => (
                  <li key={k} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-encre text-[12px] font-extrabold text-jaune">{k + 1}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            )}
            {s.chronologie && s.chronologie.length > 0 && (
              <ul className="mt-1 space-y-2 border-t border-encre/10 pt-4">
                {s.chronologie.map((c, k) => (
                  <li key={k} className="flex items-start gap-3 text-[14.5px] leading-snug">
                    <span className="shrink-0 rounded-full bg-encre px-2.5 py-1 text-[11px] font-extrabold text-white">{c.quand}</span>
                    <span className="pt-0.5">{c.texte}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {s.cartes.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className={`${etiquette} px-2`} style={{ color: R.couleur }}>LES POINTS DE VUE</p>
          <div className={`grid gap-4 ${COLS[Math.min(s.cartes.length, 5)]}`}>
            {s.cartes.map((c, k) => (
              <a key={k} href={c.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-3 rounded-[24px] p-6 transition hover:-translate-y-0.5" style={{ backgroundColor: c.fond }}>
                <div className="flex flex-wrap items-center gap-2"><span className="pastille text-white" style={{ backgroundColor: c.couleur }}>{c.parti}</span><span className="text-[13.5px] font-extrabold">{c.qui}</span></div>
                <p className="d text-[19px] leading-[1.25]">{c.texte}</p>
                <p className="mt-auto text-[12.5px] text-gris">{c.contexte ? `${c.contexte} · ` : ""}<span className="underline">{c.source}</span></p>
              </a>
            ))}
          </div>
        </section>
      )}

      {(s.change || suite.length > 0) && (
        <div className={`grid gap-4 ${s.change && suite.length ? "lg:grid-cols-2" : ""}`}>
          {s.change && (
            <div className="rounded-[24px] bg-encre p-6 text-white sm:p-8">
              <p className={`${etiquette} text-jaune`}>CE QUE ÇA CHANGE</p>
              <p className="d mt-3 text-[22px] leading-snug">{s.change}</p>
            </div>
          )}
          {suite.length > 0 && (
            <div className="rounded-[24px] bg-white p-6 sm:p-8">
              <p className={etiquette} style={{ color: R.couleur }}>ET APRÈS&nbsp;?</p>
              <ol className="relative mt-4 space-y-4 border-l-2 pl-6" style={{ borderColor: R.fond }}>
                {suite.map((x, k) => (
                  <li key={k} className="relative">
                    <span className="absolute -left-[35px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-extrabold text-white" style={{ backgroundColor: R.couleur }}>{k + 1}</span>
                    {x.quand && <p className="text-[13px] font-extrabold uppercase tracking-[0.04em]" style={{ color: R.couleur }}>{x.quand}</p>}
                    <p className="text-[16px] font-semibold leading-snug">{x.texte}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
