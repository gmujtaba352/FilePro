import { useMemo } from 'react'

const Navbar = ({ user }) => {
  const initials = useMemo(() => {
    if (!user?.name) return 'FP'
    return user.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [user])

  return (
    <header className="flex items-center justify-between rounded-3xl border border-slate-800/80 bg-slate-950/70 px-5 py-4 text-slate-100 shadow-2xl shadow-black/20 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
        <h1 className="mt-1 text-lg font-semibold text-white">FilePro Workspace</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">{user?.name || 'User Name'}</p>
          <p className="text-xs text-slate-400">Signed in user</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/20">
          {initials}
        </div>
      </div>
    </header>
  )
}

export default Navbar
