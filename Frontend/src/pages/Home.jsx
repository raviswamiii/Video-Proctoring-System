import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <h1>Video Proctoring System</h1>
      <Link to={"/interview"}>
        <button>Start Interview</button>
      </Link>
    </div>
  );
};
