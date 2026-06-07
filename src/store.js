import { create } from 'zustand'

// Safe localStorage helpers — never crash on bad/missing values
const getToken = () => {
  try { return localStorage.getItem('br_token') || null } 
  catch { return null }
}

const getUser = () => {
  try {
    const raw = localStorage.getItem('br_user')
    if (!raw || raw === 'undefined' || raw === 'null') return null
    return JSON.parse(raw)
  } catch { return null }
}

export const useStore = create((set, get) => ({
  // Auth
  token: getToken(),
  user: getUser(),

  setAuth: (token, user) => {
    try {
      localStorage.setItem('br_token', token)
      localStorage.setItem('br_user', JSON.stringify(user))
    } catch (e) {
      console.error('Failed to persist auth to localStorage:', e)
    }
    // Set state synchronously — navigation in Login.jsx fires after this resolves
    set({ token, user })
  },

  logout: () => {
    try {
      localStorage.removeItem('br_token')
      localStorage.removeItem('br_user')
    } catch {}
    set({ token: null, user: null })
  },

  // Theme
  theme: (() => {
    try { return localStorage.getItem('br_theme') || 'dark' } 
    catch { return 'dark' }
  })(),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('br_theme', next) } catch {}
    set({ theme: next })
  },

  // Toasts
  toasts: [],
  addToast: (msg, type = 'info') => {
    const id = Date.now()
    set(s => ({ toasts: [...s.toasts, { id, msg, type }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4500)
  },

  // TikTok accounts
  tiktokAccounts: [],
  setTikTokAccounts: (accounts) => set({ tiktokAccounts: accounts }),

  // Jobs
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  upsertJob: (job) => set(s => {
    const exists = s.jobs.find(j => j.id === job.id)
    if (exists) return { jobs: s.jobs.map(j => j.id === job.id ? job : j) }
    return { jobs: [job, ...s.jobs] }
  }),
}))