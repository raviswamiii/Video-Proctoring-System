import React, { useState } from "react";
import { VideoFeed } from "../components/VideoFeed";
import { LogsPanel } from "../components/LogsPanel";

export const Interview = () => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [showSave, setShowSave] = useState(false);

  const addLog = (type) => {
    setLogs((prev) => [...prev, { type, timestamp: new Date().toISOString() }]);
  };

  const handleStart = () => {
    setIsRunning(true);
    setShowSave(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowSave(true);
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
    setShowSave(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-100 relative">
      {/* Left: Video Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-4 sm:p-6 relative">
        <div className="w-full sm:w-[90%] lg:w-[85%] h-[60vh] sm:h-[70vh] lg:h-[75%] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex justify-center items-center bg-gray-950 relative">
          {isRunning ? (
            <>
              <VideoFeed
                addLog={addLog}
                onRecordingReady={setRecordedChunks}
                isRunning={isRunning}
              />
              {/* Recording Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold animate-pulse">
                ● Recording is ON
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm sm:text-lg text-center px-2">
              {showSave ? "Recording stopped" : "Camera is stopped"}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center">
          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-md transition text-sm sm:text-base ${
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
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-md transition text-sm sm:text-base ${
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
              className="px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-md transition bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
            >
              💾 Save Recording
            </button>
          )}
        </div>
      </div>

      {/* Right: Logs Section */}
      <div className="w-full lg:w-[28%] h-[35vh] lg:h-full bg-white shadow-xl border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <LogsPanel logs={logs} />
        </div>
      </div>
    </div>
  );
};
