import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function CandidateForm() {
  const [candidateExists, setCandidateExists] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    passport_number: '',
    reference_number: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/candidates', form)
      alert('Candidate added successfully!')
      navigate('/dashboard') // Redirect only on success
    } catch (error) {
      console.error('Error adding candidate:', error)
      alert('Failed to add candidate.')
    }
  }

  const checkExistingCandidate = async (passport) => {
    if (!passport) return
    try {
      const res = await api.get(`/candidates/search?passport=${passport}`)
      setCandidateExists(!!res.data)
    } catch (err) {
      console.error('Search failed:', err)
      setCandidateExists(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Add New Candidate</h2>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Reference Number First */}
            <div>
              <label className="block mb-1 font-medium">Reference Number</label>
              <input
                name="reference_number"
                value={form.reference_number}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded font-normal"
                required
              />
            </div>

            {/* Passport Number Second */}
            <div>
              <label className="block mb-1 font-medium">Passport Number</label>
              <input
                name="passport_number"
                value={form.passport_number}
                onChange={(e) => {
                  handleChange(e)
                  checkExistingCandidate(e.target.value)
                }}
                className="w-full border border-gray-300 p-2 rounded font-normal"
                required
              />
              {candidateExists && (
                <p className="text-red-600 text-sm mt-1">
                  A candidate with this passport already exists.
                </p>
              )}
            </div>

            {/* Full Name Last */}
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded font-normal"
                required
              />
            </div>

            <button
              type="submit"
              disabled={candidateExists}
              className={`w-full py-2 rounded text-white ${candidateExists ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
