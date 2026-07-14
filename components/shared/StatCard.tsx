interface StatCardProps {
  value: number | string
  label: string
  icon: string
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="card-sable p-5 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-display font-bold text-2xl text-nihary-ambre-fonce">{value}</div>
      <div className="text-xs font-mono tracking-wider uppercase text-nihary-gris mt-1">{label}</div>
    </div>
  )
}
