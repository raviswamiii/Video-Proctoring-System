import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🎥 Video Proctoring System
        </h1>
        <p className="text-gray-600 mb-6">
          Ensure integrity during interviews with live monitoring, face
          detection, and suspicious activity tracking.
        </p>
        <Link to="/interview">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
            🚀 Start Interview
          </button>
        </Link>
      </div>
    </div>
  );
};