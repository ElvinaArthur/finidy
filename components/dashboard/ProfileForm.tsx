"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Save, ShieldCheck, UserRound } from "lucide-react";

type Profile = { name:string|null; email:string; institution:string|null; discipline:string|null; bio:string|null; orcid:string|null; website:string|null; image:string|null; role:string; titreProfil:string|null; telephone:string|null; villeProfil:string|null; pays:string|null; linkedin:string|null; langues:string[]; expertises:string[]; emailVerified:Date|string|null };

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({ name:profile.name||"", institution:profile.institution||"", discipline:profile.discipline||"", bio:profile.bio||"", orcid:profile.orcid||"", website:profile.website||"", image:profile.image||"", titreProfil:profile.titreProfil||"", telephone:profile.telephone||"", villeProfil:profile.villeProfil||"", pays:profile.pays||"", linkedin:profile.linkedin||"", langues:profile.langues.join(", "), expertises:profile.expertises.join(", "), currentPassword:"", password:"" });
  const [loading,setLoading]=useState(false), [message,setMessage]=useState(""), [error,setError]=useState("");
  const required=[form.name,form.titreProfil,form.institution,form.discipline,form.bio,form.telephone,form.villeProfil,form.pays,form.langues,form.expertises];
  const completion=Math.round(required.filter(value=>value.trim()).length/required.length*100);

  async function submit(event:FormEvent){
    event.preventDefault(); setLoading(true); setError(""); setMessage("");
    const response=await fetch("/api/profil",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,langues:form.langues.split(",").map(value=>value.trim()).filter(Boolean),expertises:form.expertises.split(",").map(value=>value.trim()).filter(Boolean)})});
    const data=await response.json();
    if(response.ok){setMessage("Profil professionnel enregistré");setForm(value=>({...value,currentPassword:"",password:""}))} else setError(data.error||"Mise à jour impossible");
    setLoading(false);
  }

  const field=(key:keyof typeof form,label:string,type="text",required=false,placeholder="")=><label className="block text-sm font-medium text-nihary-brun">{label}{required&&" *"}<input className="input mt-1" type={type} required={required} value={form[key]} onChange={event=>setForm({...form,[key]:event.target.value})} placeholder={placeholder}/></label>;

  return <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[250px_1fr]">
    <aside className="space-y-4"><div className="card-sable p-5 text-center"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-nihary-or-pale bg-cover bg-center" style={form.image?{backgroundImage:`url(${form.image})`}:undefined}>{!form.image&&<UserRound size={38}/>}</div><p className="mt-3 font-semibold">{form.name||"Votre profil"}</p><p className="text-xs text-nihary-gris">{profile.role}</p>{profile.emailVerified&&<p className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-700"><ShieldCheck size={13}/>E-mail vérifié</p>}</div><div className="card p-5"><div className="flex justify-between text-sm"><span>Complétude</span><strong>{completion}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-nihary-sable"><div className="h-full bg-nihary-or" style={{width:`${completion}%`}}/></div><p className="mt-2 text-xs leading-5 text-nihary-gris">Les champs marqués * sont requis pour publier, enseigner ou rejoindre l’annuaire.</p></div></aside>
    <div className="space-y-6"><section className="card p-6"><span className="eyebrow">Identité professionnelle</span><div className="mt-4 grid gap-4 sm:grid-cols-2">{field("name","Nom complet","text",true)}{field("titreProfil","Fonction / titre","text",true,"Chercheur, consultante…")}{field("institution","Institution","text",true)}{field("discipline","Discipline principale","text",true)}{field("telephone","Téléphone","tel",true)}{field("villeProfil","Ville","text",true)}{field("pays","Pays","text",true)}{field("image","URL de l’avatar","url",false,"https://…")}</div><label className="mt-4 block text-sm font-medium text-nihary-brun">Biographie scientifique *<textarea className="input mt-1 min-h-36" required minLength={80} maxLength={3000} value={form.bio} onChange={event=>setForm({...form,bio:event.target.value})}/></label></section>
      <section className="card p-6"><span className="eyebrow">Expertise & visibilité</span><div className="mt-4 grid gap-4 sm:grid-cols-2">{field("langues","Langues","text",true,"Français, Malagasy, Anglais")}{field("expertises","Expertises","text",true,"Évaluation, terrain, gouvernance")}{field("orcid","ORCID","text",false,"0000-0000-0000-0000")}{field("website","Site professionnel","url",false,"https://…")}{field("linkedin","LinkedIn","url",false,"https://linkedin.com/in/…")}</div></section>
      <section className="card p-6"><span className="eyebrow">Sécurité</span><p className="mt-2 text-xs leading-5 text-nihary-gris">Confirmez votre mot de passe actuel avant d’en définir un nouveau.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{field("currentPassword","Mot de passe actuel","password",false,"Obligatoire en cas de changement")}{field("password","Nouveau mot de passe","password",false,"8 caractères minimum")}</div></section>
      {error&&<p className="text-sm text-red-700">{error}</p>}{message&&<p className="flex gap-2 text-sm text-emerald-700"><CheckCircle2 size={17}/>{message}</p>}<button className="btn-primary" disabled={loading}><Save size={16}/>{loading?"Enregistrement…":"Enregistrer le profil"}</button>
    </div>
  </form>;
}
