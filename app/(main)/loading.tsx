export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Spinner centré */}
      <div className="flex flex-col items-center justify-center gap-4 mb-12">
        <div
          className="w-10 h-10 rounded-full border-4 border-nihary-sable-fonce border-t-nihary-or animate-spin"
        />
        <p className="text-sm font-body text-nihary-gris tracking-wide">Chargement…</p>
      </div>

      {/* Skeleton cards */}
      <div className="animate-pulse">
        <div className="mb-8">
          <div className="h-3 w-20 bg-nihary-sable-fonce rounded mb-3" />
          <div className="h-8 w-64 bg-nihary-sable-fonce rounded mb-2" />
          <div className="h-4 w-96 bg-nihary-sable rounded" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-nihary-sable-fonce overflow-hidden">
              <div className="aspect-[16/10] bg-nihary-sable" />
              <div className="p-5 space-y-2">
                <div className="h-5 w-16 bg-nihary-sable-fonce rounded-full" />
                <div className="h-4 w-full bg-nihary-sable rounded" />
                <div className="h-4 w-4/5 bg-nihary-sable rounded" />
                <div className="h-3 w-1/2 bg-nihary-sable rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
