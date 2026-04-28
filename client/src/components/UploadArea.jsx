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
      className={`relative rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-transform duration-200 ease-in-out ${
        dragActive
          ? 'border-cyan-400 bg-cyan-400/6 shadow-lg scale-102'
          : isLoading
            ? 'border-slate-300 bg-slate-100/5 cursor-not-allowed opacity-80'
            : 'border-slate-300 bg-white/3 hover:border-cyan-400 hover:shadow-md hover:-translate-y-0.5'
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
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/6 text-2xl">⬆️</div>
        <h3 className="mt-3 text-lg font-semibold text-white">Drag & Drop Your File</h3>
        <p className="mt-2 text-sm text-slate-300">or click to browse from your computer</p>
        <p className="mt-3 text-xs text-slate-400">Supported: PDF, DOCX, JPG, PNG (Max 10MB)</p>
      </div>
    </div>
  )
}

export default UploadArea
