import type { Locale } from "@/i18n/config";
import type { Localized } from "./types";

/** Citation signée, objectifs, valeurs, fondations et langues. Validés par Junior. */
const about: Localized<{
  quote: string;
  objectives: string[];
  values: { title: string; text: string }[];
  foundations: string[];
  languages: string[];
}> = {
  fr: {
    quote: "La passion ne nourrit pas tout le monde. Aujourd’hui, je construis mon avenir avec le code et l’e-commerce.",
    objectives: [
      "Gagner en liberté financière",
      "Construire des actifs sur le long terme",
      "Créer des solutions qui aident les autres",
      "Impacter positivement l’Afrique",
    ],
    values: [
      { title: "Autonome et rigoureux", text: "Je livre ce que j’annonce, et je préviens quand ça coince." },
      { title: "Esprit d’équipe", text: "Habitué à travailler avec des équipes produit et des marchands." },
      { title: "Toujours en apprentissage", text: "Autodidacte depuis le lycée, je continue chaque semaine." },
    ],
    foundations: ["Réseaux", "Maintenance informatique", "Debug méthodique"],
    languages: ["Français", "Fon", "Anglais (en progression)"],
  },
  en: {
    quote: "Passion doesn’t pay everyone’s bills. Today, I’m building my future with code and e\u2011commerce.",
    objectives: [
      "Reach financial freedom",
      "Build long-term assets",
      "Create solutions that help people",
      "Make a positive impact in Africa",
    ],
    values: [
      { title: "Independent and rigorous", text: "I deliver what I promise, and I flag problems early." },
      { title: "Team player", text: "Used to working with product teams and merchants." },
      { title: "Always learning", text: "Self-taught since high school, still learning every week." },
    ],
    foundations: ["Networking", "IT maintenance", "Methodical debugging"],
    languages: ["French", "Fon", "English (improving)"],
  },
};

export const getAbout = (lang: Locale) => about[lang];
