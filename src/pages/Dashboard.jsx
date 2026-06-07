
import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import { api } from '../api'
import { dark, light } from '../theme'
import ServerStatus from '../components/ServerStatus'
import JobCard from '../components/JobCard'

export default function Dashboard() {
  const { theme, token, addToast, jobs, setJobs, upsertJob, tiktokAccounts, setTikTokAccounts } = useStore()
  const t = theme === 'dark' ? dark : light

  const [url, setUrl] = useState('')
  const [accountId, setAccountId] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Poll active jobs every 5 seconds
  useEffect(() => {
    loadJobs()
    const interval = setInterval(loadJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    api.getTikTokAccounts(token)
      .then(d => {
        setTikTokAccounts(d.accounts)
        if (d.accounts.length > 0 && !accountId) setAccountId(d.accounts[0].tiktok_open_id)
      })
      .catch(() => {})
  }, [])

  const loadJobs = async () => {
    try {
      const data = await api.listJobs(token)
      setJobs(data.jobs)
    } catch {}
  }

  const handleSubmit = async () => {
    if (!url.trim()) return addToast('Please paste a YouTube or Instagram URL.', 'error')
    if (!accountId) return addToast('No TikTok account connected. Go to Settings to connect one.', 'error')

    const payload = {
      url: url.trim(),
      platform: 'tiktok',
      tiktok_account_id: accountId,
      scheduled_time: scheduledTime || null,
    }

    setSubmitting(true)
    try {
      const data = await api.submitJob(token, payload)
      upsertJob({ id: data.job_id, status: 'queued', url: url.trim(), created_at: new Date().toISOString(), scheduled_time: scheduledTime || null })
      addToast('Job queued! Processing will start shortly. You can submit more.', 'success')
      setUrl('')
      setScheduledTime('')
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Min datetime for the schedule picker = now + 10 minutes
  const minDateTime = new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 16)

  const inputStyle = {
    width: '100%', padding: '14px 16px', background: t.surface, border: `1px solid ${t.border}`,
    borderRadius: 10, color: t.text, fontSize: 15, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  }

  const activeJobs = jobs.filter(j => !['posted', 'failed'].includes(j.status))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: t.text }}>New Post</h2>
        <ServerStatus />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <input
          style={inputStyle}
          type="url"
          placeholder="YouTube or Instagram URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />

        {tiktokAccounts.length > 1 && (
          <select style={{ ...inputStyle }} value={accountId} onChange={e => setAccountId(e.target.value)}>
            {tiktokAccounts.map(a => (
              <option key={a.tiktok_open_id} value={a.tiktok_open_id}>{a.display_name}</option>
            ))}
          </select>
        )}

        <div>
          <label style={{ fontSize: 12, color: t.subtext, display: 'block', marginBottom: 6 }}>
            Schedule (optional) — leave empty to post immediately
          </label>
          <input
            style={inputStyle}
            type="datetime-local"
            value={scheduledTime}
            min={minDateTime}
            onChange={e => setScheduledTime(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: '14px', background: t.accent, color: t.accentText,
            border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {submitting ? 'Queuing...' : 'Queue & Process'}
        </button>
      </div>

      {activeJobs.length > 0 && (
        <>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: t.subtext, textTransform: 'uppercase', letterSpacing: 1 }}>
            In Progress ({activeJobs.length})
          </h3>
          {activeJobs.map(j => <JobCard key={j.id} job={j} theme={theme} />)}
        </>
      )}

      {tiktokAccounts.length === 0 && (
        <div style={{ padding: '16px', background: t.surface, border: `1px solid ${t.warning}`, borderRadius: 10, fontSize: 13, color: t.warning }}>
          ⚠ No TikTok account connected yet. Go to <strong>Settings</strong> to connect your account.
        </div>
      )}
    </div>
  )
}