import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../utils/tokenStorage.js'
import { authAPI } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // on app load — check if token exists and load user
  useEffect(() => {
    const savedUser = getUser()
    const token = getToken()
    if (savedUser && token) {
      setUserState(savedUser)
    }
    setLoading(false)
  }, [])

  // called after OAuth callback — receives JWT from backend
  const loginWithToken = (token, userData) => {
    setToken(token)
    setUser(userData)
    setUserState(userData)
    toast.success(`Welcome back, ${userData.name || 'friend'} 🪷`)

    // redirect based on role
    if (userData.role === 'creator') {
      navigate('/creator')
    } else {
      navigate('/dashboard')
    }
  }

  const logout = () => {
    removeToken()
    removeUser()
    setUserState(null)
    toast.success('Signed out successfully')
    navigate('/')
  }

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData }
    setUser(merged)
    setUserState(merged)
  }

  const isAuthenticated = !!user
  const isCreator = user?.role === 'creator'
  const isUser = user?.role === 'user'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isCreator,
        isUser,
        loginWithToken,
        logout,
        updateUser,
      }}
    >
      {/* don't render app until we know auth state */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}