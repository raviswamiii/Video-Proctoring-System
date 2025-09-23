import React from "react";
import { VideoFeed } from "../components/VideoFeed";
import { LogsPanel } from "../components/LogsPanel";
import { useState } from "react";

export const Interview = () => {
  const [logs, setLogs] = useState([]);

  const addLogs = (type) => {
    setLogs((prev) => [
      ...prev,
      { type, timestamp: new Date().toLocaleTimeString() },
    ]);
  };
  return (
    <div className="sm:flex h-screen overflow-hidden">
      <VideoFeed addLogs={addLogs} />
      <LogsPanel logs={logs} />
    </div>
  );
};
