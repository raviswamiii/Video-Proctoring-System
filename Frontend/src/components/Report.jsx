import React, { useEffect, useState } from "react";
import axios from "axios";

export const Report = () => {
  const [report, setReport] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchReport = async () => {
      const response = axios.get(backendURL + "/user/report");

      if (response.data.success) {
        setReport(response.data);
      }
    };
    fetchReport();
  },[]);

  if(!report) return <p>Loading Report...</p>
  return <div>
      <h2>Proctoring Report</h2>
      <p>Candidate: {report.candidateName}</p>
      <p>Duration: {report.duration} min</p>
      <p>Focus Lost: {report.focusLost}</p>
      <p>Suspicious Events: {report.suspiciousEvents}</p>
      <p>Integrity Score: {report.integrityScore}</p>
    </div>
};
