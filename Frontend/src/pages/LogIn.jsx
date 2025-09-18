import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const userData = { email, password };

      const response = await axios.post(
        backendURL + "/user/register",
        userData,
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate("/home");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <div className="bg-white rounded-2xl shadow-lg w-[30%] p-10 text-center">
        <h1 className="text-3xl text-gray-800 font-bold mb-3">Sign In</h1>
        <form
          action=""
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-4"
        >

          <input
            className="border border-gray-300 rounded-lg px-6 py-3 outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded-lg px-6 py-3 outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="px-6 py-3 rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
            Sign In
          </button>

          <p className="text-red-500">{error}</p>
        </form>
      </div>

      <Link to={"/register"}>
        <p className="text-sm mt-2 text-gray-600">
          <span className="text-indigo-600">Sign Up</span> if you already have
          an account.
        </p>
      </Link>
    </div>
  );
};
