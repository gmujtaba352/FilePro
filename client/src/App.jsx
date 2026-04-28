import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()

  useEffect(() => {
    document.title = 'FilePro - Free Online File Conversion Tool'
    const meta = document.querySelector('meta[name="description"]')
    const desc = 'Convert PDF to DOCX, PDF to JPG, JPG to PDF for free. No signup required, fast and secure.'
    if (meta) meta.setAttribute('content', desc)
    else {
      const m = document.createElement('meta')
      m.name = 'description'
      m.content = desc
      document.head.appendChild(m)
    }
  }, [])

  const tools = [
    { name: 'PDF to DOCX', icon: '📄', path: '/pdf-to-docx', desc: 'Convert PDF to editable Word files' },
    { name: 'PDF to JPG', icon: '🖼️', path: '/pdf-to-jpg', desc: 'Extract pages as high-quality images' },
    { name: 'JPG to PDF', icon: '📸', path: '/jpg-to-pdf', desc: 'Combine images into a single PDF' },
  ]

  const features = [
    { title: 'Lightning Fast', desc: 'Convert files in seconds, no waiting' },
    { title: 'Completely Free', desc: 'No hidden fees or premium upsells' },
    { title: '100% Secure', desc: 'Files deleted after processing' },
    { title: 'No Installation', desc: 'Works in your browser instantly' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <header className="border-b border-white/6 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/4 p-2 text-2xl">📁</div>
            <h1 className="text-lg font-semibold text-white">FilePro</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-widest text-cyan-400">Online file conversion</p>
          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
            Convert Files Instantly
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Convert PDFs to Word, extract images, and more. Free, fast, and secure. No signup required to start.
          </p>
          <p className="mt-2 text-sm text-slate-400">✅ Free • 🔒 Secure • ⚡ Fast</p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/pdf-to-docx"
              className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
            >
              Start Converting
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white">Popular Tools</h2>
          <p className="mt-2 text-center text-slate-400">Choose a conversion tool to get started</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group rounded-2xl border border-white/10 bg-white/3 p-6 transition hover:border-cyan-400/50 hover:bg-white/5"
              >
                <div className="text-4xl">{tool.icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-white">{tool.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{tool.desc}</p>
                <p className="mt-4 text-sm font-semibold text-cyan-400 transition group-hover:translate-x-1">
                  Convert →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white">Why Choose FilePro</h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-white/2 p-6">
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-white/3 to-white/2 p-12 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to convert?</h2>
          <p className="mt-2 text-slate-300">Start converting files in seconds. No account needed.</p>

          <Link
            to="/pdf-to-docx"
            className="mt-6 inline-flex rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-white transition hover:bg-cyan-400"
          >
            Convert Your First File
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 px-6 py-8 text-center text-sm text-slate-400">
        <p>© 2026 FilePro. Convert files instantly, for free.</p>
      </footer>
    </div>
  )
}

export default App
