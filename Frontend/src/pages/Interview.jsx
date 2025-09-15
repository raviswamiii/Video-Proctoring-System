import React, { useState } from "react";
import { VideoFeed } from "../components/VideoFeed";
import { LogsPanel } from "../components/LogsPanel";

export const Interview = () => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false); // camera ON/OFF
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [showSave, setShowSave] = useState(false); // toggles Stop → Save

  const addLog = (type) => {
    setLogs((prev) => [...prev, { type, timestamp: new Date().toISOString() }]);
  };

  const handleStart = () => {
    setIsRunning(true);
    setShowSave(false); // reset Save button
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowSave(true); // show Save button
  };

  const handleSave = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `candidate-recording-${Date.now()}.webm`;
    a.click();

    URL.revokeObjectURL(url);
    setRecordedChunks([]);
    setShowSave(false); // reset
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 relative">
      {/* Left: Video Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-6 relative">
        <div className="w-[85%] h-[75%] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex justify-center items-center bg-gray-950 relative">
          {isRunning ? (
            <>
              <VideoFeed
                addLog={addLog}
                onRecordingReady={setRecordedChunks}
                isRunning={isRunning} // pass down state
              />
              {/* Recording badge */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold animate-pulse">
                ● Recording is ON
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-lg">
              {showSave ? "Recording stopped" : "Camera is stopped"}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex gap-4">
          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
              isRunning
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            ▶ Start
          </button>

          {/* Stop / Save Button */}
          {!showSave ? (
            <button
              onClick={handleStop}
              disabled={!isRunning}
              className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
                !isRunning
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              ⏹ Stop
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg font-semibold shadow-md transition bg-blue-600 hover:bg-blue-700 text-white"
            >
              💾 Save Recording
            </button>
          )}
        </div>
      </div>

      {/* Right: Logs Section */}
      <div className="w-[28%] h-full bg-white shadow-xl border-l border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <LogsPanel logs={logs} />
        </div>
      </div>
    </div>
  );
};
