import { useRef, useState } from 'react'

const UploadBox = ({ files, onFilesSelected }) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const openPicker = () => {
    inputRef.current?.click()
  }

  const pushFiles = (selectedFiles) => {
    const nextFiles = Array.from(selectedFiles || [])
    if (nextFiles.length > 0) {
      onFilesSelected(nextFiles)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 text-slate-100 shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Upload Files</h2>
          <p className="text-sm text-slate-400">Drag and drop files to prepare your workflow.</p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
          UI only
        </span>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragActive(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragActive(false)
          pushFiles(event.dataTransfer.files)
        }}
        className={`mt-5 rounded-3xl border-2 border-dashed p-8 text-center transition ${
          dragActive
            ? 'border-cyan-300 bg-cyan-400/10'
            : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
          ⬆
        </div>
        <p className="mt-4 text-lg font-semibold text-white">Drop your files here</p>
        <p className="mt-2 text-sm text-slate-400">PDF, DOCX, PNG, JPG and more</p>
        <button
          type="button"
          onClick={openPicker}
          className="mt-5 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={(event) => {
            pushFiles(event.target.files)
            event.target.value = ''
          }}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-5 space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Queued files</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm"
              >
                <span className="max-w-[75%] truncate text-slate-200">{file.name}</span>
                <span className="text-xs text-slate-500">{Math.ceil(file.size / 1024)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default UploadBox
