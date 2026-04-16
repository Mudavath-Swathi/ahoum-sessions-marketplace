const TOKEN_KEY = 'ahoum_token'
const USER_KEY = 'ahoum_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setUser = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData))
}

export const removeUser = () => localStorage.removeItem(USER_KEY)

export const isTokenExpired = () => {
  const token = getToken()
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}