
import React from 'react'
import { dark, light } from '../theme'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const STATUS_COLOR = {
  queued: '#888888',
  downloading: '#4499ff',
  processing: '#4499ff',
  generating_metadata: '#4499ff',
  uploading: '#4499ff',
  posting: '#ffaa00',
  posted: '#00cc66',
  failed: '#ff4444',
}

const STATUS_LABEL = {
  queued: 'Queued',
  downloading: 'Downloading...',
  processing: 'Processing video...',
  generating_metadata: 'Generating metadata...',
  uploading: 'Uploading...',
  posting: 'Posting to TikTok...',
  posted: 'Posted ✓',
  failed: 'Failed',
}

export default function JobCard({ job, theme }) {
  const t = theme === 'dark' ? dark : light
  const color = STATUS_COLOR[job.status] || t.subtext

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 12,
      padding: '14px 16px',
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <p style={{ margin: 0, fontSize: 13, color: t.subtext, wordBreak: 'break-all', flex: 1 }}>
          {job.url.length > 60 ? job.url.slice(0, 60) + '…' : job.url}
        </p>
        <span style={{ fontSize: 12, color, whiteSpace: 'nowrap', fontWeight: 500 }}>
          {STATUS_LABEL[job.status] || job.status}
        </span>
      </div>
      {job.title && (
        <p style={{ margin: '8px 0 0', fontSize: 14, color: t.text, fontWeight: 500 }}>{job.title}</p>
      )}
      {job.tags && job.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {job.tags.map(tag => (
            <span key={tag} style={{ fontSize: 11, color: t.subtext, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 4, padding: '2px 6px' }}>#{tag}</span>
          ))}
        </div>
      )}
      {job.error_message && (
        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#ff4444' }}>⚠ {job.error_message}</p>
      )}
      {job.tiktok_post_url && (
        <a href={job.tiktok_post_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: t.info }}>
          View on TikTok →
        </a>
      )}
      <p style={{ margin: '6px 0 0', fontSize: 11, color: t.subtext }}>
        {dayjs(job.created_at).fromNow()}
        {job.scheduled_time ? ` · Scheduled: ${dayjs(job.scheduled_time).format('MMM D, h:mm A')}` : ''}
      </p>
    </div>
  )
}