import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

export default function BookingModal({ session, selectedSlot, onClose }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const fee = Math.round(Number(session.price) * 0.05)
  const total = Number(session.price) + fee

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) {
        toast.error('Payment gateway failed to load. Check internet.')
        setLoading(false)
        return
      }

      const token = localStorage.getItem('ahoum_token')
      const orderRes = await axios.post(
        `${API_URL}/payments/create-order/`,
        { session_id: session.id, slot: selectedSlot },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const { order_id, amount, currency } = orderRes.data

      const options = {
        key: RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Ahoum',
        description: session.title,
        order_id,
        handler: async (response) => {
          try {
            await axios.post(
              `${API_URL}/payments/verify/`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                session_id: session.id,
                slot: selectedSlot,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success('🎉 Payment successful! Booking confirmed.')
            onClose()
            navigate('/dashboard')
          } catch {
            toast.error('Payment verification failed.')
          }
        },
        prefill: { name: '', email: '' },
        theme: { color: '#1B4332' },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast('Payment cancelled.')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      setLoading(false)

    } catch (err) {
      toast.error(err?.response?.data?.error || 'Could not initiate payment.')
      setLoading(false)
    }
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(13,31,13,0.4)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 50, padding: '16px',
      }}
    >
      <div style={{
        background: '#fff',
        border: '1px solid rgba(27,67,50,0.12)',
        borderRadius: '20px', padding: '32px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 8px 40px rgba(27,67,50,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '24px', fontWeight: 300, color: '#0D1F0D',
          }}>
            Confirm booking
          </h2>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none',
            color: '#4A7C2F', cursor: 'pointer', padding: '4px',
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{
          background: '#F0F7F2',
          border: '1px solid rgba(27,67,50,0.1)',
          borderRadius: '12px', padding: '16px', marginBottom: '20px',
        }}>
          <h3 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '18px', fontWeight: 300, color: '#0D1F0D', marginBottom: '10px',
          }}>
            {session.title}
          </h3>
          <div style={{ fontSize: '13px', color: '#4A7C2F', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>With {session.creator_name || 'Guide'}</span>
            <span>{selectedSlot?.label || selectedSlot}</span>
            <span>{session.duration} min · Online</span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2D5016', marginBottom: '8px' }}>
            <span>Session fee</span>
            <span>₹{Number(session.price).toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4A7C2F', marginBottom: '12px' }}>
            <span>Platform fee (5%)</span>
            <span>₹{fee.toLocaleString('en-IN')}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '16px', fontWeight: 600, color: '#0D1F0D',
            borderTop: '1px solid rgba(27,67,50,0.1)',
            paddingTop: '12px',
          }}>
            <span>Total</span>
            <span style={{ color: '#1B4332' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', marginBottom: '16px',
          padding: '8px', borderRadius: '8px',
          background: '#F8FCF8', border: '1px solid rgba(27,67,50,0.08)',
        }}>
          <span style={{ fontSize: '12px', color: '#4A7C2F' }}>🔒 Secured by</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#2D5016' }}>Razorpay</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: '1px solid rgba(27,67,50,0.2)',
            background: 'transparent', color: '#2D5016',
            fontSize: '14px', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              flex: 2, padding: '12px',
              borderRadius: '12px', border: 'none',
              background: '#1B4332', color: '#F8F4EE',
              fontSize: '14px', fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Loading...' : `Pay ₹${total.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </div>
  )
}