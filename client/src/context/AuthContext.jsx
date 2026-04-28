import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'fp_token'
const LEGACY_TOKEN_KEY = 'token'
const USER_KEY = 'fp_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem(USER_KEY)
    if (!rawUser) return null

    try {
      return JSON.parse(rawUser)
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          logout()
          return
        }

        const data = await response.json()
        setUser(data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [token])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem(TOKEN_KEY, jwt)
    localStorage.setItem(LEGACY_TOKEN_KEY, jwt)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(LEGACY_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
