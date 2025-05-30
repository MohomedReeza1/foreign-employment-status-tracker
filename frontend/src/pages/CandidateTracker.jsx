import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

export default function CandidateTracker() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [processes, setProcesses] = useState([])

  useEffect(() => {
    const fetchTrackerData = async () => {
      try {
        // ✅ Fetch candidate basic info
        const candidateRes = await api.get(`/candidates/${id}`)
        setCandidate(candidateRes.data)

        // ✅ Fetch candidate process stages
        const processRes = await api.get(`/candidate-process/${id}`)
        setProcesses(processRes.data)
      } catch (err) {
        console.error('Failed to load tracker:', err)
      }
    }

    fetchTrackerData()
  }, [id])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Candidate Tracker</h2>

        {candidate && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <p><strong>Full Name:</strong> {candidate.full_name}</p>
            <p><strong>Passport No:</strong> {candidate.passport_number}</p>
            <p><strong>NIC:</strong> {candidate.nic}</p>
            <p><strong>Reference No:</strong> {candidate.reference_number}</p>
          </div>
        )}

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 text-sm">
              <tr>
                <th className="px-6 py-3 text-left">Stage</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Updated Date</th>
              </tr>
            </thead>
            
            <tbody>
                {processes.map((p, index) => (
                    <tr key={p.id} className="border-b">
                    <td className="px-6 py-4">{p.stage}</td>

                    <td className="px-6 py-4">
                        <select
                        value={p.status}
                        onChange={async (e) => {
                            const newStatus = e.target.value
                            try {
                            const res = await api.put(`/candidate-process/${p.id}`, {
                                status: newStatus,
                                updated_at: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                            })
                            // Update local state
                            const updated = [...processes]
                            updated[index] = res.data
                            setProcesses(updated)
                            } catch (err) {
                            console.error('Failed to update status', err)
                            alert('Error updating process status.')
                            }
                        }}
                        className="border border-gray-300 p-1 rounded"
                        >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        </select>
                    </td>

                    <td className="px-6 py-4">
                        {new Date(p.updated_at).toLocaleDateString()}
                    </td>
                    </tr>
                ))}
                </tbody>
            
          </table>
        </div>
      </div>
    </div>
  )
}
