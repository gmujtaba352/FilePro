import { useRef, useState } from 'react'
import { uploadFile, convertFile } from '../utils/api'

const UploadBox = ({ files, onFilesSelected, onUsageRefresh, onOpenUpgrade }) => {
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [convertingKey, setConvertingKey] = useState(null)
  const [fileProgress, setFileProgress] = useState({})
  const [showLimitMessage, setShowLimitMessage] = useState(false)
  const inputRef = useRef(null)

  const getFileKey = (file, fallback = 'file') => {
    return `${file?.name || fallback}-${file?.size || 'na'}-${file?.lastModified || 'na'}`
  }

  const setProgress = (file, status, message = '') => {
    const key = getFileKey(file)
    setFileProgress((current) => ({
      ...current,
      [key]: { status, message },
    }))
  }

  const ProgressPill = ({ progress }) => {
    if (!progress) return null

    if (progress.status === 'uploading' || progress.status === 'converting') {
      return (
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-200">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-200 border-t-transparent" />
          {progress.message}
        </span>
      )
    }

    if (progress.status === 'error') {
      return (
        <span className="inline-flex items-center rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-1 text-[11px] font-medium text-rose-200">
          Failed
        </span>
      )
    }

    return (
      <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
        {progress.message || 'Done'}
      </span>
    )
  }

  const getProcessedFiles = (data) => {
    if (data?.file) {
      return [{ ...data.file, isProcessed: true }]
    }

    if (Array.isArray(data?.images)) {
      return data.images.map((url, index) => {
        const filename = decodeURIComponent(url.split('/').pop() || `image-${index + 1}.jpg`)
        return {
          filename,
          originalName: filename,
          url,
          path: url,
          isProcessed: true,
        }
      })
    }

    return []
  }

  const openPicker = () => {
    inputRef.current?.click()
  }

  const pushFiles = async (selectedFiles) => {
    const nextFiles = Array.from(selectedFiles || [])
    if (nextFiles.length === 0) {
      return
    }

    onFilesSelected(nextFiles)
    setError('')
    setSuccessMessage('')
    setShowLimitMessage(false)
    setIsUploading(true)

    nextFiles.forEach((file) => {
      setProgress(file, 'uploading', 'Uploading...')
    })

    const outcomes = await Promise.all(
      nextFiles.map(async (file) => {
        try {
          const response = await uploadFile(file)
          setProgress(file, 'uploaded', 'Uploaded')
          return { status: 'fulfilled', value: response }
        } catch (reason) {
          setProgress(file, 'error')
          return { status: 'rejected', reason }
        }
      })
    )

    const succeeded = []
    let firstError = ''

    outcomes.forEach((outcome, index) => {
      if (outcome.status === 'fulfilled') {
        succeeded.push({ ...outcome.value.file, rawFile: nextFiles[index] })
        return
      }

      if (!firstError) {
        const fallback = `Failed to upload ${nextFiles[index].name}`
        firstError = outcome.reason?.message || fallback
      }
    })

    if (succeeded.length > 0) {
      setUploadedFiles((current) => [...succeeded, ...current])
    }

    if (firstError) {
      setError(firstError)
    }

    setIsUploading(false)
  }

  const handleConvert = async (rawFile, index) => {
    const currentKey = getFileKey(rawFile, index)
    setConvertingKey(currentKey)
    setIsConverting(true)
    setProgress(rawFile, 'converting', 'Converting...')
    setError('')
    setSuccessMessage('')
    setShowLimitMessage(false)
    try {
      const data = await convertFile(rawFile)
      const processedFiles = getProcessedFiles(data)

      if (processedFiles.length === 0) {
        throw new Error('No processed file returned by server')
      }

      setUploadedFiles((current) => [...processedFiles, ...current])
      setProgress(rawFile, 'processed', 'Processed')
      setSuccessMessage('✅ File processed successfully')
      await onUsageRefresh?.()
    } catch (err) {
      setProgress(rawFile, 'error')
      const message = err.message || 'Conversion failed'
      setError(message)
      if (message.toLowerCase().includes('free limit')) {
        setShowLimitMessage(true)
      }
    } finally {
      setConvertingKey(null)
      setIsConverting(false)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 text-slate-100 shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Upload Files</h2>
          <p className="text-sm text-slate-400">Drag and drop files to upload them to the backend.</p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
          Connected
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200">
          {successMessage}
        </div>
      )}

      {showLimitMessage && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
          <span>You have reached your free limit</span>
          <button
            type="button"
            onClick={() => onOpenUpgrade?.()}
            className="rounded-lg bg-amber-300 px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-amber-200"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

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
          disabled={isUploading || isConverting}
          className="mt-5 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? 'Uploading...' : isConverting ? 'Converting...' : 'Browse files'}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={async (event) => {
            await pushFiles(event.target.files)
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
                className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="max-w-[75%] truncate text-slate-200">{file.name}</span>
                <div className="flex items-center gap-2">
                  <ProgressPill progress={fileProgress[getFileKey(file, `queued-${index}`)]} />
                  {file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') ? (
                    <button
                      onClick={() => handleConvert(file, `queued-${index}`)}
                      disabled={convertingKey === getFileKey(file, `queued-${index}`)}
                      className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                    >
                      {convertingKey === getFileKey(file, `queued-${index}`) ? 'Converting...' : 'Convert to DOCX'}
                    </button>
                  ) : (file.type || '').startsWith('image/') || /\.(jpe?g|png)$/i.test(file.name) ? (
                    <button
                      onClick={() => handleConvert(file, `queued-${index}`)}
                      disabled={convertingKey === getFileKey(file, `queued-${index}`)}
                      className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                    >
                      {convertingKey === getFileKey(file, `queued-${index}`) ? 'Converting...' : 'Convert to PDF'}
                    </button>
                  ) : null}
                  <span className="text-xs text-slate-500">{Math.ceil(file.size / 1024)} KB</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-5 space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Uploaded files</h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li
                key={`${file.filename}-${index}`}
                className="flex flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="max-w-[60%] truncate text-emerald-100">{file.originalName || file.filename}</span>
                <div className="flex items-center gap-2">
                  {file.rawFile ? (
                    <ProgressPill progress={fileProgress[getFileKey(file.rawFile, `uploaded-${index}`)]} />
                  ) : file.isProcessed ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                      Processed
                    </span>
                  ) : null}
                  {file.rawFile && (file.originalName || file.filename).toLowerCase().endsWith('.pdf') && (
                    <button
                      onClick={() => handleConvert(file.rawFile, `uploaded-${index}`)}
                      disabled={convertingKey === getFileKey(file.rawFile, `uploaded-${index}`)}
                      className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                    >
                      {convertingKey === getFileKey(file.rawFile, `uploaded-${index}`) ? 'Converting...' : 'Convert to DOCX'}
                    </button>
                  )}
                  {file.rawFile && (file.rawFile.type || '').startsWith('image/') && (
                    <button
                      onClick={() => handleConvert(file.rawFile, `uploaded-${index}`)}
                      disabled={convertingKey === getFileKey(file.rawFile, `uploaded-${index}`)}
                      className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                    >
                      {convertingKey === getFileKey(file.rawFile, `uploaded-${index}`) ? 'Converting...' : 'Convert to PDF'}
                    </button>
                  )}
                  <a
                    href={file.url || file.path}
                    target="_blank"
                    download={file.filename || true}
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-emerald-300"
                  >
                    Download File
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default UploadBox
