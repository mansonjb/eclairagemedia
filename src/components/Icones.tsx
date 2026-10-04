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
