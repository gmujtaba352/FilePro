const ResultBox = ({ filename, fileUrl, onDownload, onNewConversion }) => {
  return (
    <div className="space-y-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
      <div className="flex items-center gap-3">
        <div className="text-2xl">✅</div>
        <div>
          <h3 className="font-semibold text-emerald-200">Conversion Successful</h3>
          <p className="text-sm text-emerald-100/60">Your file is ready to download</p>
        </div>
      </div>

      <div className="rounded-lg border border-emerald-400/20 bg-slate-900/50 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">File Name</p>
        <p className="mt-1 font-mono text-sm font-medium text-white break-all">{filename}</p>
      </div>

      <div className="flex gap-3 pt-2">
        <a
          href={fileUrl}
          download
          className="flex-1 rounded-lg bg-emerald-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
        >
          ⬇️ Download File
        </a>
        <button
          type="button"
          onClick={onNewConversion}
          className="flex-1 rounded-lg border border-emerald-400/30 px-4 py-3 font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
        >
          ➕ Convert Another
        </button>
      </div>
    </div>
  )
}

export default ResultBox
