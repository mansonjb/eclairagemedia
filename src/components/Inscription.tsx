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
  if (etat === "ok") return <p className="rounded-[18px] bg-jaune-pale p-5 text-lg font-bold">Merci ! Votre demande est bien reçue, la première édition arrive très bientôt.</p>;
  return (
    <form onSubmit={envoyer}>
      <p className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-gris">Vos rubriques</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ORDRE.map((r) => {
          const actif = choix.includes(r);
          return (
            <button type="button" key={r} aria-pressed={actif}
              onClick={() => setChoix(actif ? choix.filter((c) => c !== r) : [...choix, r])}
              className="rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition"
              style={actif ? { backgroundColor: RUBRIQUES[r].couleur, borderColor: RUBRIQUES[r].couleur, color: "#fff" } : { borderColor: RUBRIQUES[r].couleur, color: RUBRIQUES[r].couleur }}>
              {actif ? "✓ " : ""}{RUBRIQUES[r].court}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="email">Adresse email</label>
        <input id="email" name="email" type="email" required placeholder="votre@email.fr"
          className="min-w-0 flex-1 rounded-full border border-filet bg-white px-5 py-3 text-[15px] outline-none focus:border-encre" />
        <button disabled={etat === "envoi" || !choix.length} className="rounded-full bg-encre px-6 py-3 text-sm font-extrabold text-jaune transition hover:bg-black disabled:opacity-40">
          {etat === "envoi" ? "Envoi…" : "Recevoir Éclairage"}
        </button>
      </div>
      {etat === "erreur" && <p className="mt-3 text-sm font-semibold text-[#d7263d]">L&apos;envoi n&apos;a pas abouti. Écrivez-nous à bonjour@eclairagemedia.com.</p>}
      <p className="mt-3 text-xs text-gris">Gratuit. Votre adresse sert uniquement à l&apos;envoi des newsletters choisies.</p>
    </form>
  );
}
