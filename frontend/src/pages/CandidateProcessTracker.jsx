import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Header from '../components/Header'

const CandidateProcessTracker = ({ candidateId }) => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const { role } = useAuth()

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/candidate-details/${candidateId}`);
        // const res = await api.get(`/candidate-details/${candidateId}`);
        const data = await res.json();
        setForm(data);
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
      const res = await fetch(`/api/candidate-details/${candidateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error("Error updating field:", err);
    }
  };

  const renderUpdatedAt = (field) =>
    form[`${field}_updated_at`]
      ? new Date(form[`${field}_updated_at`]).toLocaleString()
      : "-";

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <Header />
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Process Tracker</h2>

      {/* Passport Register Date */}
      <FormRow label="Passport Register Date">
        <input
          type="date"
          value={form.passport_register_date || ""}
          onChange={(e) =>
            handleUpdate("passport_register_date", e.target.value)
          }
          className="input"
        />
        {renderUpdatedAt("passport_register_date")}
      </FormRow>

      {/* Application Sent Date */}
      <FormRow label="Application Sent Date">
        <input
          type="date"
          value={form.application_sent_date || ""}
          onChange={(e) =>
            handleUpdate("application_sent_date", e.target.value)
          }
          className="input"
        />
        {renderUpdatedAt("application_sent_date")}
      </FormRow>

      {/* Applied Job */}
      <FormRow label="Applied Job">
        <select
          value={form.applied_job || ""}
          onChange={(e) => handleUpdate("applied_job", e.target.value)}
          className="input"
        >
          <option value="">-- Select --</option>
          <option value="Housemaid">Housemaid</option>
          <option value="Cook">Cook</option>
          <option value="Caregiver">Caregiver</option>
          <option value="Nurse">Nurse</option>
        </select>
        {renderUpdatedAt("applied_job")}
      </FormRow>

      {/* Office Name */}
      <FormRow label="Office Name">
        <select
          value={form.office_name || ""}
          onChange={(e) => handleUpdate("office_name", e.target.value)}
          className="input"
        >
          <option value="">-- Select --</option>
          <option value="KANDARI">KANDARI</option>
          <option value="FADAK">FADAK</option>
        </select>
        {renderUpdatedAt("office_name")}
      </FormRow>

      {/* Visa Status */}
      <FormRow label="Visa Status">
        <select
          value={form.visa_status || ""}
          onChange={(e) => handleUpdate("visa_status", e.target.value)}
          className="input"
        >
          <option value="">-- Select --</option>
          <option value="Waiting for Visa">Waiting for Visa</option>
          <option value="Keep Ready">Keep Ready</option>
          <option value="Received">Received</option>
          <option value="Cancel">Cancel</option>
        </select>
        {renderUpdatedAt("visa_status")}
      </FormRow>

      {/* Medical */}
      <FormRow label="Medical">
        <select
          value={form.medical || ""}
          onChange={(e) => handleUpdate("medical", e.target.value)}
          className="input"
        >
          <option value="">-- Select --</option>
          <option value="Pending">Pending</option>
          <option value="Recheck">Recheck</option>
          <option value="Fit">Fit</option>
          <option value="Unfit">Unfit</option>
        </select>
        {renderUpdatedAt("medical")}
      </FormRow>

      {/* Agreement */}
      <FormRow label="Agreement">
        <select
          value={form.agreement || ""}
          onChange={(e) => handleUpdate("agreement", e.target.value)}
          className="input"
        >
          <option value="">-- Select --</option>
          <option value="Hold">Hold</option>
          <option value="Need Agreement">Need Agreement</option>
          <option value="Done">Done</option>
        </select>
        {renderUpdatedAt("agreement")}
      </FormRow>

      {/* Embassy */}
      <FormRow label="Embassy">
        <select
          value={form.embassy || ""}
          onChange={(e) => handleUpdate("embassy", e.target.value)}
          className="input"
        >
          <option value="">-- Select --</option>
          <option value="Done">Done</option>
          <option value="Not Done">Not Done</option>
        </select>
        {renderUpdatedAt("embassy")}
      </FormRow>

      {/* SLBFE Approval */}
      <FormRow label="SLBFE Approval">
        <input
          type="checkbox"
          checked={form.slbfe_approval || false}
          onChange={(e) =>
            handleUpdate("slbfe_approval", e.target.checked)
          }
          className="h-5 w-5"
        />
        {renderUpdatedAt("slbfe_approval")}
      </FormRow>

      {/* Departure Date */}
      <FormRow label="Departure Date">
        <input
          type="date"
          value={form.departure_date || ""}
          onChange={(e) =>
            handleUpdate("departure_date", e.target.value)
          }
          className="input"
        />
        {renderUpdatedAt("departure_date")}
      </FormRow>

      {/* Remarks */}
      <div className="mt-6">
        <label className="block font-medium mb-1">Remarks</label>
        <textarea
          className="w-full border rounded p-2"
          rows={4}
          value={form.remarks || ""}
          onChange={(e) => handleUpdate("remarks", e.target.value)}
        />
      </div>
    </div>
    </>
  );
};

const FormRow = ({ label, children }) => (
  <div className="grid grid-cols-3 gap-2 items-center mb-4">
    <label className="font-medium">{label}</label>
    {children[0]}
    <span className="text-sm text-gray-500">{children[1]}</span>
  </div>
);

export default CandidateProcessTracker;
