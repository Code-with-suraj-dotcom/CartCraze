import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>
  }

  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute