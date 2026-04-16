import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext.jsx'
import { sessionsAPI, bookingsAPI, authAPI } from '../api/client.js'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { LayoutDashboard, Sparkles, Plus, Inbox, LogOut, Search, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'overview',  label: 'Overview',         icon: LayoutDashboard },
  { id: 'sessions',  label: 'My Sessions',      icon: Sparkles },
  { id: 'create',    label: 'Create Session',   icon: Plus },
  { id: 'bookings',  label: 'Booking Requests', icon: Inbox },
]

export default function CreatorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div style={{ minHeight: '100vh', background: '#F0EBE0', display: 'flex' }}>

      {/* sidebar */}
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
            {user?.name?.charAt(0)?.toUpperCase() || 'G'}
          </div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#0D1F0D' }}>{user?.name || 'Guide'}</p>
          <p style={{ fontSize: '12px', color: '#4A7C2F', marginTop: '2px' }}>Guide · Verified ✓</p>
        </div>

        <nav style={{ flex: 1, padding: '0 10px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A0B89A', padding: '0 8px', marginBottom: '8px' }}>Manage</p>
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
              View catalog
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

      {/* main */}
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

        {activeTab === 'overview'  && <OverviewTab user={user} setActiveTab={setActiveTab} />}
        {activeTab === 'sessions'  && <SessionsTab setActiveTab={setActiveTab} />}
        {activeTab === 'create'    && <CreateTab setActiveTab={setActiveTab} />}
        {activeTab === 'bookings'  && <BookingsTab />}
      </main>
    </div>
  )
}

