/* eslint-disable @next/next/no-img-element */
import { RUBRIQUES, dateLongue, type Sujet, type Edition as Ed } from "@/lib/editions";

const etiquette = "text-[13px] font-extrabold tracking-[0.06em]";

// Un sujet en mosaïque (maquette « page sujet »), affiché seul sur sa page
export default function Bento({ e, s }: { e: Ed; s: Sujet }) {
  const R = RUBRIQUES[e.rubrique];
  const etapes = (s.apres ?? "").split(/ ; |\. (?=[A-ZÉ])/).map((x) => x.trim().replace(/\.$/, "")).filter(Boolean).slice(0, 3);
  return (
    <section className="grid gap-4 lg:grid-cols-4">
      <div className="flex flex-col justify-between gap-6 rounded-[24px] p-6 text-white sm:p-8 lg:col-span-2" style={{ backgroundColor: R.couleur }}>
        <p className={etiquette}>{s.n} · {s.theme}</p>
        <h1 className="d text-[30px] leading-[1.02] sm:text-[44px]">{s.titre}</h1>
        <p className="text-[13.5px] font-semibold text-white/85">{dateLongue(e.date)}{s.sources.length ? ` · ${s.sources.length} sources` : ""} · {e.minutes} min de lecture</p>
      </div>
      <div className="relative min-h-[260px] overflow-hidden rounded-[24px] bg-white lg:col-span-2">
        {s.image && <img src={s.image} alt={s.legende ?? ""} className="absolute inset-0 h-full w-full object-cover" />}
        {s.legende && <span className="absolute bottom-3 left-3 max-w-[85%] rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">{s.legende}</span>}
      </div>

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

      {s.passe && (
        <div className="rounded-[24px] bg-white p-6 sm:p-8 lg:col-span-2">
          <p className={etiquette} style={{ color: R.couleur }}>CE QUI S&apos;EST PASSÉ</p>
          <p className="mt-3 text-[16.5px] leading-[1.7]">{s.passe}</p>
        </div>
      )}
      {(s.eclairage || s.points.length > 0) && (
        <div className="rounded-[24px] bg-jaune-pale p-6 sm:p-8 lg:col-span-2">
          <span className="pastille bg-encre text-jaune">L&apos;ÉCLAIRAGE</span>
          {s.eclairage && <p className="d mt-3 text-[26px] leading-tight">{s.eclairage}</p>}
          <ol className="mt-4 space-y-3">
            {s.points.map((p, k) => (
              <li key={k} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-encre text-[12px] font-extrabold text-jaune">{k + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {s.cartes.map((c, k) => (
        <a key={k} href={c.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-3 rounded-[24px] p-6 transition hover:-translate-y-0.5" style={{ backgroundColor: c.fond }}>
          <div className="flex flex-wrap items-center gap-2"><span className="pastille text-white" style={{ backgroundColor: c.couleur }}>{c.parti}</span><span className="text-[13.5px] font-extrabold">{c.qui}</span></div>
          <p className="d text-[19px] leading-[1.25]">{c.texte}</p>
          <p className="mt-auto text-[12.5px] text-gris">{c.contexte ? `${c.contexte} · ` : ""}<span className="underline">{c.source}</span></p>
        </a>
      ))}

      {s.change && (
        <div className="rounded-[24px] bg-encre p-6 text-white sm:p-8 lg:col-span-2">
          <p className={`${etiquette} text-jaune`}>CE QUE ÇA CHANGE</p>
          <p className="d mt-3 text-[22px] leading-snug">{s.change}</p>
        </div>
      )}
      {etapes.length > 0 && (
        <div className="rounded-[24px] bg-white p-6 sm:p-8 lg:col-span-2">
          <p className={etiquette} style={{ color: R.couleur }}>ET APRÈS ?</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {etapes.map((t, k) => (
              <div key={k} className="rounded-[16px] p-4" style={{ backgroundColor: R.fond }}>
                <span className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[13px] font-extrabold text-white" style={{ backgroundColor: R.couleur }}>{k + 1}</span>
                <p className="mt-2.5 text-[14px] font-semibold leading-snug">{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

