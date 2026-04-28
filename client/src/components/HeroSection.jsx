const HeroSection = ({ onUploadClick }) => {
  return (
    <section className="animate-fp-fade-in relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/6 via-white/3 to-white/6 p-10 text-center shadow-md shadow-black/30 md:p-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
          Convert Files Instantly
        </h1>
        <p className="mt-4 text-sm text-slate-300 sm:text-base md:text-lg">
          Upload your file and convert it in seconds
        </p>

        <p className="mt-3 text-xs text-slate-400">✅ Free • No signup required • Fast conversion</p>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onUploadClick}
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:scale-105 active:scale-100"
          >
            <span className="text-xl">📁</span>
            <span>Upload File</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
