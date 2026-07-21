import {
  ScrollText,
  Handshake,
  PenLine,
  Mic,
  BookOpen,
  Landmark,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface SousLien {
  label: string;
  href: string;
}

export interface PilierMeta {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  description: string;
  sousLiens?: SousLien[];
}

export const PILIERS: PilierMeta[] = [
  {
    id: "revue",
    label: "SAONTSY",
    icon: ScrollText,
    href: "/revue",
    description: "Le Malgache dans tous ses états — contributions des chercheurs",
    sousLiens: [
      { label: "Articles scientifiques", href: "/revue" },
      { label: "Comité scientifique", href: "/revue/comite" },
      { label: "Communauté scientifique", href: "/revue/comite#communaute" },
      { label: "Politique éditoriale", href: "/politique-editoriale" },
      { label: "Soumettre un article", href: "/revue/soumettre" },
    ],
  },
  {
    id: "consultance",
    label: "Consultance",
    icon: Handshake,
    href: "/consultance",
    description: "Mise en relation avec des experts SHS",
    sousLiens: [
      { label: "Trouver un expert", href: "/consultance" },
      { label: "Offres de recherche", href: "/consultance/offres" },
      { label: "Demande de devis", href: "/consultance/devis" },
      { label: "Devenir expert", href: "/consultance/rejoindre" },
    ],
  },
  {
    id: "magazine",
    label: "Magazine",
    icon: PenLine,
    href: "/magazine",
    description: "Vulgarisation et actualité en SHS",
    sousLiens: [
      { label: "Tous les articles", href: "/magazine" },
      { label: "Proposer un article", href: "/magazine/proposer" },
    ],
  },
  {
    id: "entretiens",
    label: "Entretiens",
    icon: Mic,
    href: "/entretiens",
    description: "Podcasts, vidéos et textes avec des chercheurs",
    sousLiens: [
      { label: "Tous les entretiens", href: "/entretiens" },
      { label: "Podcasts", href: "/entretiens?format=PODCAST" },
      { label: "Vidéos", href: "/entretiens?format=VIDEO" },
      { label: "Proposer un entretien", href: "/entretiens/proposer" },
    ],
  },
  {
    id: "editions",
    label: "Édition",
    icon: BookOpen,
    href: "/editions",
    description: "Librairie et soumission de manuscrits",
    sousLiens: [
      { label: "Catalogue", href: "/editions" },
      { label: "Soumettre un manuscrit", href: "/editions/soumettre" },
    ],
  },
  {
    id: "colloques",
    label: "Colloques",
    icon: Landmark,
    href: "/colloques",
    description: "Colloques internationaux en SHS",
    sousLiens: [
      { label: "Prochains colloques", href: "/colloques" },
      { label: "Appel à communications", href: "/colloques/appel" },
      { label: "Actes & Proceedings", href: "/colloques/actes" },
      { label: "Soumettre une communication", href: "/colloques/soumettre" },
    ],
  },
  {
    id: "universite-populaire",
    label: "Univ. Populaire",
    icon: GraduationCap,
    href: "/universite-populaire",
    description: "Cours en ligne ouverts en SHS",
    sousLiens: [
      { label: "Tous les cours", href: "/universite-populaire" },
      { label: "Sessions live", href: "/universite-populaire/live" },
      { label: "Proposer un cours", href: "/universite-populaire/enseigner" },
    ],
  },
];
