import { redirect } from "next/navigation";

// L'ancienne liste des épisodes est devenue la page Podcast
export default function Ecouter() {
  redirect("/podcast");
}
