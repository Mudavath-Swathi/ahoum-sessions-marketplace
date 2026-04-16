import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { sessionsAPI } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import BookingModal from '../components/BookingModal.jsx'
import { ArrowLeft, Star, Clock, Users, Award, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const { data: session, isLoading, isError } = useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionsAPI.getOne(id).then(r => r.data),
  })

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a session')
      navigate('/login')
      return
    }
    if (!selectedSlot) {
      toast.error('Please select a time slot first')
      return
    }
    setShowModal(true)
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0EBE0', padding: '40px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ height: '20px', background: '#E8E0D0', borderRadius: '8px', width: '120px', marginBottom: '32px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '40px' }}>
            <div>
              <div style={{ height: '14px', background: '#E8E0D0', borderRadius: '4px', width: '80px', marginBottom: '16px' }} />
              <div style={{ height: '48px', background: '#E8E0D0', borderRadius: '8px', width: '70%', marginBottom: '16px' }} />
              <div style={{ height: '14px', background: '#E8E0D0', borderRadius: '4px', marginBottom: '8px' }} />
              <div style={{ height: '14px', background: '#E8E0D0', borderRadius: '4px', width: '80%' }} />
            </div>
            <div style={{ height: '320px', background: '#E8E0D0', borderRadius: '16px' }} />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !session) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0EBE0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>🌿</div>
        <p style={{ color: '#2D5016', fontSize: '15px' }}>Session not found.</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', borderRadius: '99px', border: '1px solid #1B4332', background: 'transparent', color: '#1B4332', fontSize: '13px', cursor: 'pointer' }}>
          Back to catalog
        </button>
      </div>
    )
  }

  const EMOJI = { meditation: '🧘', yoga: '🌙', sound: '🌊', breathwork: '🌬️', coaching: '🌿' }
  const CATBG = { meditation: '#E8F5E9', yoga: '#E8F5EE', sound: '#EAF4F0', breathwork: '#E8F0F5', coaching: '#F0F5E8' }

  return (
    <div style={{ minHeight: '100vh', background: '#F0EBE0' }}>

      {/* hero banner */}
      <div style={{
        background: CATBG[session.category] || '#EBF5EE',
        borderBottom: '1px solid rgba(27,67,50,0.1)',
        padding: '48px 24px 40px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', border: 'none',
              color: '#1B4332', fontSize: '14px', cursor: 'pointer',
              marginBottom: '24px', padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            Back to catalog
          </button>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* emoji icon */}
            <div style={{
              width: '100px', height: '100px', borderRadius: '20px',
              background: '#fff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '52px',
              boxShadow: '0 4px 16px rgba(27,67,50,0.1)',
              flexShrink: 0,
            }}>
              {EMOJI[session.category] || '✨'}
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <span style={{
                fontSize: '11px', padding: '4px 12px',
                borderRadius: '99px', background: 'rgba(27,67,50,0.1)',
                color: '#1B4332', border: '1px solid rgba(27,67,50,0.2)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                fontWeight: 500, marginBottom: '12px', display: 'inline-block',
              }}>
                {session.category}
              </span>

              <h1 style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '36px', fontWeight: 300,
                color: '#0D1F0D', marginBottom: '14px', lineHeight: 1.2,
              }}>
                {session.title}
              </h1>

              {/* meta chips */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {[
                  { icon: <Clock size={13} />, label: `${session.duration} min` },
                  { icon: <Users size={13} />, label: session.level || 'All levels' },
                  { icon: <Award size={13} />, label: 'Certificate' },
                  { icon: <Calendar size={13} />, label: 'Online' },
                ].map(chip => (
                  <div key={chip.label} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 14px', borderRadius: '99px',
                    background: '#fff', border: '1px solid rgba(27,67,50,0.12)',
                    fontSize: '12px', color: '#2D5016',
                  }}>
                    <span style={{ color: '#1B4332' }}>{chip.icon}</span>
                    {chip.label}
                  </div>
                ))}
              </div>

              {/* rating */}
              {session.avg_rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} style={{
                      color: '#C9A84C',
                      fill: i < Math.round(session.avg_rating) ? '#C9A84C' : 'none',
                    }} />
                  ))}
                  <span style={{ color: '#C9A84C', fontSize: '14px', fontWeight: 500 }}>
                    {Number(session.avg_rating).toFixed(1)}
                  </span>
                  <span style={{ color: '#4A7C2F', fontSize: '13px' }}>
                    · {session.total_bookings || 0} bookings
                  </span>
                </div>
              )}

              {/* creator */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', background: '#fff',
                borderRadius: '12px', border: '1px solid rgba(27,67,50,0.1)',
                maxWidth: '320px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#F8F4EE', fontWeight: 500, fontSize: '14px', flexShrink: 0,
                }}>
                  {session.creator_name?.charAt(0) || 'G'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#0D1F0D' }}>
                    {session.creator_name || 'Guide'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4A7C2F' }}>
                    Certified instructor · Verified guide
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>

          {/* left */}
          <div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '24px', fontWeight: 300, color: '#0D1F0D', marginBottom: '14px',
            }}>
              About this session
            </h2>
            <p style={{ fontSize: '15px', color: '#2D4A2D', lineHeight: 1.8, marginBottom: '32px' }}>
              {session.description}
            </p>

            {session.learning_points?.length > 0 && (
              <>
                <h2 style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '24px', fontWeight: 300, color: '#0D1F0D', marginBottom: '14px',
                }}>
                  What you will learn
                </h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {session.learning_points.map((point, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      fontSize: '14px', color: '#2D4A2D', marginBottom: '10px', lineHeight: 1.6,
                    }}>
                      <span style={{ color: '#1B4332', marginTop: '2px', flexShrink: 0 }}>✦</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* booking card */}
          <div style={{
            background: '#fff',
            border: '1px solid rgba(27,67,50,0.12)',
            borderRadius: '20px', padding: '24px',
            position: 'sticky', top: '80px',
            boxShadow: '0 4px 24px rgba(27,67,50,0.08)',
          }}>
            <div style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '34px', fontWeight: 300, color: '#1B4332', marginBottom: '4px',
            }}>
              ₹{Number(session.price).toLocaleString('en-IN')}
              <span style={{ fontSize: '14px', color: '#4A7C2F', fontFamily: 'Inter', fontWeight: 300 }}> / session</span>
            </div>
            <p style={{ fontSize: '12px', color: '#4A7C2F', marginBottom: '20px' }}>
              Free cancellation up to 24hrs before
            </p>

            <p style={{
              fontSize: '11px', color: '#4A7C2F',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              fontWeight: 500, marginBottom: '10px',
            }}>
              Select a time slot
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {(session.available_slots?.length > 0
                ? session.available_slots
                : ['Mon 9:00 am', 'Mon 2:00 pm', 'Tue 4:00 pm', 'Wed 8:00 am']
              ).map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(slot?.label || slot)}
                  style={{
                    padding: '9px 8px', borderRadius: '10px',
                    fontSize: '12px', cursor: 'pointer',
                    border: selectedSlot === (slot?.label || slot)
                      ? '2px solid #1B4332'
                      : '1px solid rgba(27,67,50,0.2)',
                    background: selectedSlot === (slot?.label || slot)
                      ? 'rgba(27,67,50,0.06)'
                      : '#fff',
                    color: selectedSlot === (slot?.label || slot)
                      ? '#1B4332'
                      : '#2D5016',
                    fontWeight: selectedSlot === (slot?.label || slot) ? 500 : 400,
                  }}
                >
                  {slot?.label || slot}
                </button>
              ))}
            </div>

            <button
              onClick={handleBookNow}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '12px', border: 'none',
                background: '#1B4332', color: '#F8F4EE',
                fontSize: '15px', fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(27,67,50,0.25)',
              }}
            >
              Book now
            </button>

            <div style={{
              display: 'flex', justifyContent: 'center',
              gap: '16px', marginTop: '14px',
            }}>
              {['Verified guide', 'Secure payment', 'Free cancel'].map(b => (
                <span key={b} style={{ fontSize: '11px', color: '#4A7C2F' }}>✓ {b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <BookingModal
          session={session}
          selectedSlot={selectedSlot}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}