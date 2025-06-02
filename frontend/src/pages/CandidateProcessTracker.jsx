import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';

const CandidateProcessTracker = ({ candidateId }) => {
  const [form, setForm] = useState({});
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const candidateRes = await api.get(`/candidates/${candidateId}`);
        setCandidate(candidateRes.data);

        const res = await api.get(`/candidate-details/${candidateId}`);
        setForm(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            const createRes = await api.post(`/candidate-details/${candidateId}`);
            setForm(createRes.data);
          } catch (createErr) {
            console.error("Error creating process detail:", createErr);
          }
        } else {
          console.error("Unexpected error:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [candidateId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/candidate-details/${candidateId}`, form);
      setForm(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save changes", err);
    }
  };

  const renderUpdatedAt = (field) =>
    form[`${field}_updated_at`] ? new Date(form[`${field}_updated_at`]).toLocaleString() : "-";

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-blue-600 font-medium hover:underline"
            >
              Edit
            </button>
          )}
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
          {renderInput("Passport Register Date", "passport_register_date", "date")}
          {renderInput("Application Sent Date", "application_sent_date", "date")}
          {renderSelect("Applied Job", "applied_job", ["Housemaid", "Cook", "Caregiver", "Nurse"])}
          {renderSelect("Office Name", "office_name", ["KANDARI", "FADAK"])}
          {renderSelect("Visa Status", "visa_status", ["Waiting for Visa", "Keep Ready", "Received", "Cancel"])}
          {renderSelect("Medical", "medical", ["Pending", "Recheck", "Fit", "Unfit"])}
          {renderSelect("Agreement", "agreement", ["Hold", "Need Agreement", "Done"])}
          {renderSelect("Embassy", "embassy", ["Done", "Not Done"])}
          <InputRow label="SLBFE Approval">
            <input
              type="checkbox"
              checked={form.slbfe_approval ?? false}
              onChange={(e) => handleChange("slbfe_approval", e.target.checked)}
              disabled={!editMode}
              className="h-5 w-5"
            />
            {renderUpdatedAt("slbfe_approval")}
          </InputRow>
          {renderInput("Departure Date", "departure_date", "date")}
        </div>

        <div className="mt-6">
          <label className="block font-medium mb-1 text-gray-700">Remarks</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring focus:ring-indigo-200"
            rows={4}
            value={form.remarks ?? ""}
            onChange={(e) => handleChange("remarks", e.target.value)}
            disabled={!editMode}
          />
        </div>

        {editMode && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </>
  );

  function renderInput(label, field, type = "text") {
    return (
      <InputRow label={label}>
        <input
          type={type}
          value={form[field] ?? ""}
          onChange={(e) => handleChange(field, e.target.value)}
          disabled={!editMode}
          className="input-style"
        />
        {renderUpdatedAt(field)}
      </InputRow>
    );
  }

  function renderSelect(label, field, options) {
    return (
      <InputRow label={label}>
        <select
          value={form[field] ?? ""}
          onChange={(e) => handleChange(field, e.target.value)}
          disabled={!editMode}
          className="input-style"
        >
          <option value="">-- Select --</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {renderUpdatedAt(field)}
      </InputRow>
    );
  }
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
