import { useRef, useState } from 'react'

const UploadArea = ({ onFilesSelected, isLoading = false }) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer?.files?.length > 0) {
      onFilesSelected(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    if (e.target?.files?.length > 0) {
      onFilesSelected(e.target.files)
    }
  }

  const handleClick = () => {
    if (!isLoading) {
      inputRef.current?.click()
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative rounded-2xl border-2 border-dashed px-8 py-16 text-center transition cursor-pointer ${
        dragActive
          ? 'border-cyan-400 bg-cyan-400/10 scale-105'
          : isLoading
            ? 'border-slate-600 bg-slate-900/50 cursor-not-allowed'
            : 'border-slate-600 bg-slate-900/50 hover:border-cyan-400 hover:bg-cyan-400/5'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
        disabled={isLoading}
        multiple={false}
      />

      <div className="pointer-events-none select-none">
        <div className="text-4xl">📄</div>
        <h3 className="mt-3 text-lg font-semibold text-white">Drag & Drop Your File</h3>
        <p className="mt-2 text-sm text-slate-400">
          or click to browse from your computer
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Supported: PDF, DOCX, JPG, PNG, and more (Max 10MB)
        </p>
      </div>
    </div>
  )
}

export default UploadArea
