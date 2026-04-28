import { useEffect, useRef, useState } from 'react'
import UploadArea from '../components/UploadArea'
import Loader from '../components/Loader'
import ResultBox from '../components/ResultBox'
import UsageBanner from '../components/UsageBanner'
import { uploadFile, convertJpgToPdf, getUsageInfo } from '../utils/api'

const SeoText = () => (
  <div className="prose max-w-none text-slate-300">
    <h2>What is JPG to PDF conversion?</h2>
    <p>
      JPG to PDF conversion packages one or more JPEG images into a single PDF document. This is useful for
      sharing photos, receipts, or scanned pages in a compact and widely supported format. Our converter keeps
      image quality high while producing a simple PDF you can view and print.
    </p>
    <h2>How to convert JPG to PDF?</h2>
    <p>
      Upload your JPG image, press Convert, and download the resulting PDF file. The process runs in the cloud and
      completes quickly. You can combine multiple images into a single PDF when using the multi-upload option.
    </p>
    <h2>Why use our tool?</h2>
    <p>
      We focus on speed and ease-of-use. No installation is required, and your files are handled securely and
      removed after processing. The tool works in the browser and supports mobile devices as well.
    </p>
  </div>
)

const JpgToPdf = () => {
  const uploadRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [convertedFile, setConvertedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState({ usageCount: 0, usageLimit: 5, remaining: 5 })

  useEffect(() => {
    document.title = 'Convert JPG to PDF Online for Free - FilePro'
    const meta = document.querySelector('meta[name="description"]')
    const desc = 'Fast, secure, and easy JPG to PDF conversion. Upload images and download a PDF.'
    if (meta) meta.setAttribute('content', desc)
    else {
      const m = document.createElement('meta')
      m.name = 'description'
      m.content = desc
      document.head.appendChild(m)
    }

    refreshUsage()
  }, [])

  const refreshUsage = async () => {
    try {
      const data = await getUsageInfo()
      if (data?.usage) setUsage(data.usage)
    } catch (err) {
      // ignore
    }
  }

  const handleFilesSelected = async (files) => {
    const file = files[0]
    if (!file) return
    setSelectedFile(file)
    setError('')
    setIsUploading(true)
    setUploadedFile(null)
    setConvertedFile(null)

    try {
      const response = await uploadFile(file)
      setUploadedFile(response.file)
    } catch (err) {
      setError(err.message || 'Upload failed')
      setSelectedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleConvert = async () => {
    if (!selectedFile) return
    setError('')
    setIsConverting(true)
    setConvertedFile(null)

    try {
      const data = await convertJpgToPdf(selectedFile)
      if (data?.file) {
        setConvertedFile({ filename: data.file.filename || data.file.originalName, url: data.file.url || data.file.path })
      } else {
        throw new Error('No converted file returned')
      }
      await refreshUsage()
    } catch (err) {
      setError(err.message || 'Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-white">Convert JPG to PDF Online for Free</h1>
          <p className="mt-2 text-slate-300">Fast, secure, and easy file conversion</p>
          <p className="mt-3 text-xs text-slate-400">✅ Free • No signup required • Fast conversion</p>
        </header>

        <div className="rounded-3xl bg-gradient-to-br from-white/3 to-white/2 p-8 shadow-xl ring-1 ring-white/6 space-y-6">
          <div>
            <UploadArea onFilesSelected={handleFilesSelected} isLoading={isUploading} />
            <input ref={uploadRef} type="file" className="hidden" />
          </div>

          <div>
            {uploadedFile && !convertedFile && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
                  <h3 className="font-semibold text-white">File Ready</h3>
                  <p className="mt-1 font-mono text-sm text-slate-400">{uploadedFile.originalName || uploadedFile.filename}</p>
                </div>

                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isConverting || usage.remaining <= 0}
                  className={`w-full rounded-xl py-3 text-lg font-bold transition ${
                    isConverting || usage.remaining <= 0
                      ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg'
                  }`}
                >
                  {isConverting ? '⏳ Converting...' : 'Convert to PDF'}
                </button>

                {error && <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-rose-200">{error}</div>}
              </div>
            )}

            {isUploading && <Loader message="Uploading your file..." />}
            {isConverting && <Loader message="Converting your file..." />}

            {convertedFile && (
              <ResultBox
                filename={convertedFile.filename}
                fileUrl={convertedFile.url}
                onNewConversion={() => {
                  setSelectedFile(null)
                  setUploadedFile(null)
                  setConvertedFile(null)
                }}
              />
            )}
          </div>

          <UsageBanner remaining={usage.remaining} limit={usage.usageLimit} onUpgrade={() => {}} />

          <section className="pt-4">
            <SeoText />

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white">Features</h3>
              <ul className="mt-2 space-y-1 text-slate-300">
                <li>• Fast conversion</li>
                <li>• Secure files</li>
                <li>• No installation required</li>
                <li>• Free usage</li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white">FAQ</h3>
              <div className="mt-2 text-slate-300">
                <p className="mt-2"><strong>Q: Is this tool free?</strong> Yes for light usage.</p>
                <p className="mt-2"><strong>Q: Is my file secure?</strong> Files are processed and removed after conversion.</p>
                <p className="mt-2"><strong>Q: What formats are supported?</strong> JPG/PNG input to PDF output.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default JpgToPdf
