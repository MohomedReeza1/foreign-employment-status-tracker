import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

export default function Dashboard() {
  const [candidates, setCandidates] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()
  const { role } = useAuth()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/candidates')
        setCandidates(res.data)
      } catch (error) {
        console.error('Failed to fetch candidates:', error)
      }
    }

    fetchCandidates()
  }, [])

  const filteredCandidates = candidates.filter((c) => {
    const fullName = c.full_name || ''
    const passport = c.passport_number || ''
    const status = c.status || 'Not Started'

    const matchSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      passport.toLowerCase().includes(searchQuery.toLowerCase())

    const matchStatus = statusFilter
      ? status.toLowerCase() === statusFilter.toLowerCase()
      : true

    return matchSearch && matchStatus
  })

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Candidate Dashboard</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap md:flex-nowrap gap-4 items-center justify-between">
          <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto flex-1">
          <input
            type="text"
            placeholder="Search by Name or Passport No"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/3"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/4"
          >
            <option value="">Filter by Status</option>
            <option value="Not Started">Not Started</option>
            <option value="Medical">Medical</option>
            <option value="Visa">Visa</option>
            <option value="SLBFE">SLBFE</option>
            <option value="Ticket">Ticket</option>
            <option value="Post-Departure">Post-Departure</option>
          </select>
          </div>
          

          {role === 'processor' && ( // only processors see this
            <button
            onClick={() => navigate('/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Candidate
          </button>
          )}
          
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 font-medium text-sm">Full Name</th>
                <th className="px-6 py-3 font-medium text-sm">Passport No</th>
                <th className="px-6 py-3 font-medium text-sm">NIC</th>
                <th className="px-6 py-3 font-medium text-sm">Ref No</th>
                <th className="px-6 py-3 font-medium text-sm">Status</th>
                <th className="px-6 py-3 font-medium text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{c.full_name}</td>
                  <td className="px-6 py-4">{c.passport_number}</td>
                  <td className="px-6 py-4">{c.nic}</td>
                  <td className="px-6 py-4">{c.reference_number}</td>
                  <td className="px-6 py-4">{c.status || 'Not Started'}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline">
                      <a href={`/tracker/${c.id}`} className="text-blue-600 hover:underline">View</a>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  )
}
