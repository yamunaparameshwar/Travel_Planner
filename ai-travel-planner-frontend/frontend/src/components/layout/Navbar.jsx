import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Compass, Menu, X, Moon, Sun, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/plan-trip', label: 'Plan Trip' },
  { to: '/saved-trips', label: 'Saved Trips' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-sunset-500' : 'text-ink/70 dark:text-sand-300 hover:text-sunset-500'
    }`

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? 'glass-light dark:glass shadow-glass' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-sand">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-horizon-gradient text-white">
            <Compass size={18} />
          </span>
          AI Travel Planner
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-ink/70 transition hover:bg-ink/5 dark:text-sand-300 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-sm font-medium text-ink dark:border-white/15 dark:text-sand"
              >
                <LayoutDashboard size={15} /> {user?.name?.split(' ')[0] || 'Dashboard'}
              </NavLink>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                aria-label="Log out"
                className="rounded-full p-2 text-ink/60 hover:bg-ink/5 dark:text-sand-300 dark:hover:bg-white/10"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-medium text-ink/80 dark:text-sand-300">
                Log In
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-sunset-gradient px-4 py-2 text-sm font-semibold text-white shadow-glass transition hover:brightness-105"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="glass-light dark:glass mx-4 mb-4 rounded-2xl p-5 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/profile" onClick={() => setOpen(false)} className={navLinkClass}>
              Profile
            </NavLink>
            <div className="flex items-center justify-between border-t border-ink/10 pt-4 dark:border-white/10">
              <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-ink/70 dark:text-sand-300">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle theme
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout()
                    setOpen(false)
                    navigate('/')
                  }}
                  className="flex items-center gap-1 text-sm text-sunset-500"
                >
                  <LogOut size={15} /> Log out
                </button>
              ) : (
                <NavLink to="/login" onClick={() => setOpen(false)} className="flex items-center gap-1 text-sm text-sunset-500">
                  <User size={15} /> Log in
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
