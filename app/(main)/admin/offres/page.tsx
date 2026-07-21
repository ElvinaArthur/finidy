import { redirect } from "next/navigation";
import { BriefcaseBusiness } from "lucide-react";
import { auth } from "@/lib/auth/config";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import OffersManager from "@/components/admin/OffersManager";
export default async function Page(){const session=await auth();if(!session?.user?.id||!await hasPermission(session.user.id,"MANAGE_OFFERS"))redirect("/dashboard");const items=await prisma.opportunity.findMany({orderBy:{updatedAt:"desc"}});return <main className="mx-auto max-w-7xl px-4 py-10"><div className="mb-8"><BriefcaseBusiness className="text-nihary-or"/><span className="eyebrow mt-3 inline-block">Administration · Consultance</span><h1 className="mt-1 text-4xl font-bold">Gestion des offres</h1><p className="mt-2 text-sm text-nihary-gris">Créez une opportunité, préparez-la en brouillon puis publiez-la lorsqu’elle est prête.</p></div><OffersManager initialItems={items.map(item=>({...item,payload:item.payload as Record<string,string>}))}/></main>}
