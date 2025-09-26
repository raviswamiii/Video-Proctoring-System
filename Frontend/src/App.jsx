import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Start } from "./pages/Start";
import { LogIn } from "./pages/LogIn";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Interview } from "./pages/Interview";
import { ProtectRoutes } from "./components/ProtectRoutes";
import { checkTokenExpiration } from "../utils/checkTokenExpiration";

export const App = () => {
  useEffect(() => {
    checkTokenExpiration();
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route
          path="/home"
          element={
            <ProtectRoutes>
              <Home />
            </ProtectRoutes>
          }
        />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/interview"
          element={
            <ProtectRoutes>
              <Interview />
            </ProtectRoutes>
          }
        />
      </Routes>
    </div>
  );
};
