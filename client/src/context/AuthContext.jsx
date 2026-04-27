import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('fp_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          logout()
          return
        }

        const data = await response.json()
        setUser(data.user)
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
    localStorage.setItem('fp_token', jwt)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('fp_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
