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
    <header className="flex items-center justify-between gap-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="text-2xl">📁</div>
        <h1 className="text-xl font-bold text-white">FilePro</h1>
      </div>

      {/* Right: User Info + Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <div>
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400">Pro</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/20 text-sm font-semibold text-cyan-200">
            {initials}
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
