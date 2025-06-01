import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CandidateTracker from './pages/CandidateTracker'
import CandidateForm from './pages/CandidateForm'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/tracker/:id"
        element={
          // <PrivateRoute>
            <CandidateTracker />
          // </PrivateRoute>
        }
      />
      <Route
        path="/add"
        element={
          <PrivateRoute>
            <CandidateForm />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
