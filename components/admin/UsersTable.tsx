'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

type UserRow = { id: string; name: string | null; email: string; role: string; suspended: boolean; institution: string | null; createdAt: string }
const ROLES = ['ADMIN', 'AUTEUR', 'LECTEUR', 'EXPERT', 'FORMATEUR']

export default function UsersTable({ initialUsers, currentUserId }: { initialUsers: UserRow[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers); const [query, setQuery] = useState(''); const [error, setError] = useState('')
  const filtered = useMemo(() => users.filter((user) => `${user.name} ${user.email} ${user.institution}`.toLowerCase().includes(query.toLowerCase())), [users, query])
  async function update(id: string, data: { role?: string; suspended?: boolean }) {
    setError(''); const response = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...data }) }); const result = await response.json()
    if (!response.ok) { setError(result.error || 'Erreur'); return }
    setUsers((current) => current.map((user) => user.id === id ? { ...user, ...result.user } : user))
  }
  return <div className="space-y-4">
    <div className="relative max-w-md"><Search className="absolute left-3 top-3 text-nihary-gris" size={17} /><input className="input pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un membre…" /></div>
    {error && <p className="text-sm text-red-700">{error}</p>}
    <div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left"><th className="p-3">Membre</th><th>Institution</th><th>Rôle</th><th>État</th><th>Inscription</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id} className="border-t"><td className="p-3"><p className="font-medium">{user.name || 'Sans nom'}</p><p className="text-xs text-nihary-gris">{user.email}</p></td><td>{user.institution || '—'}</td><td><select className="input !py-1 !w-auto" value={user.role} onChange={(e) => void update(user.id, { role: e.target.value })} disabled={user.id === currentUserId}>{ROLES.map((role) => <option key={role}>{role}</option>)}</select></td><td><button className={user.suspended ? 'text-green-700' : 'text-red-700'} disabled={user.id === currentUserId} onClick={() => void update(user.id, { suspended: !user.suspended })}>{user.suspended ? 'Réactiver' : 'Suspendre'}</button></td><td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td></tr>)}</tbody></table></div>
  </div>
}
