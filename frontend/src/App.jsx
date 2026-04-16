import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import SessionDetail from './pages/SessionDetail.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import CreatorDashboard from './pages/CreatorDashboard.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', background: '#0B0F1A' }}>
          <Navbar />
          <Routes>

            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback/google" element={<OAuthCallback provider="google" />} />
            <Route path="/auth/callback/github" element={<OAuthCallback provider="github" />} />
            <Route path="/sessions/:id" element={<SessionDetail />} />

            {/* user only */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* creator only */}
            <Route
              path="/creator"
              element={
                <ProtectedRoute allowedRoles={['creator']}>
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />

            {/* catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}