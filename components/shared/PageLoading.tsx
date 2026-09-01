export default function PageLoading() {
  return (
    <div className="min-h-[70vh] bg-nihary-ecru" role="status" aria-live="polite" aria-label="Chargement de la page">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center justify-center py-5 text-center">
          <div className="relative mb-4 h-12 w-12">
            <span className="absolute inset-0 rounded-full border-2 border-nihary-or/25" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-nihary-or" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-nihary-ambre-fonce">F</span>
          </div>
          <p className="font-display text-lg font-semibold text-nihary-ambre-fonce">FINIDY Research Center</p>
          <p className="mt-1 text-xs text-nihary-gris">Chargement du contenu…</p>
        </div>
        <div className="animate-pulse space-y-8" aria-hidden="true">
          <div className="mx-auto h-8 w-3/5 rounded-full bg-nihary-sable-fonce/70" />
          <div className="mx-auto h-4 w-2/5 rounded-full bg-nihary-sable-fonce/50" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="rounded-2xl border border-nihary-sable-fonce bg-white p-5">
                <div className="mb-5 h-10 w-10 rounded-xl bg-nihary-sable" />
                <div className="mb-3 h-5 w-3/4 rounded bg-nihary-sable-fonce/70" />
                <div className="mb-2 h-3 w-full rounded bg-nihary-sable/80" />
                <div className="h-3 w-4/5 rounded bg-nihary-sable/80" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">Chargement en cours</span>
      </div>
    </div>
  )
}
