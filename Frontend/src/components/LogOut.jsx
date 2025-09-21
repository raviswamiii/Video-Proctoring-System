import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const LogOut = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const onLogoutHandler = async () => {
    try {
      const response = await axios.post(
        backendURL + "/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        localStorage.removeItem("token");
        navigate("/logIn");
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <div
      onClick={onLogoutHandler}
      className="bg-red-600 text-white font-semibold p-2 rounded-lg absolute top-4 right-4 cursor-pointer"
    >
      Log out
    </div>
  );
};
