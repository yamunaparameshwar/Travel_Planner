import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const hydrate = useCallback(async () => {
    const token = localStorage.getItem('atp_access')
    const cachedUser = localStorage.getItem('atp_user')
    if (token && cachedUser) {
      setUser(JSON.parse(cachedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const login = async ({ email, password, remember }) => {
    try {
      const { data } = await authService.login({ email, password })
      localStorage.setItem('atp_access', data.access)
      if (remember) localStorage.setItem('atp_refresh', data.refresh)
      localStorage.setItem('atp_user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success(`Welcome back, ${data.user.name || data.user.username}`)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.detail || 'Invalid email or password'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (payload) => {
    try {
      const { data } = await authService.register(payload)
      toast.success('Account created — please log in')
      return { success: true, data }
    } catch (err) {
      const message = err.response?.data?.detail || Object.values(err.response?.data || {})[0]?.[0] || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = async () => {
    const refresh = localStorage.getItem('atp_refresh')
    try {
      if (refresh) await authService.logout(refresh)
    } catch {
      /* ignore network errors on logout */
    } finally {
      localStorage.removeItem('atp_access')
      localStorage.removeItem('atp_refresh')
      localStorage.removeItem('atp_user')
      setUser(null)
      toast.success('Signed out')
    }
  }

  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      localStorage.setItem('atp_user', JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
