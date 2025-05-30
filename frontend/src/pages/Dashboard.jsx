import React from 'react'
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Candidate Dashboard</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by Name or Passport No"
            className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/3"
          />
          <select className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/4">
            <option value="">Filter by Status</option>
            <option value="medical">Medical Done</option>
            <option value="visa">Visa Approved</option>
            <option value="ticketed">Ticket Issued</option>
          </select>
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
              {/* Candidate rows will be inserted here */}
              <tr className="border-b">
                <td className="px-6 py-4">Jane Doe</td>
                <td className="px-6 py-4">N1234567</td>
                <td className="px-6 py-4">991234567V</td>
                <td className="px-6 py-4">HMK-0001</td>
                <td className="px-6 py-4">Medical Done</td>
                <td className="px-6 py-4">
                <button className="text-blue-600 hover:underline">
                    {/* <Link to={`/tracker/${id}`} className="text-blue-600 hover:underline"> */}
                    View
                    {/* </Link> */}
                </button>
                </td>
              </tr>
              {/* more rows will come here dynamically */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
