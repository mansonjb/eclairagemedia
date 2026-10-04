"use client";
import { useState } from "react";
import { ORDRE, RUBRIQUES } from "@/lib/rubriques-client";

export default function Inscription() {
  const [etat, setEtat] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");
  const [choix, setChoix] = useState<string[]>(["politique"]);
  async function envoyer(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const email = new FormData(ev.currentTarget).get("email");
    setEtat("envoi");
    try {
      const r = await fetch("/api/inscription", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, rubriques: choix }) });
      setEtat(r.ok ? "ok" : "erreur");
    } catch { setEtat("erreur"); }
  }
  if (etat === "ok") return <p className="font-serif text-xl text-encre">Merci ! Votre demande est bien reçue, vous recevrez la première édition très bientôt.</p>;
  return (
    <form onSubmit={envoyer}>
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gris">Vos rubriques</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ORDRE.map((r) => {
            const actif = choix.includes(r);
            return (
              <button type="button" key={r} aria-pressed={actif}
                onClick={() => setChoix(actif ? choix.filter((c) => c !== r) : [...choix, r])}
                className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
                style={actif ? { backgroundColor: RUBRIQUES[r].couleur, borderColor: RUBRIQUES[r].couleur, color: "#fff" } : { borderColor: RUBRIQUES[r].couleur, color: RUBRIQUES[r].couleur }}>
                {RUBRIQUES[r].court}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="email">Adresse email</label>
        <input id="email" name="email" type="email" required placeholder="votre@email.fr"
          className="min-w-0 flex-1 border-b border-encre bg-transparent px-1 py-3 text-base outline-none placeholder:text-gris focus:border-soleil" />
        <button disabled={etat === "envoi" || !choix.length} className="rounded-full bg-encre px-6 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-40">
          {etat === "envoi" ? "Envoi…" : "Recevoir Éclairage"}
        </button>
      </div>
      {etat === "erreur" && <p className="mt-3 text-sm text-[#b42318]">L&apos;envoi n&apos;a pas abouti. Écrivez-nous à bonjour@eclairagemedia.com.</p>}
      <p className="mt-3 text-xs text-gris">Gratuit. Votre adresse sert uniquement à l&apos;envoi des newsletters choisies.</p>
    </form>
  );
}
