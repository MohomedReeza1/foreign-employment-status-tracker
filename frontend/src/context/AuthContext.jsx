import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedRole = localStorage.getItem('role')
    if (savedToken) {
      setToken(savedToken)
      setRole(savedRole)
    }
  }, [])

  const login = (newToken, userRole) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', userRole)
    setToken(newToken)
    setRole(userRole)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
