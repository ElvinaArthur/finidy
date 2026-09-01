import { SITE_URL } from '@/lib/site'
import { issueAccountToken } from '@/lib/auth/account-tokens'

async function send(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new Error('Configuration e-mail absente')
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html }) })
  if (!response.ok) throw new Error(`Envoi e-mail refusé (${response.status})`)
}

export async function sendVerificationEmail(email: string) {
  const token = await issueAccountToken('verify', email, 24 * 60)
  const url = `${SITE_URL}/api/auth/verifier?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
  await send(email, 'Vérifiez votre adresse e-mail FINIDY', `<p>Bienvenue sur FINIDY.</p><p><a href="${url}">Vérifier mon adresse e-mail</a></p><p>Ce lien expire dans 24 heures.</p>`)
}

export async function sendPasswordResetEmail(email: string) {
  const token = await issueAccountToken('reset', email, 60)
  const url = `${SITE_URL}/auth/reinitialiser?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
  await send(email, 'Réinitialisez votre mot de passe FINIDY', `<p><a href="${url}">Choisir un nouveau mot de passe</a></p><p>Ce lien expire dans une heure.</p>`)
}

export async function sendNewsletterConfirmation(email: string) {
  const token = await issueAccountToken('newsletter', email, 24 * 60)
  const url = `${SITE_URL}/api/newsletter/confirmer?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
  await send(email, 'Confirmez votre inscription à la lettre FINIDY', `<p>Merci de votre intérêt pour les recherches et activités de FINIDY.</p><p><a href="${url}">Confirmer mon inscription</a></p><p>Ce lien expire dans 24 heures. Sans confirmation, aucune lettre ne vous sera envoyée.</p>`)
}
