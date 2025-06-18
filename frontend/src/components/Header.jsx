import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Al Akeem Logo.png'

export default function Header() {
  const { logout, role } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center border-b">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Al Akeem Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-xl font-semibold text-gray-800">
          Al Akeem | Kuwait Tracker
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700">
          Logged in as: <span className="font-bold capitalize">{role}</span>
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
