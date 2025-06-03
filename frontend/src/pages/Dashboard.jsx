import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { Link } from 'react-router-dom'

const stageLabels = {
  passport_register_date: 'Passport Registered',
  application_sent_date: 'Application Sent',
  applied_job: 'Job Applied',
  office_name: 'Office Selected',
  visa_status: 'Visa Processed',
  medical: 'Medical Done',
  agreement: 'Agreement Signed',
  embassy: 'Embassy Visit',
  slbfe_approval: 'SLBFE Approved',
  departure_date: 'Departed'
}

const badgeColors = {
  'Passport Registered': 'bg-yellow-100 text-yellow-700',
  'Application Sent': 'bg-blue-100 text-blue-700',
  'Job Applied': 'bg-indigo-100 text-indigo-700',
  'Office Selected': 'bg-purple-100 text-purple-700',
  'Visa Processed': 'bg-pink-100 text-pink-700',
  'Medical Done': 'bg-green-100 text-green-700',
  'Agreement Signed': 'bg-orange-100 text-orange-700',
  'Embassy Visit': 'bg-cyan-100 text-cyan-700',
  'SLBFE Approved': 'bg-lime-100 text-lime-700',
  'Departed': 'bg-gray-300 text-black',
  'Not Started': 'bg-red-100 text-red-700'
}

export default function Dashboard() {
  const [candidates, setCandidates] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)

  const navigate = useNavigate()
  const { role } = useAuth()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/candidates/paginated?page=${page}&limit=${limit}`)
        setCandidates(res.data.data)
        setTotal(res.data.total)
      } catch (error) {
        console.error('Failed to fetch candidates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [page, limit])

  const totalPages = Math.ceil(total / limit)

  const getLatestStageLabel = (rawStatus) => {
    return stageLabels[rawStatus] || 'Not Started'
  }

  const getBadgeClass = (label) => {
    return `inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeColors[label] || 'bg-gray-100 text-gray-700'}`
  }

  const getStatusValue = (candidate) => {
    const field = candidate.status
    if (!field) return '—'
    const value = candidate[field]
    if (value === true) return '✅ Yes'
    if (value === false) return '❌ No'
    return value || '—'
  }

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
                <option value="">Filter by Stage</option>
                {Object.values(stageLabels).map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
            {role === 'processor' && (
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
                  <th className="px-6 py-3 font-medium text-sm">Latest Stage</th>
                  <th className="px-6 py-3 font-medium text-sm">Status</th>
                  <th className="px-6 py-3 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  candidates
                    .filter((c) => {
                      const name = c.full_name?.toLowerCase() || ''
                      const passport = c.passport_number?.toLowerCase() || ''
                      const stage = getLatestStageLabel(c.status)
                      const matchSearch = name.includes(searchQuery.toLowerCase()) || passport.includes(searchQuery.toLowerCase())
                      const matchStatus = statusFilter ? stage === statusFilter : true
                      return matchSearch && matchStatus
                    })
                    .map((c, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-6 py-4">{c.full_name}</td>
                        <td className="px-6 py-4">{c.passport_number}</td>
                        <td className="px-6 py-4">{c.nic}</td>
                        <td className="px-6 py-4">{c.reference_number}</td>
                        <td className="px-6 py-4">
                          <span className={getBadgeClass(getLatestStageLabel(c.status))}>
                            {getLatestStageLabel(c.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">{getStatusValue(c)}</td>
                        <td className="px-6 py-4">
                          <Link to={`/candidate/${c.id}/process-tracker`} className="text-blue-600 hover:underline">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
