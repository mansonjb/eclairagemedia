"use client";
import { useEffect, useState } from "react";

// « Bonjour » ou « Bonsoir » selon l'heure du lecteur
export default function Salutation() {
  const [mot, setMot] = useState("Bonjour");
  useEffect(() => { const h = new Date().getHours(); setMot(h >= 18 || h < 5 ? "Bonsoir" : "Bonjour"); }, []);
  return <>{mot}</>;
}
