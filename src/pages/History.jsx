
import React, { useEffect } from 'react'
import { useStore } from '../store'
import { api } from '../api'
import { dark, light } from '../theme'
import JobCard from '../components/JobCard'

export default function History() {
  const { theme, token, jobs, setJobs } = useStore()
  const t = theme === 'dark' ? dark : light

  useEffect(() => {
    api.listJobs(token).then(d => setJobs(d.jobs)).catch(() => {})
  }, [])

  const done = jobs.filter(j => ['posted', 'failed'].includes(j.status))

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600, color: t.text }}>History</h2>
      {done.length === 0 && (
        <p style={{ color: t.subtext, fontSize: 14, textAlign: 'center', marginTop: 60 }}>No completed posts yet.</p>
      )}
      {done.map(j => <JobCard key={j.id} job={j} theme={theme} />)}
    </div>
  )
}