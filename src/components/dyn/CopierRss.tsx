"use client";
import { useState } from "react";

// Adresse du flux RSS, avec bouton copier (repli : sélection du texte si le presse-papier est refusé)
export default function CopierRss({ url }: { url: string }) {
  const [ok, setOk] = useState(false);
  const copier = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try { await navigator.clipboard.writeText(url); setOk(true); setTimeout(() => setOk(false), 2000); }
    catch { const champ = e.currentTarget.previousElementSibling as HTMLInputElement | null; champ?.select(); }
  };
  return (
    <div className="flex gap-2">
      <input readOnly value={url} onFocus={(e) => e.currentTarget.select()} aria-label="Adresse du flux RSS" className="min-w-0 flex-1 rounded-full bg-fond px-4 py-2.5 text-[13px] font-semibold" />
      <button type="button" onClick={copier} className="shrink-0 rounded-full bg-encre px-4 py-2.5 text-[13px] font-extrabold text-white">{ok ? "Copié" : "Copier"}</button>
    </div>
  );
}
