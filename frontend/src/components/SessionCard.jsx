import { Star, Clock, User } from 'lucide-react'

const CATEGORY_BG = {
  meditation: '#E8F5E9',
  yoga: '#E8F5EE',
  sound: '#EAF4F0',
  breathwork: '#E8F0F5',
  coaching: '#F0F5E8',
}

const CATEGORY_EMOJI = {
  meditation: '🧘',
  yoga: '🌙',
  sound: '🌊',
  breathwork: '🌬️',
  coaching: '🌿',
}

export default function SessionCard({ session, onClick }) {
  const bg = CATEGORY_BG[session.category] || '#EBF5EE'
  const emoji = CATEGORY_EMOJI[session.category] || '✨'

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid rgba(27,67,50,0.12)',
        borderRadius: '16px', overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 8px rgba(27,67,50,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,67,50,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(27,67,50,0.06)'
      }}
    >
      {/* thumbnail */}
      <div style={{
        height: '140px', background: bg,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '52px',
        position: 'relative',
      }}>
        {session.image
          ? <img src={session.image} alt={session.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span>{emoji}</span>
        }
        <span style={{
          position: 'absolute', top: '12px', left: '12px',
          fontSize: '10px', padding: '3px 10px',
          borderRadius: '99px',
          background: 'rgba(27,67,50,0.1)',
          color: '#1B4332', border: '1px solid rgba(27,67,50,0.2)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          fontWeight: 500,
        }}>
          {session.category}
        </span>
      </div>

      {/* body */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '18px', fontWeight: 400,
          color: '#0D1F0D', marginBottom: '8px', lineHeight: 1.3,
        }}>
          {session.title}
        </h3>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#4A7C2F', fontSize: '13px', marginBottom: '10px',
        }}>
          <User size={12} />
          <span>{session.creator_name || 'Guide'}</span>
          <span style={{ color: '#A0B89A' }}>·</span>
          <Clock size={12} />
          <span>{session.duration} min</span>
        </div>

        {session.avg_rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            <Star size={12} style={{ color: '#C9A84C', fill: '#C9A84C' }} />
            <span style={{ color: '#C9A84C', fontSize: '13px', fontWeight: 500 }}>
              {Number(session.avg_rating).toFixed(1)}
            </span>
            <span style={{ color: '#4A7C2F', fontSize: '12px' }}>
              · {session.total_bookings || 0} bookings
            </span>
          </div>
        )}

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(27,67,50,0.08)',
        }}>
          <div>
            <span style={{ color: '#1B4332', fontWeight: 600, fontSize: '17px' }}>
              ₹{Number(session.price).toLocaleString('en-IN')}
            </span>
            <span style={{ color: '#4A7C2F', fontSize: '12px' }}> / session</span>
          </div>
          <span style={{
            fontSize: '12px', padding: '6px 16px',
            borderRadius: '99px',
            background: '#1B4332', color: '#F8F4EE',
            fontWeight: 500,
          }}>
            Book
          </span>
        </div>
      </div>
    </div>
  )
}