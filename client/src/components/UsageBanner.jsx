const UsageBanner = ({ remaining, limit, onUpgrade }) => {
  const used = Math.max(0, (limit || 0) - (remaining || 0))
  const pct = limit ? Math.round((used / limit) * 100) : 0

  if (remaining > 0) {
    return (
      <div className="rounded-2xl border border-cyan-400/20 bg-white/3 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-slate-300">Conversions Remaining</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {remaining} <span className="text-base font-normal text-slate-300">/ {limit}</span>
            </p>
            <div className="mt-3 w-full">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/6">
                <div className="h-full bg-cyan-400" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-cyan-500/10">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
      </div>
    )
  }

  // Limit reached
  return (
    <div className="rounded-2xl border border-amber-400/30 bg-amber-400/8 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div>
          <p className="text-sm font-medium text-amber-200">🔓 Upgrade to Pro</p>
          <p className="mt-1 text-base text-amber-100">You've reached your free conversions</p>
        </div>
        <button
          type="button"
          onClick={onUpgrade}
          className="rounded-lg bg-amber-400 px-6 py-2 font-semibold text-slate-900 transition hover:bg-amber-300 active:scale-95 whitespace-nowrap"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  )
}

export default UsageBanner
