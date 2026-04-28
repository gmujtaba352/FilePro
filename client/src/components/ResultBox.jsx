const ResultBox = ({ filename, fileUrl, onDownload, onNewConversion }) => {
  return (
    <div className="animate-fp-fade-in space-y-4 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-white/3 to-white/2 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/20 text-2xl shadow-md">✅</div>
        <div>
          <h3 className="font-semibold text-emerald-200">Conversion Successful</h3>
          <p className="text-sm text-emerald-100/70">Your file is ready to download</p>
        </div>
      </div>

      <div className="rounded-lg border border-emerald-400/10 bg-white/3 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">File Name</p>
        <p className="mt-1 font-mono text-sm font-medium text-white break-all">{filename}</p>
      </div>

      <div className="flex gap-3 pt-2">
        <a
          href={fileUrl}
          download
          onClick={onDownload}
          className="flex-1 rounded-lg bg-emerald-500 px-4 py-3 text-center font-semibold text-white transition-transform shadow-emerald-400/30 hover:scale-105 active:scale-100"
        >
          ⬇️ Download File
        </a>
        <button
          type="button"
          onClick={onNewConversion}
          className="flex-1 rounded-lg border border-emerald-400/20 px-4 py-3 font-semibold text-emerald-200 transition hover:bg-emerald-400/6"
        >
          ➕ Convert Another
        </button>
      </div>
    </div>
  )
}

export default ResultBox
