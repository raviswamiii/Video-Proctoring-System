import React from "react";
import { useNavigate } from "react-router-dom";

export const LogOut = () => {
  const navigate = useNavigate();
  const onLogoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/logIn");
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
