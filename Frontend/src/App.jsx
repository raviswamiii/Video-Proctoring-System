import React from "react";
import { Route, Routes } from "react-router-dom";
import { Start } from "./pages/Start";
import { LogIn } from "./pages/LogIn";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { ProtectRoutes } from "../components/ProtectRoutes";

export const App = () => {
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
      </Routes>
    </div>
  );
};
