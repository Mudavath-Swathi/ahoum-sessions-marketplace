import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, logout, isCreator } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const dashPath = isCreator ? '/creator' : '/dashboard'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(248,244,238,0.97)',
      borderBottom: '1px solid rgba(27,67,50,0.12)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '24px', fontWeight: 300, fontStyle: 'italic',
          color: '#1B4332', textDecoration: 'none', letterSpacing: '0.05em',
        }}>
          ·ahoum
        </Link>

        <div style={{ display: 'flex', gap: '4px' }}>
          <Link to="/" style={{
            padding: '6px 16px', borderRadius: '20px',
            fontSize: '14px', color: '#2D5016', textDecoration: 'none',
            fontWeight: 400,
          }}>
            Browse
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isAuthenticated ? (
            <>
              <button onClick={() => navigate('/login')} style={{
                background: 'transparent',
                border: '1px solid rgba(27,67,50,0.3)',
                borderRadius: '20px', padding: '8px 20px',
                color: '#1B4332', fontSize: '14px', cursor: 'pointer',
              }}>
                Sign in
              </button>
              <button onClick={() => navigate('/login')} style={{
                background: '#1B4332', border: 'none',
                borderRadius: '20px', padding: '8px 20px',
                color: '#F8F4EE', fontSize: '14px',
                fontWeight: 500, cursor: 'pointer',
              }}>
                Get started
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px', padding: '3px 12px',
                borderRadius: '99px',
                background: 'rgba(27,67,50,0.1)',
                color: '#1B4332',
                border: '1px solid rgba(27,67,50,0.2)',
              }}>
                {isCreator ? 'Guide' : 'Seeker'}
              </span>
              <button onClick={() => navigate(dashPath)} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'transparent',
                border: '1px solid rgba(27,67,50,0.2)',
                borderRadius: '20px', padding: '7px 16px',
                color: '#2D5016', fontSize: '13px', cursor: 'pointer',
              }}>
                <LayoutDashboard size={14} />
                Dashboard
              </button>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '4px 12px 4px 4px',
                borderRadius: '20px',
                border: '1px solid rgba(27,67,50,0.15)',
                background: '#fff',
              }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px', fontWeight: 500, color: '#F8F4EE',
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '13px', color: '#2D5016' }}>
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
              </div>
              <button onClick={logout} style={{
                background: 'transparent', border: 'none',
                color: '#4A7C2F', cursor: 'pointer', padding: '6px',
                display: 'flex', alignItems: 'center',
              }}>
                <LogOut size={16} />
              </button>
            </div>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} id="mobile-toggle" style={{
            display: 'none', background: 'transparent',
            border: 'none', color: '#1B4332', cursor: 'pointer', padding: '4px',
          }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          background: '#fff', borderTop: '1px solid rgba(27,67,50,0.1)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: '#2D5016', textDecoration: 'none', fontSize: '14px' }}>Browse sessions</Link>
          {isAuthenticated ? (
            <>
              <Link to={dashPath} onClick={() => setMenuOpen(false)} style={{ color: '#2D5016', textDecoration: 'none', fontSize: '14px' }}>Dashboard</Link>
              <button onClick={() => { logout(); setMenuOpen(false) }} style={{ background: 'transparent', border: 'none', color: '#4A7C2F', fontSize: '14px', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Sign out</button>
            </>
          ) : (
            <button onClick={() => { navigate('/login'); setMenuOpen(false) }} style={{ background: '#1B4332', border: 'none', borderRadius: '20px', padding: '10px 20px', color: '#F8F4EE', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Sign in</button>
          )}
        </div>
      )}
      <style>{`@media(max-width:640px){#mobile-toggle{display:flex!important;}}`}</style>
    </nav>
  )
}