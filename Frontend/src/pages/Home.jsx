import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <div className="bg-white rounded-2xl shadow-lg max-w-md p-10 text-center">
        <h1 className="text-3xl text-gray-800 font-bold mb-6">
          🎥 Video Proctoring System
        </h1>
        <p className="text-gray-600 mb-6">
          Ensure integrity during interviews with live monitoring, face
          detection, and suspicious activity tracking.
        </p>
        <Link to={"/logIn"}>
          <button className="px-6 py-3 rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
            🚀 Start Interview
          </button>
        </Link>
      </div>
    </div>
  );
};
