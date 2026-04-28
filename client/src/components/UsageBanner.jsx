const UsageBanner = ({ remaining, limit, onUpgrade }) => {
  if (remaining > 0) {
    return (
      <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-200/70">Conversions Remaining</p>
            <p className="mt-1 text-2xl font-bold text-cyan-300">
              {remaining} <span className="text-base font-normal text-cyan-200/60">/ {limit}</span>
            </p>
          </div>
          <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-cyan-500/20">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
      </div>
    )
  }

  // Limit reached
  return (
    <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-6 py-4">
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div>
          <p className="text-sm font-medium text-amber-200">🔓 Upgrade to Pro</p>
          <p className="mt-1 text-base text-amber-100">You've reached your 5 free conversions</p>
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
