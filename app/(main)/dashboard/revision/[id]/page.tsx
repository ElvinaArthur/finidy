import{notFound,redirect}from'next/navigation'
import{auth}from'@/lib/auth/config'
import{prisma}from'@/lib/prisma'
import RevisionForm from'@/components/dashboard/RevisionForm'
export default async function Page({params}:{params:Promise<{id:string}>}){const session=await auth();if(!session?.user?.id)redirect('/auth/connexion');const{id}=await params;const article=await prisma.articleRevue.findFirst({where:{id,auteurId:session.user.id,statut:'EN_REVISION'},select:{id:true,titre:true,resume:true,motsClés:true}});if(!article)notFound();return <div className="max-w-3xl mx-auto px-4 py-10"><span className="eyebrow">Révision autorisée</span><h1 className="text-3xl font-bold mb-2">Corriger l’article</h1><p className="text-sm text-nihary-gris mb-7">Cette fenêtre est ouverte par le comité. Les autres soumissions restent verrouillées.</p><RevisionForm article={article}/></div>}
