import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const REDIRECT_BASE = import.meta.env.VITE_REDIRECT_BASE || 'http://localhost:5173'

export default function Login() {
  const { isAuthenticated, isCreator } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('user')

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isCreator ? '/creator' : '/dashboard')
    }
  }, [isAuthenticated])

  const handleGoogle = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${REDIRECT_BASE}/auth/callback/google`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }

  const handleGitHub = () => {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${REDIRECT_BASE}/auth/callback/github`,
      scope: 'read:user user:email',
    })
    window.location.href = `https://github.com/login/oauth/authorize?${params}`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0EBE0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#fff',
        border: '1px solid rgba(27,67,50,0.12)',
        borderRadius: '24px',
        padding: '44px 36px',
        boxShadow: '0 4px 40px rgba(27,67,50,0.08)',
      }}>

        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🪷</div>
          <div style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '28px', fontWeight: 300,
            fontStyle: 'italic', color: '#1B4332',
            marginBottom: '6px',
          }}>
            ·ahoum
          </div>
          <p style={{ color: '#4A7C2F', fontSize: '14px' }}>
            Find clarity. Move forward with intention.
          </p>
        </div>

        {/* step dots */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', marginBottom: '28px',
        }}>
          {[1, 2, 3].map((n, i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                border: i === 0 ? '2px solid #1B4332' : '1.5px solid rgba(27,67,50,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 500,
                color: i === 0 ? '#1B4332' : '#A0B89A',
                background: i === 0 ? 'rgba(27,67,50,0.06)' : 'transparent',
              }}>
                {n}
              </div>
              {i < 2 && <div style={{ width: '32px', height: '1px', background: 'rgba(27,67,50,0.15)' }} />}
            </div>
          ))}
        </div>

        {/* role selector */}
        <p style={{
          fontSize: '11px', color: '#4A7C2F',
          textAlign: 'center', letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: '14px', fontWeight: 500,
        }}>
          I want to
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {[
            { emoji: '🌿', title: 'Seek', hint: 'Book sessions', value: 'user' },
            { emoji: '🌟', title: 'Guide', hint: 'Create & teach', value: 'creator' },
          ].map(r => (
            <div
              key={r.value}
              onClick={() => setRole(r.value)}
              style={{
                padding: '16px 12px', borderRadius: '14px', textAlign: 'center',
                cursor: 'pointer',
                border: role === r.value
                  ? '2px solid #1B4332'
                  : '1px solid rgba(27,67,50,0.15)',
                background: role === r.value
                  ? 'rgba(27,67,50,0.06)'
                  : '#fff',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{r.emoji}</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#0D1F0D' }}>{r.title}</div>
              <div style={{ fontSize: '12px', color: '#4A7C2F', marginTop: '2px' }}>{r.hint}</div>
            </div>
          ))}
        </div>

        {/* divider */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', marginBottom: '16px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(27,67,50,0.1)' }} />
          <span style={{ fontSize: '12px', color: '#4A7C2F' }}>sign in with</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(27,67,50,0.1)' }} />
        </div>

        {/* oauth buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleGoogle}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '12px', padding: '13px 16px', borderRadius: '12px',
              border: '1px solid rgba(27,67,50,0.2)',
              background: '#fff', color: '#0D1F0D',
              fontSize: '14px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F7F2'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleGitHub}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '12px', padding: '13px 16px', borderRadius: '12px',
              border: '1px solid rgba(27,67,50,0.2)',
              background: '#fff', color: '#0D1F0D',
              fontSize: '14px', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F7F2'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0D1F0D">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <p style={{
          color: '#A0B89A', fontSize: '12px',
          textAlign: 'center', marginTop: '20px',
        }}>
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}