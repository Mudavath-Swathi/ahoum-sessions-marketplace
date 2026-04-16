import axios from 'axios'
import { getToken, removeToken, removeUser } from '../utils/tokenStorage.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/api'

// main axios instance
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// request interceptor — attach JWT to every request automatically
client.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// response interceptor — handle token expiry globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired or invalid — clear everything and reload
      removeToken()
      removeUser()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth API ──────────────────────────────────────────────
export const authAPI = {
  // exchange OAuth code for JWT
  googleCallback: (code) =>
    client.post('/auth/google/callback/', { code }),

  githubCallback: (code) =>
    client.post('/auth/github/callback/', { code }),

  // get logged in user profile
  getProfile: () =>
    client.get('/auth/profile/'),

  // update profile
  updateProfile: (data) =>
    client.patch('/auth/profile/', data),
}

// ── Sessions API ──────────────────────────────────────────
export const sessionsAPI = {
  // public — no auth needed
  getAll: (params) =>
    client.get('/sessions/', { params }),

  getOne: (id) =>
    client.get(`/sessions/${id}/`),

  // creator only
  create: (data) =>
    client.post('/sessions/', data),

  update: (id, data) =>
    client.patch(`/sessions/${id}/`, data),

  delete: (id) =>
    client.delete(`/sessions/${id}/`),

  getMySessions: () =>
    client.get('/sessions/my/'),
}

// ── Bookings API ──────────────────────────────────────────
export const bookingsAPI = {
  // user — create booking
  book: (data) =>
    client.post('/bookings/', data),

  // user — get my bookings
  getMyBookings: () =>
    client.get('/bookings/my/'),

  // creator — get bookings for their sessions
  getCreatorBookings: () =>
    client.get('/bookings/creator/'),

  // creator — confirm or decline
  updateStatus: (id, status) =>
    client.patch(`/bookings/${id}/`, { status }),

  // user — cancel
  cancel: (id) =>
    client.patch(`/bookings/${id}/`, { status: 'cancelled' }),
}

export default client