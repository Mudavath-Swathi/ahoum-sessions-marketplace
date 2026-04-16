import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin" />
        <p className="text-[#5A5248] text-sm">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'creator') return <Navigate to="/creator" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}