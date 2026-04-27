import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.text())
      .then(setMessage)
      .catch(() => setMessage('Frontend is running'))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-10">
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300">FilePro</p>
            <h1 className="mt-1 text-lg font-semibold">Client-Ready File Toolkit</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
              SaaS dashboard foundation for file conversion, compression, and invoicing.
            </div>
            <div className="space-y-4">
              <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
                Build a polished file toolkit with authentication first.
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                The frontend is wired to the backend health check and the login flow is ready for JWT-based access.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/30 backdrop-blur">
            <p className="text-sm font-medium text-sky-200">Backend status</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200">
              {message}
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">JWT auth</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">MongoDB + Mongoose</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">React Router</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Tailwind UI</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
