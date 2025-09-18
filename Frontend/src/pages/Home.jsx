import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "../components/LogOut";

export const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
        <LogOut/>
      <div className="p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Join as</h1>
        <div className="flex gap-5">
          <Link
            to={"/interview"}
            className=" bg-indigo-600 py-3 px-6 rounded-lg shadow-lg text-white hover:bg-indigo-700"
          >
            Candidtate
          </Link>
          <button className=" bg-indigo-600 py-3 px-9 rounded-lg shadow-lg text-white hover:bg-indigo-700 cursor-pointer">
            Proctor
          </button>
        </div>
      </div>
    </div>
  );
};
