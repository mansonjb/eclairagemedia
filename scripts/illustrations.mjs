// Banque d'illustrations neutres (lieux, objets ; jamais de portrait), toutes vérifiées à l'œil.
// Sert quand une édition n'a pas de photo pour un sujet : choix selon la rubrique et le thème.
export const PAR_THEME = {
  politique: { "ARGENT PUBLIC": ["cour_comptes", "hemicycle"], INSTITUTIONS: ["hemicycle", "matignon", "elysee"], JUSTICE: ["justice"], POLITIQUE: ["hemicycle", "matignon"],
    "PRÉSIDENTIELLE": ["elysee", "vote"], "ÉLECTIONS": ["vote"], SOCIAL: ["matignon"], "SÉNAT": ["senat"], "ÉNERGIE": ["nucleaire", "eolien"], EUROPE: ["strasbourg_pe", "berlaymont"], MONDE: ["onu"], _: ["hemicycle", "senat", "matignon"] },
  economie: { CONJONCTURE: ["bourse", "defense"], ENTREPRISES: ["defense"], INDUSTRIE: ["usine"], "MARCHÉS": ["bourse", "eurostat"], MONDE: ["conteneurs", "onu"], TECH: ["datacenter", "puce"], "ÉNERGIE": ["nucleaire", "eolien"], _: ["defense", "bourse", "conteneurs"] },
  sante: { TRAITEMENT: ["pilules", "vaccin"], "ÉTUDE": ["microscope"], RECHERCHE: ["microscope"], CANCER: ["microscope", "hospital"], "SANTÉ PUBLIQUE": ["hopital", "vaccin"], MONDE: ["onu"], _: ["hospital", "hopital", "microscope"] },
  local: { CULTURE: ["lr_ville"], "DÉPARTEMENT": ["oleron", "pont_re"], ENVIRONNEMENT: ["marais"], LITTORAL: ["littoral", "lr_ville"], "MOBILITÉS": ["gare_lr", "velo", "tram"], PORT: ["pallice"], "VIE ÉTUDIANTE": ["vieux_port"], _: ["vieux_port", "lr_ville", "hotel_ville_lr"] },
  food: { AGRICULTURE: ["moisson"], BIO: ["legumes", "marche"], "FILIÈRE": ["marche"], FOODTECH: ["microscope"], "PROTÉINES": ["legumes"], "RÉGLEMENTATION": ["berlaymont", "moisson"], "ÉTUDE": ["legumes"], _: ["moisson", "legumes", "marche"] },
  tech: { "CYBERSÉCURITÉ": ["cyber", "serveurs"], IA: ["datacenter", "serveurs"], "MODÈLES": ["serveurs", "datacenter"], MONDE: ["serveurs"], "PUCES & INFRA": ["puce", "wafer"], RECHERCHE: ["puce"], "RÉGULATION": ["cyber", "smartphone"], _: ["datacenter", "smartphone", "serveurs"] },
};

// Hachage simple pour varier les images de façon stable
export const hache = (t) => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
