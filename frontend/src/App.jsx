import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import CandidateTracker from './pages/CandidateTracker'
// import CandidateForm from './pages/CandidateForm'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tracker/:id" element={<CandidateTracker />} />
      <Route path="/add" element={<CandidateForm />} /> */}
    </Routes>
  )
}

export default App
