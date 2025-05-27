import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
