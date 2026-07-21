import { NextRequest, NextResponse } from 'next/server'
import { EditorialRequestStatus } from '@prisma/client'
import { requireAdmin } from '@/lib/auth/admin'
import { prisma } from '@/lib/prisma'
import { cleanString, isRecord } from '@/lib/api-validation'

export async function PATCH(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error:'Accès refusé' }, { status:403 })
  try {
    const body: unknown = await req.json(); if (!isRecord(body) || typeof body.id !== 'string' || typeof body.statut !== 'string' || !Object.values(EditorialRequestStatus).includes(body.statut as EditorialRequestStatus)) return NextResponse.json({error:'Requête invalide'},{status:400})
    const response = cleanString(body.response, 5000); if (!response) return NextResponse.json({error:'Une réponse est requise'},{status:400})
    const request = await prisma.editorialRequest.update({ where:{id:body.id}, data:{statut:body.statut as EditorialRequestStatus,response} })
    await prisma.notification.create({ data:{userId:request.userId,titre:'Réponse du comité éditorial',message:`${request.contentTitle} : ${response}`,lien:'/dashboard'} })
    return NextResponse.json({success:true,request})
  } catch(error){console.error('PATCH editorial request',error);return NextResponse.json({error:'Mise à jour impossible'},{status:500})}
}
