import React, { useState } from 'react'
import api from '../api/axios'

export default function CandidateForm() {
  const [form, setForm] = useState({
    full_name: '',
    passport_number: '',
    nic: '',
    reference_number: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const res = await api.post('/candidates', form)
        alert('Candidate added successfully!')
        setForm({ full_name: '', passport_number: '', nic: '', reference_number: '' }) // Clear form
    } catch (error) {
        console.error('Error adding candidate:', error)
        alert('Failed to add candidate.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Add New Candidate</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded font-normal"
              required
            />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Passport Number
            <input
              name="passport_number"
              value={form.passport_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded font-normal"
              required
            />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">NIC
            <input
              name="nic"
              value={form.nic}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded font-normal"
              required
            />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Reference Number
            <input
              name="reference_number"
              value={form.reference_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded font-normal"
              required
            />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
