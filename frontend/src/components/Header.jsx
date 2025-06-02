import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="bg-white shadow p-4 mb-4 flex justify-between items-center">
      <div className="text-gray-800 font-semibold text-lg">
        Kuwait Recruitment Tracker
      </div>
      <div className="flex items-center gap-4">
        {role && (
          <span className="text-sm text-gray-600">
            Logged in as: <span className="font-bold capitalize">{role}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
