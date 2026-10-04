// Apparition en douceur au défilement, en CSS pur (animation liée au défilement).
// Sans prise en charge du navigateur, le contenu reste simplement visible.
export default function Apparition({ children, className = "" }: { children: React.ReactNode; delai?: number; className?: string }) {
  return <div className={`revele ${className}`}>{children}</div>;
}
