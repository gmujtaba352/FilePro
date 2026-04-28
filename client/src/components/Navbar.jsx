import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ user }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between gap-4 px-2 py-3">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-white/4 p-2 text-2xl">📁</div>
        <h1 className="text-lg font-semibold tracking-tight text-white">FilePro</h1>
      </div>

      {/* Right: User Info + Logout */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <div>
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400">Pro</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/20 text-sm font-semibold text-cyan-200">
            {initials}
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-white/8 bg-white/3 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
