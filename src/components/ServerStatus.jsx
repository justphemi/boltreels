
import React, { useState } from 'react'
import { api } from '../api'
import { useStore } from '../store'
import { dark, light } from '../theme'

export default function ServerStatus() {
  const { theme, addToast } = useStore()
  const t = theme === 'dark' ? dark : light
  const [status, setStatus] = useState('unknown') // unknown | checking | online | offline
  const [checking, setChecking] = useState(false)

  const check = async () => {
    setChecking(true)
    setStatus('checking')
    try {
      await api.health()
      setStatus('online')
      addToast('Server is online and ready.', 'success')
    } catch {
      setStatus('offline')
      addToast('Server is offline or waking up. Wait ~30 seconds and try again.', 'warning')
    } finally {
      setChecking(false)
    }
  }

  const colors = { unknown: t.subtext, checking: t.warning, online: t.success, offline: t.danger }
  const labels = { unknown: 'Check Server', checking: 'Checking...', online: '● Server Online', offline: '● Server Offline — Wake Up' }

  return (
    <button
      onClick={check}
      disabled={checking}
      style={{
        background: 'transparent',
        border: `1px solid ${colors[status]}`,
        color: colors[status],
        borderRadius: 8,
        padding: '8px 16px',
        fontSize: 13,
        cursor: checking ? 'not-allowed' : 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.2s',
      }}
    >
      {labels[status]}
    </button>
  )
}