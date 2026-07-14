import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

/**
 * Stockage de fichiers en LOCAL (filesystem du serveur).
 *
 * ⚠️ Limite connue : sur Vercel (serverless), le filesystem est éphémère —
 * les fichiers écrits ici disparaissent après chaque redéploiement / cold start.
 * C'est volontaire pour la phase de démo locale (npm run dev).
 *
 * Migration future vers Vercel Blob : remplacer uniquement le corps de
 * `saveFile()` ci-dessous par un appel à `put()` du SDK @vercel/blob.
 * Le reste du code (appels à saveFile dans les API routes) ne change pas.
 */

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads')

const ALLOWED_FOLDERS = [
  'articles-pdf',
  'couvertures',
  'avatars',
  'entretiens-media',
  'manuscrits',
  'colloques',
] as const

export type UploadFolder = (typeof ALLOWED_FOLDERS)[number]

/**
 * Sauvegarde un fichier reçu via FormData dans public/uploads/{folder}/
 * Retourne le chemin public (ex: /uploads/couvertures/abc123.pdf)
 */
export async function saveFile(file: File, folder: UploadFolder): Promise<string> {
  if (!ALLOWED_FOLDERS.includes(folder)) {
    throw new Error(`Dossier non autorisé: ${folder}`)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = path.extname(file.name) || ''
  const filename = `${randomUUID()}${ext}`

  const dir = path.join(UPLOAD_ROOT, folder)
  await mkdir(dir, { recursive: true })

  const filepath = path.join(dir, filename)
  await writeFile(filepath, buffer)

  return `/uploads/${folder}/${filename}`
}

/** Taille max par type de fichier (en octets) */
export const MAX_FILE_SIZE = {
  pdf: 15 * 1024 * 1024,      // 15 Mo
  image: 5 * 1024 * 1024,     // 5 Mo
  audio: 50 * 1024 * 1024,    // 50 Mo
  video: 200 * 1024 * 1024,   // 200 Mo
}

export function validateFile(
  file: File,
  type: keyof typeof MAX_FILE_SIZE,
  allowedMimes: string[]
): string | null {
  if (file.size > MAX_FILE_SIZE[type]) {
    return `Fichier trop volumineux (max ${MAX_FILE_SIZE[type] / (1024 * 1024)} Mo)`
  }
  if (!allowedMimes.includes(file.type)) {
    return `Type de fichier non autorisé: ${file.type}`
  }
  return null
}
