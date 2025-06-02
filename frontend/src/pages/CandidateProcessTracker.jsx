import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const CandidateProcessTracker = ({ candidateId }) => {
  const [form, setForm] = useState({});
  const [originalForm, setOriginalForm] = useState({});
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
        setOriginalForm(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            const createRes = await api.post(`/candidate-details/${candidateId}`);
            setForm(createRes.data);
            setOriginalForm(createRes.data);
          } catch (createErr) {
            toast.error("Error creating process record");
            setForm({});
          }
        } else {
          toast.error("Unexpected error loading data");
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
      setOriginalForm(res.data);
      setEditMode(false);
      toast.success("Saved successfully!");
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setEditMode(false);
    toast("Edits reverted", { icon: "↩️" });
  };

  const renderUpdatedAt = (field) =>
    form[`${field}_updated_at`]
      ? new Date(form[`${field}_updated_at`]).toLocaleString("en-US", {
          timeZone: "Asia/Colombo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "-";

  const isFieldCompleted = (field) => {
    const value = form[field];
    return value !== null && value !== undefined && value !== "";
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-xl mt-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">← Back to Dashboard</button>
          {role === 'processor' && !editMode && (
            <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Candidate Process Tracker</h2>

        {candidate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded border mb-6">
            <p><strong>Full Name:</strong> {candidate.full_name}</p>
            <p><strong>Passport No:</strong> {candidate.passport_number}</p>
            <p><strong>NIC:</strong> {candidate.nic}</p>
            <p><strong>Reference No:</strong> {candidate.reference_number}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput("Passport Register Date", "passport_register_date", "date")}
          {renderInput("Application Sent Date", "application_sent_date", "date")}
          {renderSelect("Applied Job", "applied_job", ["Housemaid", "Cook", "Caregiver", "Nurse"])}
          {renderSelect("Office Name", "office_name", ["KANDARI", "FADAK"])}
          {renderSelect("Visa Status", "visa_status", ["Waiting for Visa", "Keep Ready", "Received", "Cancel"])}
          {renderSelect("Medical", "medical", ["Pending", "Recheck", "Fit", "Unfit"])}
          {renderSelect("Agreement", "agreement", ["Hold", "Need Agreement", "Done"])}
          {renderSelect("Embassy", "embassy", ["Done", "Not Done"])}
          <InputRow label="SLBFE Approval">
            {editMode ? (
              <input
                type="checkbox"
                checked={form.slbfe_approval ?? false}
                onChange={(e) => handleChange("slbfe_approval", e.target.checked)}
                className={`h-5 w-5 ${isFieldCompleted("slbfe_approval") ? "ring-2 ring-green-400" : ""}`}
              />
            ) : (
              <div
                className={`w-full border rounded px-3 py-2 min-h-[40px] ${
                  isFieldCompleted("slbfe_approval") ? "border-green-500 bg-green-50" : "bg-gray-100"
                } text-gray-700`}
              >
                {form.slbfe_approval ? "✅ Yes" : "❌ No"}
              </div>
            )}
            {renderUpdatedAt("slbfe_approval")}
          </InputRow>
          {renderInput("Departure Date", "departure_date", "date")}
        </div>

        <div className="mt-6">
          <label className="block font-medium mb-1 text-gray-700">Remarks</label>
          {editMode ? (
            <textarea
              className={`w-full border rounded-md p-2 bg-white min-h-[80px] ${
                isFieldCompleted("remarks") ? "border-green-500 bg-green-50" : ""
              }`}
              rows={3}
              value={form.remarks ?? ""}
              onChange={(e) => handleChange("remarks", e.target.value)}
            />
          ) : (
            <div
              className={`w-full border rounded px-3 py-2 min-h-[80px] ${
                isFieldCompleted("remarks") ? "border-green-500 bg-green-50" : "bg-gray-100"
              } text-gray-700`}
            >
              {form.remarks || "—"}
            </div>
          )}
        </div>

        {editMode && (
          <div className="mt-6 flex justify-end gap-4">
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        )}
      </div>
    </>
  );

  function renderInput(label, field, type = "text") {
    const commonClasses = `w-full border rounded px-3 py-2 min-h-[40px] ${
      isFieldCompleted(field) ? "border-green-500 bg-green-50" : "bg-gray-100"
    } text-gray-700`;

    return (
      <InputRow label={label}>
        {editMode ? (
          <input
            type={type}
            value={form[field] ?? ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className={commonClasses}
          />
        ) : (
          <div className={commonClasses}>{form[field] || "—"}</div>
        )}
        {renderUpdatedAt(field)}
      </InputRow>
    );
  }

  function renderSelect(label, field, options) {
    const commonClasses = `w-full border rounded px-3 py-2 min-h-[40px] ${
      isFieldCompleted(field) ? "border-green-500 bg-green-50" : "bg-gray-100"
    } text-gray-700`;

    return (
      <InputRow label={label}>
        {editMode ? (
          <select
            value={form[field] ?? ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className={commonClasses}
          >
            <option value="">-- Select --</option>
            {options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        ) : (
          <div className={commonClasses}>{form[field] || "—"}</div>
        )}
        {renderUpdatedAt(field)}
      </InputRow>
    );
  }
};

const InputRow = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      {children[0]}
      <span className="text-xs text-gray-400 whitespace-nowrap">{children[1]}</span>
    </div>
  </div>
);

export default CandidateProcessTracker;
