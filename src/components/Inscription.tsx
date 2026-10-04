"use client";
import { useState } from "react";
import { ORDRE, RUBRIQUES } from "@/lib/rubriques-client";

// Formulaire d'abonnement (sur fond bleu) : choix des rubriques + email
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
  if (etat === "ok") return <p className="rounded-[22px] bg-white/15 p-5 text-[17px] font-bold">Merci ! Votre demande est bien reçue, la première édition arrive très bientôt.</p>;
  return (
    <form onSubmit={envoyer}>
      <div className="flex flex-wrap gap-2">
        {ORDRE.map((r) => {
          const actif = choix.includes(r);
          return (
            <button type="button" key={r} aria-pressed={actif} onClick={() => setChoix(actif ? choix.filter((c) => c !== r) : [...choix, r])}
              className={`rounded-full px-3.5 py-2 text-[13px] font-bold transition ${actif ? "bg-white text-encre" : "bg-white/15 text-white hover:bg-white/25"}`}>
              {actif ? "✓ " : ""}{RUBRIQUES[r].court}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-white p-1.5">
        <label className="sr-only" htmlFor="email">Adresse email</label>
        <input id="email" name="email" type="email" required placeholder="votre@email.fr" className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[15px] text-encre outline-none placeholder:text-gris-clair" />
        <button disabled={etat === "envoi" || !choix.length} className="shrink-0 rounded-full bg-jaune px-5 py-3 text-[14px] font-extrabold text-encre disabled:opacity-50">
          {etat === "envoi" ? "Envoi…" : "S'abonner"}
        </button>
      </div>
      {etat === "erreur" && <p className="mt-3 text-[13px] font-semibold text-jaune">L&apos;envoi n&apos;a pas abouti. Écrivez-nous à bonjour@eclairagemedia.com.</p>}
    </form>
  );
}
