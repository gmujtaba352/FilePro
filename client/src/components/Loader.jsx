const Loader = ({ message = 'Processing your file...' }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-transparent border-t-white/90" />
        <div className="text-sm text-slate-300">{message}</div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/6">
        <div className="relative h-full w-1/3 bg-cyan-400/60 fp-progress-bar" />
      </div>
    </div>
  )
}

export default Loader
