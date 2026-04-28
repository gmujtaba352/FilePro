const Loader = ({ message = "Processing your file..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-cyan-400/20 bg-slate-900/50 py-12">
      <div className="flex gap-2">
        <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '0s' }} />
        <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '0.2s' }} />
        <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-sm font-medium text-slate-300">{message}</p>
    </div>
  )
}

export default Loader
