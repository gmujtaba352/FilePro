const HeroSection = ({ onUploadClick }) => {
  return (
    <section className="relative rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 p-12 text-center shadow-2xl shadow-cyan-500/10 md:p-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-600/5 to-transparent" />
      </div>

      <div className="relative">
        <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Convert Files Instantly
        </h1>
        <p className="mt-4 text-lg text-slate-300 md:text-xl">
          Upload your file and convert it in seconds
        </p>

        <button
          type="button"
          onClick={onUploadClick}
          className="mt-8 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-cyan-500/50 hover:scale-105"
        >
          📁 Upload File
        </button>
      </div>
    </section>
  )
}

export default HeroSection
