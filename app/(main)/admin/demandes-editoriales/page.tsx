import {redirect} from 'next/navigation'
import {auth} from '@/lib/auth/config'
import {prisma} from '@/lib/prisma'
import EditorialRequests from '@/components/admin/EditorialRequests'
export default async function Page(){const session=await auth();if((session?.user as {role?:string}|undefined)?.role!=='ADMIN')redirect('/dashboard');const rows=await prisma.editorialRequest.findMany({orderBy:{createdAt:'desc'},take:100,include:{user:{select:{name:true,email:true}}}});return <div className="max-w-5xl mx-auto px-4 py-10"><span className="eyebrow">Comité éditorial</span><h1 className="text-3xl font-bold mb-2">Demandes des auteurs</h1><p className="text-sm text-nihary-gris mb-7">Questions et demandes formelles de retrait. Une réponse génère une notification.</p><EditorialRequests initialRows={rows.map((row)=>({...row,createdAt:row.createdAt.toISOString(),updatedAt:undefined}))}/></div>}
