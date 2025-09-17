import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Report = () => {
  const [report, setReport] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

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

    const fetchRecordings = async () => {
      try {
        const response = await axios.get(`${backendURL}/user/recording`);
        setRecordings(response.data);
      } catch (err) {
        console.error("Error fetching recordings:", err);
      }
    };

    fetchReport();
    fetchRecordings();
  }, [backendURL]);

  if (error)
    return <p className="text-red-500 text-center mt-6 font-medium">{error}</p>;

  if (!report)
    return <p className="text-gray-500 text-center mt-6">Loading Report...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
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
          <p className="text-sm text-gray-500">Duration</p>
          <p className="text-lg font-semibold text-gray-800">
            {report.duration} min
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

      {/* Recordings Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🎥 Recordings</h3>
        {recordings.length > 0 ? (
          <ul className="space-y-6">
            {recordings.map((rec) => (
              <li
                key={rec._id}
                className="p-4 bg-gray-50 rounded-lg border shadow-md"
              >
                <p className="font-semibold">{rec.filename}</p>
                <p className="text-sm text-gray-500">
                  {new Date(rec.createdAt).toLocaleString()}
                </p>
                <video
                  controls
                  className="mt-3 rounded-lg shadow-md w-full max-w-md"
                  src={`${backendURL}/user/recording/${rec._id}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recordings available</p>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
        >
          ⬅ Back to Interview
        </button>
      </div>
    </div>
  );
};
