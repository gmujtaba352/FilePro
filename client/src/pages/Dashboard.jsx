import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ToolCard from '../components/ToolCard'
import UploadBox from '../components/UploadBox'
import { useAuth } from '../context/AuthContext'

const tools = [
  {
    title: 'Convert File',
    description: 'Prepare documents for the right format before the processing backend is connected.',
    accent: 'linear-gradient(135deg, #22d3ee, #0f766e)',
  },
  {
    title: 'Compress Image',
    description: 'Preview the compression workflow for images and assets in a clean workspace.',
    accent: 'linear-gradient(135deg, #f9a8d4, #7c3aed)',
  },
  {
    title: 'Generate Invoice',
    description: 'Design a polished invoice generation flow for freelancers and small teams.',
    accent: 'linear-gradient(135deg, #fbbf24, #f97316)',
  },
]

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [files, setFiles] = useState([])

  const displayName = useMemo(() => user?.name || 'User', [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleFilesSelected = (selectedFiles) => {
    setFiles((current) => {
      const seen = new Set(current.map((file) => `${file.name}-${file.size}-${file.lastModified}`))
      const uniqueFiles = selectedFiles.filter((file) => !seen.has(`${file.name}-${file.size}-${file.lastModified}`))
      return [...current, ...uniqueFiles]
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <Sidebar onLogout={handleLogout} />
        </aside>

        <main className="flex min-w-0 flex-col gap-6">
          <Navbar user={user} />

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <UploadBox files={files} onFilesSelected={handleFilesSelected} />

            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Workspace</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Welcome, {displayName}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                This dashboard is frontend-only for now, so you can preview the layout and file upload interactions
                before backend processing is added.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Files</p>
                  <p className="mt-2 text-2xl font-bold text-white">{files.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
                  <p className="mt-2 text-2xl font-bold text-cyan-300">Ready</p>
                </div>
              </div>
            </div>
          </section>

          <section id="tools">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Tools</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Choose a file workflow</h2>
              </div>
              <p className="text-sm text-slate-400">Responsive card grid</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  description={tool.description}
                  accent={tool.accent}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
