import React, { useEffect, useState } from "react";
import axios from "axios";

export const Report = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${backendURL}/user/report`);
        if (response.data.success) {
          setReport(response.data);
        } else {
          setError("Failed to load report");
        }
      } catch (err) {
        setError("Error fetching report");
        console.error(err);
      }
    };

    fetchReport();
  }, [backendURL]);

  if (error)
    return <p className="text-red-500 text-center mt-6 font-medium">{error}</p>;

  if (!report)
    return <p className="text-gray-500 text-center mt-6">Loading Report...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          🎯 Proctoring Report
        </h2>
        <p className="text-gray-500 mt-2">
          Candidate performance and integrity summary
        </p>
      </div>

      {/* Report Details */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-500">Candidate</p>
          <p className="text-lg font-semibold text-gray-800">
            {report.candidateName}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-500">Duration</p>
          <p className="text-lg font-semibold text-gray-800">
            {report.duration} min
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-500">Focus Lost</p>
          <p className="text-lg font-semibold text-gray-800">
            {report.focusLost}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-500">Suspicious Events</p>
          <p className="text-lg font-semibold text-gray-800">
            {report.suspiciousEvents}
          </p>
        </div>
      </div>

      {/* Integrity Score */}
      <div className="mt-8 p-6 bg-gray-100 rounded-xl border text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Integrity Score
        </p>
        <p
          className={`text-3xl font-extrabold ${
            report.integrityScore > 80
              ? "text-green-600"
              : report.integrityScore > 50
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {report.integrityScore}%
        </p>
      </div>
    </div>
  );
};