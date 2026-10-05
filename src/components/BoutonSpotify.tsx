import { SPOTIFY } from "@/lib/podcasts";

// Lien vers l'émission sur Spotify (couleur et logo officiels de Spotify)
export default function BoutonSpotify({ className = "" }: { className?: string }) {
  return (
    <a href={SPOTIFY} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#1ed760] px-4 py-2.5 text-[14px] font-extrabold text-black hover:bg-[#1fdf64] ${className}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="12" fill="#000" /><path d="M6.5 9.3c3.6-1.1 8-.8 11.2 1.1M7.1 12.3c3-.9 6.6-.6 9.3 1M7.7 15.1c2.4-.7 5.1-.5 7.2.8" stroke="#1ed760" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>
      Écouter sur Spotify
    </a>
  );
}
