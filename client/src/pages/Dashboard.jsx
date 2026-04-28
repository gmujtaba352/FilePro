import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import UploadArea from '../components/UploadArea'
import Loader from '../components/Loader'
import ResultBox from '../components/ResultBox'
import UsageBanner from '../components/UsageBanner'
import { useAuth } from '../context/AuthContext'
import { uploadFile, convertFile, getUsageInfo } from '../utils/api'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const uploadInputRef = useRef(null)

  // State Management
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [convertedFile, setConvertedFile] = useState(null)
  const [usage, setUsage] = useState({ usageCount: 0, usageLimit: 5, remaining: 5 })
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Loading States
  const [isUploading, setIsUploading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')

  // Fetch usage on mount
  useEffect(() => {
    refreshUsage()
  }, [])

  const refreshUsage = async () => {
    try {
      const data = await getUsageInfo()
      if (data?.usage) {
        setUsage(data.usage)
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err)
    }
  }

  const handleUploadClick = () => {
    uploadInputRef.current?.click()
  }

  const handleFilesSelected = async (files) => {
    const file = files[0] // Only allow single file
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
      const data = await convertFile(selectedFile)

      // Handle both single file (PDF→DOCX) and image array (PDF→JPG)
      if (data?.file) {
        setConvertedFile({
          filename: data.file.filename || data.file.originalName || 'converted-file',
          url: data.file.url || data.file.path,
        })
      } else if (Array.isArray(data?.images) && data.images.length > 0) {
        const imageUrl = data.images[0]
        const filename = decodeURIComponent(imageUrl.split('/').pop() || 'converted-image.jpg')
        setConvertedFile({
          filename,
          url: imageUrl,
        })
      } else {
        throw new Error('No converted file returned')
      }

      await refreshUsage()
    } catch (err) {
      const message = err.message || 'Conversion failed'
      setError(message)
      if (message.toLowerCase().includes('free limit') || message.toLowerCase().includes('limit reached')) {
        setShowUpgradeModal(true)
      }
    } finally {
      setIsConverting(false)
    }
  }

  const handleNewConversion = () => {
    setSelectedFile(null)
    setUploadedFile(null)
    setConvertedFile(null)
    setError('')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getConvertButtonText = () => {
    if (!uploadedFile) return 'Select a File First'
    const ext = uploadedFile.originalName?.split('.').pop()?.toUpperCase() || 'File'
    if (ext === 'PDF') return '→ Convert to JPG'
    if (ext === 'JPG' || ext === 'PNG') return '→ Convert to PDF'
    return '→ Convert'
  }

  const handleUploadInputChange = (e) => {
    if (e.target.files) {
      handleFilesSelected(e.target.files)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-8">
      {/* Navbar */}
      <div className="border-b border-slate-800/50 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Navbar user={user} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-br from-white/3 to-white/2 p-8 shadow-xl ring-1 ring-white/6 space-y-8">
          {/* Hidden file input */}
          <input
            ref={uploadInputRef}
            type="file"
            onChange={handleUploadInputChange}
            className="hidden"
            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.gif,.bmp,.webp,.pptx,.xlsx,.txt"
          />

          {/* Hero Section (show when no file selected) */}
          {!selectedFile && !uploadedFile && !convertedFile && (
            <HeroSection onUploadClick={handleUploadClick} />
          )}

          {/* Upload Area or File Details */}
          {!uploadedFile && !convertedFile ? (
            <>
              {!selectedFile ? (
                <UploadArea onFilesSelected={handleFilesSelected} isLoading={isUploading} />
              ) : isUploading ? (
                <Loader message="Uploading your file..." />
              ) : null}
            </>
          ) : null}

          {/* File Details + Conversion */}
          {uploadedFile && !convertedFile && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">✅</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">File Ready</h3>
                    <p className="mt-1 break-all font-mono text-sm text-slate-400">
                      {uploadedFile.originalName || uploadedFile.filename}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Size: {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting || usage.remaining <= 0}
                className={`w-full rounded-xl py-4 text-lg font-bold transition ${
                  isConverting || usage.remaining <= 0
                    ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                    : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-95'
                }`}
              >
                {isConverting ? '⏳ Converting...' : getConvertButtonText()}
              </button>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-200">
                  <p className="text-sm font-medium">⚠️ {error}</p>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isConverting && <Loader message="Converting your file..." />}

          {/* Conversion Result */}
          {convertedFile && (
            <ResultBox
              filename={convertedFile.filename}
              fileUrl={convertedFile.url}
              onDownload={() => {
                /* Download is handled by download attribute */
              }}
              onNewConversion={handleNewConversion}
            />
          )}

          {/* Usage Banner */}
          <UsageBanner
            remaining={usage.remaining}
            limit={usage.usageLimit}
            onUpgrade={() => setShowUpgradeModal(true)}
          />
        </div>
      </div>
    </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-amber-400/30 bg-slate-900 p-8 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl">🔓</div>
              <h2 className="mt-4 text-2xl font-bold text-white">Upgrade to Pro</h2>
              <p className="mt-3 text-slate-300">
                You've used all 5 free conversions. Upgrade to Pro for unlimited conversions and priority support.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3 font-bold text-white transition hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
                >
                  Upgrade to Pro
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full rounded-lg border border-slate-600 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 active:scale-95"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
