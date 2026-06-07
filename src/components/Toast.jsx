
import React from 'react'
import { useStore } from '../store'
import { dark, light } from '../theme'

export default function Toast() {
  const { toasts, theme } = useStore()
  const t = theme === 'dark' ? dark : light

  const colors = {
    info: t.info,
    success: t.success,
    error: t.danger,
    warning: t.warning,
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', width: '90vw', maxWidth: 420 }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{
          background: t.surface,
          border: `1px solid ${colors[toast.type] || t.border}`,
          color: t.text,
          borderRadius: 12,
          padding: '12px 20px',
          fontSize: 14,
          width: '100%',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          borderLeft: `4px solid ${colors[toast.type] || t.border}`,
        }}>
          {toast.msg}
        </div>
      ))}
    </div>
  )
}