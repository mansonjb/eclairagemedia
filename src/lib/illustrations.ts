import banque from "../../content/illustrations.json";
import type { RubriqueId } from "./editions";

type Illu = { url: string; legende: string };
const B = banque as Record<string, Illu>;

// Mosaïque de l'accueil : trois lieux neutres, une rubrique chacun
export const MOSAIQUE: { r: RubriqueId; image: string; alt: string }[] = [
  { r: "politique", image: B.hemicycle.url, alt: B.hemicycle.legende },
  { r: "local", image: B.lr_ville.url, alt: B.lr_ville.legende },
  { r: "tech", image: B.datacenter.url, alt: B.datacenter.legende },
];
