"use client";
import { useState } from "react";

// Demande d'envoi automatique du livre du jour vers l'adresse e-mail d'une liseuse (Kindle, PocketBook)
export default function InscriptionLiseuse() {
  const [etat, setEtat] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");
  async function envoyer(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const email = new FormData(ev.currentTarget).get("email");
    setEtat("envoi");
    try {
      const r = await fetch("/api/inscription", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, liseuse: true }) });
      setEtat(r.ok ? "ok" : "erreur");
    } catch { setEtat("erreur"); }
  }
  if (etat === "ok") return <p className="rounded-[18px] bg-lavande p-4 text-[15px] font-bold">C&apos;est noté. Pensez à autoriser bonjour@eclairagemedia.com (étape 2) : le premier livre arrive le lendemain matin.</p>;
  return (
    <form onSubmit={envoyer} className="flex flex-col gap-2">
      <div className="flex items-center gap-2 rounded-full border border-filet bg-fond p-1.5">
        <label className="sr-only" htmlFor="liseuse">Adresse e-mail de la liseuse</label>
        <input id="liseuse" name="email" type="email" required placeholder="votre-nom@kindle.com" className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[15px] outline-none placeholder:text-gris-clair" />
        <button disabled={etat === "envoi"} className="shrink-0 rounded-full bg-encre px-5 py-3 text-[14px] font-extrabold text-white disabled:opacity-50">{etat === "envoi" ? "Envoi…" : "Recevoir"}</button>
      </div>
      {etat === "erreur" && <p className="text-[13px] font-semibold text-orange">L&apos;envoi n&apos;a pas abouti. Écrivez-nous à bonjour@eclairagemedia.com.</p>}
    </form>
  );
}
