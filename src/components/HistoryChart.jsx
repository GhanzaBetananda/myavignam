// Grafik tren 5 data terakhir — murni CSS/SVG, tanpa dependensi tambahan.
// points: [{ label, value, hint? }] urutan kronologis (terlama -> terbaru).

function shortDate(iso) {
  if (!iso || iso.length < 10) return iso || ''
  const [m, d] = iso.slice(0, 10).split('-').slice(1)
  return `${d}/${m}`
}

export default function FiveHistoryChart({ points, unit = '', lowerBetter = false, emptyText }) {
  const vals = (points || []).map((p) => p.value).filter((v) => Number.isFinite(v))

  if (!vals.length) {
    return (
      <p className="border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
        {emptyText || 'Belum ada data numerik untuk digrafikkan'}
      </p>
    )
  }

  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  const delta = vals[vals.length - 1] - vals[0]
  const flat = delta === 0
  const membaik = flat ? null : lowerBetter ? delta < 0 : delta > 0
  const fmt = (v) => `${Math.round(v * 10) / 10}${unit}`

  return (
    <div className="border border-slate-200 bg-white">
      {/* Ringkasan */}
      <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 text-center">
        <div className="px-2 py-3">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Terakhir</div>
          <div className="font-display mt-0.5 text-xl font-bold sm:text-2xl">
            {fmt(vals[vals.length - 1])}
          </div>
        </div>
        <div className="px-2 py-3">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Rata-rata</div>
          <div className="font-display mt-0.5 text-xl font-bold sm:text-2xl">{fmt(avg)}</div>
        </div>
        <div className="px-2 py-3">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tren</div>
          <div
            className={`font-display mt-0.5 text-xl font-bold sm:text-2xl ${
              membaik === null ? 'text-slate-500' : membaik ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {flat ? '●' : membaik ? '▲' : '▼'}{' '}
            <span className="text-sm">
              {delta > 0 ? '+' : ''}
              {Math.round(delta * 10) / 10}
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Bar + garis tren */}
      <div className="px-5 pb-2 pt-5 sm:px-6">
        <div className="relative">
          <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="absolute inset-x-2 top-0 h-28 w-[calc(100%-1rem)]">
            {vals.length > 1 && (
              <polyline
                points={vals
                  .map((v, i) => {
                    const x = vals.length === 1 ? 50 : (i / (vals.length - 1)) * 100
                    const span = max - min || 1
                    const y = 30 - ((v - min) / span) * 26
                    return `${x},${y}`
                  })
                  .join(' ')}
                fill="none"
                stroke="#ea580c"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="flex h-28 items-end gap-2 sm:gap-3">
            {points.map((p, i) => {
              const h = max > 0 ? Math.max(8, (p.value / max) * 100) : 0
              const isLast = i === points.length - 1
              return (
                <div key={`${p.label}-${i}`} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5" title={p.hint || `${p.label}: ${p.value}${unit}`}>
                  <span className={`text-xs font-bold ${isLast ? 'text-orange-600' : 'text-slate-500'}`}>
                    {p.value}
                    {unit}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${isLast ? 'bg-orange-600' : 'bg-slate-200'}`}
                    style={{ height: `${(h / 100) * 7}rem` }}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex gap-2 border-t border-slate-100 py-2.5 sm:gap-3">
          {points.map((p, i) => (
            <div
              key={`${p.label}-${i}`}
              className={`min-w-0 flex-1 text-center text-[11px] font-semibold ${i === points.length - 1 ? 'text-orange-600' : 'text-slate-400'}`}
            >
              {shortDate(p.label)}
            </div>
          ))}
        </div>
      </div>

      <p className="border-t border-slate-100 px-5 py-2.5 text-[11px] leading-relaxed text-slate-400 sm:px-6">
        {points.length} uji terakhir · terlama ke terbaru · nilai tertinggi {fmt(max)} · terendah {fmt(min)}
        {lowerBetter ? ' · semakin kecil semakin baik' : ''}
      </p>
    </div>
  )
}
