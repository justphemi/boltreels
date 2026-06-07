
const BASE = import.meta.env.VITE_API_URL

async function request(path, opts = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    // Use backend's detailed error message directly
    const msg = data?.detail || data?.message || `Request failed (${res.status})`
    throw new Error(msg)
  }
  return data
}

export const api = {
  health: () => request('/health'),
  login: (email, password) => request('/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password })
  }),
  resetPassword: (email) => request('/auth/reset-password', {
    method: 'POST', body: JSON.stringify({ email })
  }),
  submitJob: (token, payload) => request('/jobs/submit', {
    method: 'POST', body: JSON.stringify(payload)
  }, token),
  listJobs: (token) => request('/jobs/list', {}, token),
  getJob: (token, id) => request(`/jobs/${id}`, {}, token),
  getTikTokConnectUrl: (token) => request('/tiktok/connect', {}, token),
  getTikTokAccounts: (token) => request('/tiktok/accounts', {}, token),
}