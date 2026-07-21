import Link from "next/link";
import { BookOpen, BriefcaseBusiness, FileText, GraduationCap, Mic, PenLine, Presentation, ShieldCheck } from "lucide-react";
import type { Permission } from "@/lib/auth/permissions";

const actions: Array<{permission:Permission;title:string;text:string;href:string;icon:typeof FileText}>=[
  {permission:"SUBMIT_REVUE",title:"Revue SAONTSY",text:"Soumettre un article scientifique à évaluation.",href:"/revue/soumettre",icon:FileText},
  {permission:"SUBMIT_MAGAZINE",title:"Magazine",text:"Proposer une analyse ou un récit accessible.",href:"/magazine/proposer",icon:PenLine},
  {permission:"SUBMIT_ENTRETIEN",title:"Entretien",text:"Déposer un entretien texte, audio ou vidéo.",href:"/entretiens/proposer",icon:Mic},
  {permission:"SUBMIT_LIVRE",title:"Éditions",text:"Transmettre un manuscrit au comité éditorial.",href:"/editions/soumettre",icon:BookOpen},
  {permission:"SUBMIT_COMMUNICATION",title:"Colloques",text:"Répondre à un appel à communications.",href:"/colloques/soumettre",icon:Presentation},
  {permission:"SUBMIT_COURS",title:"Université populaire",text:"Proposer un cours ou un premier module.",href:"/universite-populaire/enseigner",icon:GraduationCap},
  {permission:"MANAGE_EXPERT_PROFILE",title:"Profil expert",text:"Créer votre présence dans l’annuaire.",href:"/consultance/rejoindre",icon:ShieldCheck},
  {permission:"MANAGE_OFFERS",title:"Offres",text:"Créer ou mettre à jour les opportunités.",href:"/admin/offres",icon:BriefcaseBusiness},
];
export default function PublishingCenter({permissions}:{permissions:Permission[]}){const available=actions.filter(action=>permissions.includes(action.permission));return <section className="mb-9"><div className="mb-4"><span className="eyebrow">Mes autorisations</span><h2 className="mt-1 font-display text-2xl font-semibold">Centre de publication</h2><p className="mt-1 text-sm text-nihary-gris">Les actions affichées correspondent aux droits actifs de votre compte.</p></div>{available.length?<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{available.map(({icon:Icon,...action})=><Link key={action.permission} href={action.href} className="card group p-4 hover:border-nihary-or"><Icon className="text-nihary-or" size={20}/><h3 className="mt-3 font-display font-semibold group-hover:text-nihary-or">{action.title}</h3><p className="mt-1 text-xs leading-5 text-nihary-gris">{action.text}</p></Link>)}</div>:<div className="card-sable p-5 text-sm text-nihary-gris">Votre compte dispose actuellement d’un accès lecteur. Complétez votre profil et contactez l’équipe pour demander un droit de contribution.</div>}</section>}
