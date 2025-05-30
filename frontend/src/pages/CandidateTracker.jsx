import React from 'react'
import { useParams } from 'react-router-dom'

export default function CandidateTracker() {
  const { id } = useParams()

  // Mock data (replace with real fetch later)
  const candidate = {
    fullName: 'Jane Doe',
    passport: 'N1234567',
    nic: '991234567V',
    refNo: 'HMK-0001',
    stages: [
      { stage: 'Medical', status: 'Completed', date: '2024-06-01' },
      { stage: 'Visa', status: 'In Progress', date: '-' },
      { stage: 'SLBFE', status: 'Pending', date: '-' },
      { stage: 'Embassy', status: 'Pending', date: '-' },
      { stage: 'Ticket', status: 'Pending', date: '-' },
      { stage: 'Post-Departure', status: 'Pending', date: '-' },
    ]
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Candidate Tracker</h2>

        <div className="bg-white p-4 rounded shadow mb-6">
          <p><strong>Full Name:</strong> {candidate.fullName}</p>
          <p><strong>Passport No:</strong> {candidate.passport}</p>
          <p><strong>NIC:</strong> {candidate.nic}</p>
          <p><strong>Reference No:</strong> {candidate.refNo}</p>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 text-sm">
              <tr>
                <th className="px-6 py-3 text-left">Stage</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {candidate.stages.map((stage, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{stage.stage}</td>
                  <td className="px-6 py-4">{stage.status}</td>
                  <td className="px-6 py-4">{stage.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
