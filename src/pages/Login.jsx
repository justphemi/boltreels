
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { api } from '../api'
import { dark, light } from '../theme'

export default function Login() {
  const { theme, setAuth, addToast } = useStore()
  const t = theme === 'dark' ? dark : light
  const nav = useNavigate()

  const [mode, setMode] = useState('login') // login | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const inputStyle = {
    width: '100%', padding: '14px 16px', background: t.surface, border: `1px solid ${t.border}`,
    borderRadius: 10, color: t.text, fontSize: 15, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  }

  const btnStyle = {
    width: '100%', padding: '14px', background: t.accent, color: t.accentText,
    border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'Inter, sans-serif', opacity: loading ? 0.6 : 1,
  }

  // Replace just the handleLogin function in your Login.jsx

const handleLogin = async () => {
  if (!email.trim()) return addToast('Please enter your email address.', 'error')
  if (!password.trim()) return addToast('Please enter your password.', 'error')
  setLoading(true)
  try {
    const data = await api.login(email.trim(), password)

    // 202 means account created but email confirmation needed
    if (data?.detail) {
      addToast(data.detail, 'info')
      return
    }

    // setAuth first, then navigate — order matters
    setAuth(data.access_token, data.user)
    addToast(data.is_new ? 'Account created! Welcome to boltreels.' : 'Welcome back!', 'success')
    nav('/dashboard')
  } catch (e) {
    // 202 comes back as an exception from our fetch wrapper, handle it
    if (e.message?.includes('Check your email')) {
      addToast(e.message, 'info')
      return
    }
    addToast(e.message, 'error')
  } finally {
    setLoading(false)
  }
}

  const handleReset = async () => {
    if (!email.trim()) return addToast('Please enter your email address to reset your password.', 'error')
    setLoading(true)
    try {
      const data = await api.resetPassword(email.trim())
      addToast(data.message, 'success')
      setMode('login')
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: 36, color: t.text, marginBottom: 8 }}>boltreels</h1>
      <p style={{ color: t.subtext, fontSize: 14, marginBottom: 32 }}>Content repurposing, automated.</p>

      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleReset())} />

        {mode === 'login' && (
          <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        )}

        <button style={btnStyle} onClick={mode === 'login' ? handleLogin : handleReset} disabled={loading}>
          {loading ? (mode === 'login' ? 'Logging in...' : 'Sending...') : (mode === 'login' ? 'Log in' : 'Send Reset Email')}
        </button>

        <button onClick={() => setMode(mode === 'login' ? 'reset' : 'login')} style={{ background: 'none', border: 'none', color: t.subtext, fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>
          {mode === 'login' ? 'Forgot password?' : '← Back to login'}
        </button>
      </div>
    </div>
  )
}