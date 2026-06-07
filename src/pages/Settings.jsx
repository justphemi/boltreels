
import React, { useEffect, useState } from 'react'
import { useStore } from '../store'
import { api } from '../api'
import { dark, light } from '../theme'
import { useSearchParams } from 'react-router-dom'

export default function Settings() {
  const { theme, token, addToast, tiktokAccounts, setTikTokAccounts } = useStore()
  const t = theme === 'dark' ? dark : light
  const [params] = useSearchParams()
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    // Handle TikTok OAuth callback result
    if (params.get('tiktok') === 'connected') {
      addToast('TikTok account connected successfully!', 'success')
    }
    if (params.get('error')) {
      const errMap = {
        tiktok_auth_failed: 'TikTok authorization failed. Make sure your sandbox credentials are correct.',
        tiktok_callback_error: 'Something went wrong during TikTok callback. Please try again.',
      }
      addToast(errMap[params.get('error')] || `Error: ${params.get('error')}`, 'error')
    }
    // Load accounts
    api.getTikTokAccounts(token).then(d => setTikTokAccounts(d.accounts)).catch(() => {})
  }, [])

  const connectTikTok = async () => {
    setConnecting(true)
    try {
      const data = await api.getTikTokConnectUrl(token)
      window.location.href = data.auth_url
    } catch (e) {
      addToast(e.message, 'error')
      setConnecting(false)
    }
  }

  const cardStyle = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: 12,
    padding: '16px',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600, color: t.text }}>Settings</h2>

      <h3 style={{ margin: '0 0 12px', fontSize: 13, color: t.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>TikTok Accounts</h3>

      {tiktokAccounts.map(a => (
        <div key={a.tiktok_open_id} style={cardStyle}>
          {a.avatar_url && <img src={a.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover' }} />}
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: t.text }}>{a.display_name}</p>
            <p style={{ margin: 0, fontSize: 12, color: t.success }}>● Connected</p>
          </div>
        </div>
      ))}

      <button
        onClick={connectTikTok}
        disabled={connecting}
        style={{
          width: '100%', padding: '14px', background: 'transparent',
          border: `1px solid ${t.border}`, color: t.text, borderRadius: 10,
          fontSize: 14, cursor: connecting ? 'not-allowed' : 'pointer', opacity: connecting ? 0.6 : 1,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {connecting ? 'Redirecting to TikTok...' : '+ Connect TikTok Account'}
      </button>

      <div style={{ marginTop: 32, padding: '14px 16px', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10 }}>
        <p style={{ margin: 0, fontSize: 13, color: t.subtext, lineHeight: 1.6 }}>
          <strong style={{ color: t.text }}>TikTok Sandbox:</strong> Your app is running in TikTok's developer sandbox. Only your verified sandbox account can receive posts. This is normal for development.
        </p>
      </div>
    </div>
  )
}
