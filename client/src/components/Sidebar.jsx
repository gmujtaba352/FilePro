import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', type: 'link' },
  { label: 'Tools', to: '/dashboard#tools', type: 'link' },
  { label: 'Logout', type: 'button' },
]

const Sidebar = ({ onLogout }) => {
  const location = useLocation()

  return (
    <aside className="flex h-full flex-col rounded-3xl border border-slate-800/80 bg-slate-950/90 p-5 text-slate-100 shadow-2xl shadow-black/30">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/20">
          FP
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">FilePro</p>
          <p className="text-xs text-slate-400">Client-ready toolkit</p>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = item.type === 'link' && location.pathname === '/dashboard'

          if (item.type === 'button') {
            return (
              <button
                key={item.label}
                type="button"
                onClick={onLogout}
                className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-rose-200"
              >
                {item.label}
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-200"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
