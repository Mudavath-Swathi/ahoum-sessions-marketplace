import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext.jsx'
import { bookingsAPI, authAPI } from '../api/client.js'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, User, LogOut, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'My Bookings', icon: CalendarDays },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function UserDashboard() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div style={{ minHeight: '100vh', background: '#F0EBE0', display: 'flex' }}>
      <aside style={{
        width: '220px', background: '#fff', flexShrink: 0,
        borderRight: '1px solid rgba(27,67,50,0.1)',
        padding: '24px 0', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid rgba(27,67,50,0.08)', marginBottom: '16px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#F8F4EE', fontWeight: 500, fontSize: '16px', marginBottom: '10px',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#0D1F0D' }}>{user?.name || 'User'}</p>
          <p style={{ fontSize: '12px', color: '#4A7C2F', marginTop: '2px' }}>Seeker · Free plan</p>
        </div>

        <nav style={{ flex: 1, padding: '0 10px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A0B89A', padding: '0 8px', marginBottom: '8px' }}>Overview</p>
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '10px', padding: '9px 12px', borderRadius: '10px',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: '13px', marginBottom: '2px',
                background: activeTab === tab.id ? 'rgba(27,67,50,0.08)' : 'transparent',
                color: activeTab === tab.id ? '#1B4332' : '#4A7C2F',
                fontWeight: activeTab === tab.id ? 500 : 400,
              }}>
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A0B89A', padding: '0 8px', marginBottom: '8px' }}>Discover</p>
            <button onClick={() => navigate('/')} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '10px', padding: '9px 12px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', background: 'transparent',
              color: '#4A7C2F', fontSize: '13px', textAlign: 'left',
            }}>
              <Search size={15} />
              Browse sessions
            </button>
          </div>
        </nav>

        <div style={{ padding: '0 10px' }}>
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: '10px', padding: '9px 12px', borderRadius: '10px',
            border: 'none', cursor: 'pointer', background: 'transparent',
            color: '#4A7C2F', fontSize: '13px', textAlign: 'left',
          }}>
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '7px 16px', borderRadius: '99px',
              fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeTab === tab.id ? '#1B4332' : '#fff',
              color: activeTab === tab.id ? '#F8F4EE' : '#2D5016',
              border: activeTab === tab.id ? 'none' : '1px solid rgba(27,67,50,0.2)',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab user={user} navigate={navigate} />}
        {activeTab === 'bookings' && <BookingsTab />}
        {activeTab === 'profile' && <ProfileTab user={user} updateUser={updateUser} />}
      </main>
    </div>
  )
}

