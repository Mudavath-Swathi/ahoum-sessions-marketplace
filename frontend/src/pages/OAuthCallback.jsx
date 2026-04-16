import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { authAPI } from '../api/client.js'
import toast from 'react-hot-toast'

export default function OAuthCallback({ provider }) {
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()
  const called = useRef(false)

  useEffect(() => {
    // prevent double call in React StrictMode
    if (called.current) return
    called.current = true

    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error || !code) {
      toast.error('OAuth login failed. Please try again.')
      navigate('/login')
      return
    }

    handleCallback(code)
  }, [])

  const handleCallback = async (code) => {
    try {
      // send code to our Django backend
      const response = provider === 'google'
        ? await authAPI.googleCallback(code)
        : await authAPI.githubCallback(code)

      const { access, user } = response.data

      // save token + user, redirect to dashboard
      loginWithToken(access, user)

    } catch (err) {
      console.error('OAuth callback error:', err)
      toast.error('Login failed. Please try again.')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center gap-5">
      <div className="text-5xl">🪷</div>
      <div className="w-10 h-10 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-[#EDE8DC] text-sm">
          Signing you in with {provider === 'google' ? 'Google' : 'GitHub'}...
        </p>
        <p className="text-[#5A5248] text-xs mt-1">
          Please wait
        </p>
      </div>
    </div>
  )
}