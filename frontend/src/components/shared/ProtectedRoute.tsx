import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/auth/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}

export function PublicOnlyRoute({ 
  children, 
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || redirectTo
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}
