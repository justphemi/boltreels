
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { dark, light } from '../theme'
import Toast from './Toast'

const NAV = [
  { path: '/dashboard', label: 'Post' },
  { path: '/history', label: 'History' },
  { path: '/settings', label: 'Settings' },
]

export default function Layout({ children }) {
  const { theme, toggleTheme, logout } = useStore()
  const t = theme === 'dark' ? dark : light
  const { pathname } = useLocation()
  const nav = useNavigate()

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, background: t.bg, zIndex: 100 }}>
        <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 22, letterSpacing: -0.5, color: t.text }}>boltreels</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.subtext, borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: t.subtext, fontSize: 12, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 16px 100px' }}>
        {children}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: t.bg, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '12px 0 16px', zIndex: 100 }}>
        {NAV.map(n => (
          <Link key={n.path} to={n.path} style={{ textDecoration: 'none', color: pathname === n.path ? t.accent : t.subtext, fontSize: 13, fontWeight: pathname === n.path ? 600 : 400, transition: 'color 0.2s' }}>
            {n.label}
          </Link>
        ))}
      </div>

      <Toast />
    </div>
  )
}
