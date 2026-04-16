import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { sessionsAPI } from '../api/client.js'
import SessionCard from '../components/SessionCard.jsx'
import { Search, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Meditation', value: 'meditation' },
  { label: 'Yoga', value: 'yoga' },
  { label: 'Sound Healing', value: 'sound' },
  { label: 'Breathwork', value: 'breathwork' },
  { label: 'Life Coaching', value: 'coaching' },
]

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sessions', { search, category, sort }],
    queryFn: () => sessionsAPI.getAll({ search, category, ordering: sort }).then(r => r.data),
    staleTime: 1000 * 60 * 3,
  })

  const sessions = data?.results || data || []

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4EE' }}>

      {/* HERO */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '100px 24px 80px', textAlign: 'center',
        background: 'linear-gradient(180deg, #EBF5EE 0%, #F8F4EE 100%)',
        borderBottom: '1px solid rgba(27,67,50,0.08)',
      }}>
        {/* decorative circles */}
        <div style={{
          position: 'absolute', top: '-60px', right: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(27,67,50,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '5%',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(201,168,76,0.06)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(27,67,50,0.08)',
            border: '1px solid rgba(27,67,50,0.15)',
            borderRadius: '99px', padding: '6px 20px',
            fontSize: '11px', color: '#1B4332',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '24px', fontWeight: 500,
          }}>
            Spiritual · Healing · Growth
          </div>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(44px, 6vw, 72px)',
            fontWeight: 300, color: '#0D1F0D',
            lineHeight: 1.1, marginBottom: '24px',
          }}>
            Find clarity.<br />
            <em style={{ color: '#1B4332', fontStyle: 'italic' }}>Move forward</em><br />
            with intention.
          </h1>

          <p style={{
            color: '#2D4A2D', fontSize: '17px',
            fontWeight: 300, lineHeight: 1.8,
            marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px',
          }}>
            Book transformative 1-on-1 sessions with certified guides,
            healers and coaches — verified by Neosophical™ AI.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '14px 32px', borderRadius: '32px',
              border: 'none', background: '#1B4332',
              color: '#F8F4EE', fontSize: '15px',
              fontWeight: 500, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(27,67,50,0.25)',
            }}>
              Get started free
            </button>
            <button
              onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 32px', borderRadius: '32px',
                border: '1.5px solid #1B4332',
                background: 'transparent',
                color: '#1B4332', fontSize: '15px', cursor: 'pointer',
              }}
            >
              Explore sessions
            </button>
          </div>

          {/* stats */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '0', marginTop: '60px',
            background: '#fff', borderRadius: '16px',
            border: '1px solid rgba(27,67,50,0.1)',
            padding: '20px 32px', maxWidth: '480px',
            margin: '60px auto 0', boxShadow: '0 2px 20px rgba(27,67,50,0.06)',
          }}>
            {[
              { num: '240+', label: 'Sessions' },
              { num: '4.9★', label: 'Avg rating' },
              { num: '12k+', label: 'Lives touched' },
            ].map((s, i) => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(27,67,50,0.1)' : 'none',
                padding: '0 20px',
              }}>
                <div style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '28px', color: '#1B4332', fontWeight: 300,
                }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '11px', color: '#4A7C2F', marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* search + sort */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={15} style={{
              position: 'absolute', left: '14px',
              top: '50%', transform: 'translateY(-50%)', color: '#4A7C2F',
            }} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: '40px',
                paddingRight: '16px', paddingTop: '11px', paddingBottom: '11px',
                borderRadius: '12px', border: '1px solid rgba(27,67,50,0.2)',
                background: '#fff', color: '#0D1F0D',
                fontSize: '14px', outline: 'none',
              }}
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              padding: '11px 16px', borderRadius: '12px',
              border: '1px solid rgba(27,67,50,0.2)',
              background: '#fff', color: '#2D5016',
              fontSize: '14px', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* category chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              style={{
                padding: '8px 20px', borderRadius: '99px',
                border: category === cat.value
                  ? '1.5px solid #1B4332'
                  : '1px solid rgba(27,67,50,0.2)',
                background: category === cat.value ? '#1B4332' : '#fff',
                color: category === cat.value ? '#F8F4EE' : '#2D5016',
                fontSize: '13px', cursor: 'pointer', fontWeight: category === cat.value ? 500 : 400,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* heading */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '36px', fontWeight: 300, color: '#0D1F0D',
          }}>
            Explore sessions
          </h2>
          <p style={{ color: '#4A7C2F', fontSize: '14px', marginTop: '6px' }}>
            Handpicked guides, verified by data
          </p>
        </div>

        {/* loading */}
        {isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid rgba(27,67,50,0.1)',
                borderRadius: '16px', overflow: 'hidden',
              }}>
                <div style={{ height: '140px', background: '#EBF5EE' }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '12px', background: '#EBF5EE', borderRadius: '4px', width: '40%', marginBottom: '8px' }} />
                  <div style={{ height: '16px', background: '#EBF5EE', borderRadius: '4px', width: '75%', marginBottom: '8px' }} />
                  <div style={{ height: '12px', background: '#EBF5EE', borderRadius: '4px', width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* error */}
        {isError && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#4A7C2F', fontSize: '14px' }}>Could not load sessions. Is the backend running?</p>
            <button onClick={() => window.location.reload()} style={{
              marginTop: '16px', padding: '10px 24px',
              borderRadius: '99px', border: '1px solid #1B4332',
              background: 'transparent', color: '#1B4332',
              fontSize: '13px', cursor: 'pointer',
            }}>Try again</button>
          </div>
        )}

        {/* empty */}
        {!isLoading && !isError && sessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
            <p style={{ color: '#2D5016', fontSize: '15px' }}>No sessions found.</p>
            <button onClick={() => { setSearch(''); setCategory('') }} style={{
              marginTop: '16px', background: 'none', border: 'none',
              color: '#1B4332', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline',
            }}>Clear filters</button>
          </div>
        )}

        {/* grid */}
        {!isLoading && !isError && sessions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {sessions.map(session => (
              <SessionCard key={session.id} session={session} onClick={() => navigate(`/sessions/${session.id}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}