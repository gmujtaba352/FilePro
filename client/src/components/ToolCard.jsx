const ToolCard = ({ title, description, accent }) => {
  return (
    <article className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 text-slate-100 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-cyan-950/30">
      <div
        className="h-10 w-10 rounded-2xl"
        style={{ background: accent }}
        aria-hidden="true"
      />
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      <button
        type="button"
        className="mt-5 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-100"
      >
        Coming soon
      </button>
    </article>
  )
}

export default ToolCard
