import type { RubriqueId } from "@/lib/editions";

// Pictogrammes de rubrique, trait 1.8, couleur héritée
const tracés: Record<RubriqueId, React.ReactNode> = {
  politique: <><path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10" /><path d="M2.5 10 12 4l9.5 6z" /></>,
  economie: <><path d="M3 20h18" /><path d="M5 16l4.5-5 3.5 3.5L19 8" /><path d="M15 8h4v4" /></>,
  sante: <><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" /><path d="M9 12h6M12 9v6" /></>,
  local: <><circle cx="12" cy="5" r="2" /><path d="M12 7v13M8 11h8" /><path d="M4.5 14a7.5 7.5 0 0 0 15 0" /></>,
  food: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" /><path d="M5 19 13 11" /></>,
  tech: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M10 2v3m4-3v3m-4 14v3m4-3v3M2 10h3m-3 4h3m14-4h3m-3 4h3" /><path d="M10 10h4v4h-4z" /></>,
};

export function Icone({ r, className = "h-5 w-5" }: { r: RubriqueId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {tracés[r]}
    </svg>
  );
}

// Icônes d'interface, même trait que les pictogrammes de rubrique
const ui = {
  accueil: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
  rubriques: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  archives: <><rect x="3" y="4" width="18" height="5" rx="1.5" /><path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" /><path d="M10 13h4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
  partager: <><path d="M12 15V3" /><path d="m7 8 5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></>,
  lien: <><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></>,
  haut: <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>,
  gauche: <><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>,
  droite: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  horloge: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  ok: <path d="m5 12 5 5 9-10" />,
  calendrier: <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4m8-4v4" /></>,
} as const;
export type NomIcone = keyof typeof ui;
export function Ico({ n, className = "h-5 w-5" }: { n: NomIcone; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {ui[n]}
    </svg>
  );
}