// ── Overview ──────────────────────────────────────────────
function OverviewTab({ user, setActiveTab }) {
  const { data: sessions } = useQuery({
    queryKey: ['my-sessions'],
    queryFn: () => sessionsAPI.getMySessions().then(r => r.data),
  })

  const { data: rawBookings, isLoading } = useQuery({
    queryKey: ['creator-bookings'],
    queryFn: () => bookingsAPI.getCreatorBookings().then(r => r.data),
  })

  const bookingsList = Array.isArray(rawBookings)
    ? rawBookings
    : (rawBookings?.results || [])

  const sessionsList = Array.isArray(sessions)
    ? sessions
    : (sessions?.results || [])

  const earnings = bookingsList
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.session_price || 0), 0)

  const pending = bookingsList.filter(b => b.status === 'pending')

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '32px', fontWeight: 300, color: '#0D1F0D',
        }}>
          Your sacred space 🌟
        </h1>
        <p style={{ color: '#4A7C2F', fontSize: '14px', marginTop: '4px' }}>
          Manage sessions and track your impact
        </p>
      </div>

      {/* metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Sessions published', value: sessionsList.length },
          { label: 'Total bookings',     value: bookingsList.length },
          { label: 'Earnings (MTD)',     value: `₹${earnings.toLocaleString('en-IN')}` },
          { label: 'Pending requests',   value: pending.length },
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

      {/* recent bookings */}
      <div style={{ background: '#fff', border: '1px solid rgba(27,67,50,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#0D1F0D' }}>Recent booking requests</h2>
          <button onClick={() => setActiveTab('bookings')} style={{
            fontSize: '12px', padding: '6px 14px', borderRadius: '99px',
            border: '1px solid rgba(27,67,50,0.2)', background: 'transparent',
            color: '#1B4332', cursor: 'pointer',
          }}>View all</button>
        </div>

        {isLoading ? (
          <div style={{ padding: '20px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: '40px', background: '#F0F7F2', borderRadius: '8px', marginBottom: '8px' }} />
            ))}
          </div>
        ) : bookingsList.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📥</div>
            <p style={{ color: '#4A7C2F', fontSize: '14px' }}>No booking requests yet</p>
            <button onClick={() => setActiveTab('create')} style={{
              marginTop: '12px', background: 'none', border: 'none',
              color: '#1B4332', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline',
            }}>Create your first session →</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
                {['Seeker', 'Session', 'Slot', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 20px', color: '#4A7C2F', fontWeight: 400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookingsList.slice(0, 5).map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(27,67,50,0.05)' }}>
                  <td style={{ padding: '12px 20px', color: '#0D1F0D' }}>{b.user_name}</td>
                  <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{b.session_title}</td>
                  <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{b.slot || '—'}</td>
                  <td style={{ padding: '12px 20px', color: '#1B4332', fontWeight: 500 }}>
                    ₹{Number(b.session_price || 0).toLocaleString('en-IN')}
                  </td>
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

// ── Sessions ──────────────────────────────────────────────
function SessionsTab({ setActiveTab }) {
  const queryClient = useQueryClient()

  const { data: rawSessions, isLoading } = useQuery({
    queryKey: ['my-sessions'],
    queryFn: () => sessionsAPI.getMySessions().then(r => r.data),
  })

  const sessionsList = Array.isArray(rawSessions)
    ? rawSessions
    : (rawSessions?.results || [])

  const { mutate: deleteSession } = useMutation({
    mutationFn: (id) => sessionsAPI.delete(id),
    onSuccess: () => {
      toast.success('Session deleted')
      queryClient.invalidateQueries({ queryKey: ['my-sessions'] })
    },
    onError: () => toast.error('Could not delete session.'),
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#0D1F0D' }}>My sessions</h1>
          <p style={{ color: '#4A7C2F', fontSize: '14px', marginTop: '4px' }}>Published and draft sessions</p>
        </div>
        <button onClick={() => setActiveTab('create')} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '10px 20px', borderRadius: '99px', border: 'none',
          background: '#1B4332', color: '#F8F4EE',
          fontSize: '13px', fontWeight: 500, cursor: 'pointer',
        }}>
          <Plus size={14} />
          New session
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(27,67,50,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '20px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: '40px', background: '#F0F7F2', borderRadius: '8px', marginBottom: '8px' }} />
            ))}
          </div>
        ) : sessionsList.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
            <p style={{ color: '#4A7C2F', fontSize: '14px' }}>No sessions yet</p>
            <button onClick={() => setActiveTab('create')} style={{
              marginTop: '12px', background: 'none', border: 'none',
              color: '#1B4332', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline',
            }}>Create your first session →</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
                {['Title', 'Category', 'Price', 'Bookings', 'Rating', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 20px', color: '#4A7C2F', fontWeight: 400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessionsList.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(27,67,50,0.05)' }}>
                  <td style={{ padding: '12px 20px', color: '#0D1F0D', maxWidth: '200px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                  </td>
                  <td style={{ padding: '12px 20px', color: '#4A7C2F', textTransform: 'capitalize' }}>{s.category}</td>
                  <td style={{ padding: '12px 20px', color: '#1B4332', fontWeight: 500 }}>
                    ₹{Number(s.price).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{s.total_bookings || 0}</td>
                  <td style={{ padding: '12px 20px', color: '#C9A84C' }}>
                    {s.avg_rating ? `★ ${Number(s.avg_rating).toFixed(1)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setActiveTab('create')}
                        title="Edit"
                        style={{
                          width: '28px', height: '28px', borderRadius: '8px',
                          border: '1px solid rgba(27,67,50,0.2)',
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#4A7C2F',
                        }}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${s.title}"?`)) deleteSession(s.id)
                        }}
                        title="Delete"
                        style={{
                          width: '28px', height: '28px', borderRadius: '8px',
                          border: '1px solid rgba(220,74,74,0.25)',
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#E24B4A',
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Create Session ────────────────────────────────────────
function CreateTab({ setActiveTab }) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { mutate: createSession, isPending } = useMutation({
    mutationFn: (data) => sessionsAPI.create(data),
    onSuccess: () => {
      toast.success('Session published!')
      reset()
      queryClient.invalidateQueries({ queryKey: ['my-sessions'] })
      setActiveTab('sessions')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'Could not create session.')
    },
  })

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '10px',
    border: '1px solid rgba(27,67,50,0.2)', background: '#F8FCF8',
    color: '#0D1F0D', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block', fontSize: '11px', textTransform: 'uppercase',
    letterSpacing: '0.08em', color: '#4A7C2F', marginBottom: '6px',
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#0D1F0D' }}>Create a session</h1>
        <p style={{ color: '#4A7C2F', fontSize: '14px', marginTop: '4px' }}>Share your wisdom with seekers</p>
      </div>

      <form onSubmit={handleSubmit(data => createSession(data))}>
        <div style={{ background: '#fff', border: '1px solid rgba(27,67,50,0.1)', borderRadius: '14px', padding: '28px', maxWidth: '720px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* title - full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Session title *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. Vedic Meditation for Beginners"
                style={inputStyle}
              />
              {errors.title && <p style={{ color: '#E24B4A', fontSize: '12px', marginTop: '4px' }}>{errors.title.message}</p>}
            </div>

            {/* category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                {...register('category', { required: 'Required' })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select category</option>
                <option value="meditation">Meditation</option>
                <option value="yoga">Yoga</option>
                <option value="sound">Sound Healing</option>
                <option value="breathwork">Breathwork</option>
                <option value="coaching">Life Coaching</option>
              </select>
              {errors.category && <p style={{ color: '#E24B4A', fontSize: '12px', marginTop: '4px' }}>{errors.category.message}</p>}
            </div>

            {/* level */}
            <div>
              <label style={labelStyle}>Level</label>
              <select {...register('level')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="beginner">Beginner friendly</option>
                <option value="all">All levels</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* price */}
            <div>
              <label style={labelStyle}>Price (₹) *</label>
              <input
                type="number" min="0"
                {...register('price', { required: 'Price is required' })}
                placeholder="1200"
                style={inputStyle}
              />
              {errors.price && <p style={{ color: '#E24B4A', fontSize: '12px', marginTop: '4px' }}>{errors.price.message}</p>}
            </div>

            {/* duration */}
            <div>
              <label style={labelStyle}>Duration (minutes) *</label>
              <input
                type="number" min="15"
                {...register('duration', { required: 'Duration is required' })}
                placeholder="60"
                style={inputStyle}
              />
              {errors.duration && <p style={{ color: '#E24B4A', fontSize: '12px', marginTop: '4px' }}>{errors.duration.message}</p>}
            </div>

            {/* max participants */}
            <div>
              <label style={labelStyle}>Max participants</label>
              <input
                type="number" min="1" defaultValue={1}
                {...register('max_participants')}
                style={inputStyle}
              />
            </div>

            {/* available from */}
            <div>
              <label style={labelStyle}>Available from</label>
              <input type="date" {...register('available_from')} style={inputStyle} />
            </div>

            {/* available to */}
            <div>
              <label style={labelStyle}>Available to</label>
              <input type="date" {...register('available_to')} style={inputStyle} />
            </div>

            {/* description - full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                rows={5}
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your session and what seekers will experience…"
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
              />
              {errors.description && <p style={{ color: '#E24B4A', fontSize: '12px', marginTop: '4px' }}>{errors.description.message}</p>}
            </div>

          </div>

          {/* actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '11px 28px', borderRadius: '99px', border: 'none',
                background: '#1B4332', color: '#F8F4EE',
                fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {isPending ? 'Publishing...' : 'Publish session'}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '11px 28px', borderRadius: '99px',
                border: '1px solid rgba(27,67,50,0.2)', background: 'transparent',
                color: '#2D5016', fontSize: '14px', cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// ── Booking Requests ──────────────────────────────────────
function BookingsTab() {
  const queryClient = useQueryClient()

  const { data: rawBookings, isLoading } = useQuery({
    queryKey: ['creator-bookings'],
    queryFn: () => bookingsAPI.getCreatorBookings().then(r => r.data),
  })

  const bookingsList = Array.isArray(rawBookings)
    ? rawBookings
    : (rawBookings?.results || [])

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => bookingsAPI.updateStatus(id, status),
    onSuccess: (_, vars) => {
      toast.success(`Booking ${vars.status === 'confirmed' ? 'confirmed ✅' : 'declined'}`)
      queryClient.invalidateQueries({ queryKey: ['creator-bookings'] })
    },
    onError: () => toast.error('Could not update booking.'),
  })

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#0D1F0D' }}>Booking requests</h1>
        <p style={{ color: '#4A7C2F', fontSize: '14px', marginTop: '4px' }}>Accept or decline incoming seekers</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(27,67,50,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#0D1F0D' }}>All requests</h2>
        </div>

        {isLoading ? (
          <div style={{ padding: '20px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: '40px', background: '#F0F7F2', borderRadius: '8px', marginBottom: '8px' }} />
            ))}
          </div>
        ) : bookingsList.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📥</div>
            <p style={{ color: '#4A7C2F', fontSize: '14px' }}>No booking requests yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(27,67,50,0.08)' }}>
                  {['Seeker', 'Session', 'Slot', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 20px', color: '#4A7C2F', fontWeight: 400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookingsList.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(27,67,50,0.05)' }}>
                    <td style={{ padding: '12px 20px', color: '#0D1F0D' }}>{b.user_name}</td>
                    <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{b.session_title}</td>
                    <td style={{ padding: '12px 20px', color: '#4A7C2F' }}>{b.slot || '—'}</td>
                    <td style={{ padding: '12px 20px', color: '#1B4332', fontWeight: 500 }}>
                      ₹{Number(b.session_price || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 20px' }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: '12px 20px' }}>
                      {b.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => updateStatus({ id: b.id, status: 'confirmed' })}
                            style={{
                              fontSize: '11px', padding: '5px 14px', borderRadius: '99px',
                              border: '1px solid rgba(27,67,50,0.3)',
                              background: 'rgba(27,67,50,0.06)',
                              color: '#1B4332', cursor: 'pointer', fontWeight: 500,
                            }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateStatus({ id: b.id, status: 'cancelled' })}
                            style={{
                              fontSize: '11px', padding: '5px 14px', borderRadius: '99px',
                              border: '1px solid rgba(220,74,74,0.3)',
                              background: 'transparent', color: '#E24B4A', cursor: 'pointer',
                            }}
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#A0B89A', fontSize: '12px' }}>—</span>
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

// ── Status Badge ──────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    confirmed: { background: 'rgba(27,67,50,0.08)', color: '#1B4332', border: '1px solid rgba(27,67,50,0.2)' },
    pending:   { background: 'rgba(201,168,76,0.1)', color: '#8A6D28', border: '1px solid rgba(201,168,76,0.3)' },
    cancelled: { background: 'rgba(220,74,74,0.08)', color: '#E24B4A', border: '1px solid rgba(220,74,74,0.2)' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', fontWeight: 500, ...s }}>
      {status}
    </span>
  )
}