function OverviewTab({ user, navigate }) {
  const { data: rawBookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsAPI.getMyBookings().then(r => r.data),
  })

  const bookingsList = Array.isArray(rawBookings)
    ? rawBookings
    : (rawBookings?.results || [])

  const upcoming = bookingsList.filter(b =>
    b.status === 'confirmed' || b.status === 'pending'
  )
  const total = bookingsList.length
  const spent = bookingsList.reduce((sum, b) =>
    sum + Number(b.session_price || 0), 0
  )

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '32px', fontWeight: 300, color: '#0D1F0D',
        }}>
          Good morning, {user?.name?.split(' ')[0]} 🌿
        </h1>
        <p style={{ color: '#4A7C2F', fontSize: '14px', marginTop: '4px' }}>
          Here is what is happening with your journey
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total bookings', value: total },
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Hours attended', value: `${total}h` },
          { label: 'Amount spent', value: `₹${spent.toLocaleString('en-IN')}` },
        ].map(m => (
          <div key={m.label} style={{
            background: '#fff', border: '1px solid rgba(27,67,50,0.1)',
            borderRadius: '14px', padding: '16px',
            boxShadow: '0 2px 8px rgba(27,67,50,0.04)',
          }}>
            <p style={{ fontSize: '12px', color: '#4A7C2F', marginBottom: '8px' }}>{m.label}</p>
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '28px', fontWeight: 300, color: '#1B4332',
            }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(27,67,50,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#0D1F0D' }}>Upcoming sessions</h2>
          <button onClick={() => navigate('/')} style={{
            fontSize: '12px', padding: '6px 14px', borderRadius: '99px',
            border: '1px solid rgba(27,67,50,0.2)', background: 'transparent',
            color: '#1B4332', cursor: 'pointer',
          }}>Browse more</button>
        </div>

        {isLoading ? (
          <div style={{ padding: '20px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: '40px', background: '#F0F7F2', borderRadius: '8px', marginBottom: '8px' }} />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌿</div>
            <p style={{ color: '#4A7C2F', fontSize: '14px' }}>No upcoming sessions</p>
            <button onClick={() => navigate('/')} style={{
              marginTop: '12px', background: 'none', border: 'none',
              color: '#1B4332', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline',
            }}>Browse sessions →</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
                {['Session', 'Guide', 'Date & time', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 20px', color: '#4A7C2F', fontWeight: 400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcoming.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(27,67,50,0.05)' }}>
                  <td style={{ padding: '12px 20px', color: '#0D1F0D' }}>{b.session_title}</td>
                  <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{b.creator_name}</td>
                  <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{b.slot || '—'}</td>
                  <td style={{ padding: '12px 20px' }}><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function BookingsTab() {
  const queryClient = useQueryClient()
  const { data: rawBookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsAPI.getMyBookings().then(r => r.data),
  })

  const bookingsList = Array.isArray(rawBookings)
    ? rawBookings
    : (rawBookings?.results || [])

  const { mutate: cancelBooking } = useMutation({
    mutationFn: (id) => bookingsAPI.cancel(id),
    onSuccess: () => {
      toast.success('Booking cancelled')
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
    },
    onError: () => toast.error('Could not cancel.'),
  })

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#0D1F0D' }}>My bookings</h1>
        <p style={{ color: '#4A7C2F', fontSize: '14px', marginTop: '4px' }}>All your past and upcoming sessions</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(27,67,50,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#0D1F0D' }}>All bookings</h2>
        </div>

        {isLoading ? (
          <div style={{ padding: '20px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '40px', background: '#F0F7F2', borderRadius: '8px', marginBottom: '8px' }} />
            ))}
          </div>
        ) : bookingsList.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📅</div>
            <p style={{ color: '#4A7C2F', fontSize: '14px' }}>No bookings yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
                  {['Session', 'Guide', 'Date', 'Price', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 20px', color: '#4A7C2F', fontWeight: 400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookingsList.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(27,67,50,0.05)' }}>
                    <td style={{ padding: '12px 20px', color: '#0D1F0D' }}>{b.session_title}</td>
                    <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{b.creator_name}</td>
                    <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{b.slot || '—'}</td>
                    <td style={{ padding: '12px 20px', color: '#1B4332', fontWeight: 500 }}>
                      ₹{Number(b.session_price || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 20px' }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: '12px 20px' }}>
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button onClick={() => cancelBooking(b.id)} style={{
                          fontSize: '11px', padding: '4px 12px', borderRadius: '99px',
                          border: '1px solid rgba(220,74,74,0.3)', background: 'transparent',
                          color: '#E24B4A', cursor: 'pointer',
                        }}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileTab({ user, updateUser }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await authAPI.updateProfile(form)
      updateUser(res.data)
      toast.success('Profile saved!')
    } catch {
      toast.error('Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#0D1F0D' }}>Profile</h1>
        <p style={{ color: '#4A7C2F', fontSize: '14px', marginTop: '4px' }}>Manage your personal details</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(27,67,50,0.1)', borderRadius: '14px', padding: '24px', maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#F8F4EE', fontWeight: 500, fontSize: '20px',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#0D1F0D' }}>{user?.name}</p>
            <p style={{ fontSize: '12px', color: '#4A7C2F', marginTop: '2px' }}>via OAuth · Seeker</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {[
            { label: 'Full name', key: 'name', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Phone', key: 'phone', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4A7C2F', marginBottom: '6px' }}>
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '10px',
                  border: '1px solid rgba(27,67,50,0.2)', background: '#F8FCF8',
                  color: '#0D1F0D', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4A7C2F', marginBottom: '6px' }}>Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            placeholder="Tell guides about yourself…"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '10px',
              border: '1px solid rgba(27,67,50,0.2)', background: '#F8FCF8',
              color: '#0D1F0D', fontSize: '14px', outline: 'none',
              resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '10px 24px', borderRadius: '99px', border: 'none',
            background: '#1B4332', color: '#F8F4EE', fontSize: '13px',
            fontWeight: 500, cursor: 'pointer',
          }}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button
            onClick={() => setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: user?.bio || '' })}
            style={{
              padding: '10px 24px', borderRadius: '99px',
              border: '1px solid rgba(27,67,50,0.2)', background: 'transparent',
              color: '#2D5016', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    confirmed: { background: 'rgba(27,67,50,0.08)', color: '#1B4332', border: '1px solid rgba(27,67,50,0.2)' },
    pending: { background: 'rgba(201,168,76,0.1)', color: '#8A6D28', border: '1px solid rgba(201,168,76,0.3)' },
    cancelled: { background: 'rgba(220,74,74,0.08)', color: '#E24B4A', border: '1px solid rgba(220,74,74,0.2)' },
    upcoming: { background: 'rgba(27,67,50,0.08)', color: '#1B4332', border: '1px solid rgba(27,67,50,0.2)' },
  }
  const s = styles[status] || styles.upcoming
  return (
    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', fontWeight: 500, ...s }}>
      {status}
    </span>
  )
}