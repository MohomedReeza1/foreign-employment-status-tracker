import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Header from '../components/Header'

const CandidateProcessTracker = ({ candidateId }) => {
  const [form, setForm] = useState({});
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const { role } = useAuth()

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // ✅ Fetch candidate basic info
        const candidateRes = await api.get(`/candidates/${candidateId}`)
        setCandidate(candidateRes.data)

        const res = await api.get(`/candidate-details/${candidateId}`);
        setForm(res.data);

      } catch (err) {
        console.error("Error fetching candidate details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [candidateId]);

  const handleUpdate = async (field, value) => {
    try {
        const res = await api.put(`/candidate-details/${candidateId}`, {
            [field]: value,
        });
        setForm((prev) => ({ ...prev, ...res.data }));
    //   const res = await fetch(`/api/candidate-details/${candidateId}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ [field]: value }),
    //   });
    //   const data = await res.json();
    //   setForm((prev) => ({ ...prev, ...data }));
    
    } catch (err) {
      console.error("Error updating field:", err);
    }
  };

  const renderUpdatedAt = (field) =>
    form[`${field}_updated_at`]
      ? new Date(form[`${field}_updated_at`]).toLocaleString()
      : "-";

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
        </div>  
        <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">Candidate Process Tracker</h2>

        {candidate && (
            <div className="bg-white p-4 rounded shadow mb-6 flex justify-between items-center">
                <p><strong>Full Name:</strong> {candidate.full_name}</p>
                <p><strong>Passport No:</strong> {candidate.passport_number}</p>
                <p><strong>NIC:</strong> {candidate.nic}</p>
                <p><strong>Reference No:</strong> {candidate.reference_number}</p>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputRow label="Passport Register Date">
            <input
                type="date"
                value={form.passport_register_date || ""}
                onChange={(e) => handleUpdate("passport_register_date", e.target.value)}
                className="input-style"
            />
            {renderUpdatedAt("passport_register_date")}
            </InputRow>

            <InputRow label="Application Sent Date">
            <input
                type="date"
                value={form.application_sent_date || ""}
                onChange={(e) => handleUpdate("application_sent_date", e.target.value)}
                className="input-style"
            />
            {renderUpdatedAt("application_sent_date")}
            </InputRow>

            <InputRow label="Applied Job">
            <select
                value={form.applied_job || ""}
                onChange={(e) => handleUpdate("applied_job", e.target.value)}
                className="input-style"
            >
                <option value="">-- Select --</option>
                <option value="Housemaid">Housemaid</option>
                <option value="Cook">Cook</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Nurse">Nurse</option>
            </select>
            {renderUpdatedAt("applied_job")}
            </InputRow>

            <InputRow label="Office Name">
            <select
                value={form.office_name || ""}
                onChange={(e) => handleUpdate("office_name", e.target.value)}
                className="input-style"
            >
                <option value="">-- Select --</option>
                <option value="KANDARI">KANDARI</option>
                <option value="FADAK">FADAK</option>
            </select>
            {renderUpdatedAt("office_name")}
            </InputRow>

            <InputRow label="Visa Status">
            <select
                value={form.visa_status || ""}
                onChange={(e) => handleUpdate("visa_status", e.target.value)}
                className="input-style"
            >
                <option value="">-- Select --</option>
                <option value="Waiting for Visa">Waiting for Visa</option>
                <option value="Keep Ready">Keep Ready</option>
                <option value="Received">Received</option>
                <option value="Cancel">Cancel</option>
            </select>
            {renderUpdatedAt("visa_status")}
            </InputRow>

            <InputRow label="Medical">
            <select
                value={form.medical || ""}
                onChange={(e) => handleUpdate("medical", e.target.value)}
                className="input-style"
            >
                <option value="">-- Select --</option>
                <option value="Pending">Pending</option>
                <option value="Recheck">Recheck</option>
                <option value="Fit">Fit</option>
                <option value="Unfit">Unfit</option>
            </select>
            {renderUpdatedAt("medical")}
            </InputRow>

            <InputRow label="Agreement">
            <select
                value={form.agreement || ""}
                onChange={(e) => handleUpdate("agreement", e.target.value)}
                className="input-style"
            >
                <option value="">-- Select --</option>
                <option value="Hold">Hold</option>
                <option value="Need Agreement">Need Agreement</option>
                <option value="Done">Done</option>
            </select>
            {renderUpdatedAt("agreement")}
            </InputRow>

            <InputRow label="Embassy">
            <select
                value={form.embassy || ""}
                onChange={(e) => handleUpdate("embassy", e.target.value)}
                className="input-style"
            >
                <option value="">-- Select --</option>
                <option value="Done">Done</option>
                <option value="Not Done">Not Done</option>
            </select>
            {renderUpdatedAt("embassy")}
            </InputRow>

            <InputRow label="SLBFE Approval">
            <input
                type="checkbox"
                checked={form.slbfe_approval || false}
                onChange={(e) => handleUpdate("slbfe_approval", e.target.checked)}
                className="h-5 w-5"
            />
            {renderUpdatedAt("slbfe_approval")}
            </InputRow>

            <InputRow label="Departure Date">
            <input
                type="date"
                value={form.departure_date || ""}
                onChange={(e) => handleUpdate("departure_date", e.target.value)}
                className="input-style"
            />
            {renderUpdatedAt("departure_date")}
            </InputRow>
      </div>

      {/* Remarks */}
      <div className="mt-6">
        <label className="block font-medium mb-1 text-gray-700">Remarks</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring focus:ring-indigo-200"
          rows={4}
          value={form.remarks || ""}
          onChange={(e) => handleUpdate("remarks", e.target.value)}
        />
      </div>
    </div>
    </>
  );
};

const InputRow = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      {children[0]}
      <span className="text-sm text-gray-500 whitespace-nowrap">{children[1]}</span>
    </div>
  </div>
);

export default CandidateProcessTracker;