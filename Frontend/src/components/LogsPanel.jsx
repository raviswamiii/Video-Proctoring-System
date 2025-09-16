import React from "react";

export const LogsPanel = ({ logs }) => {
  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">📜 Activity Logs</h2>
        <p className="text-sm text-gray-500">Real-time monitoring</p>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-3 text-sm">
          {logs && logs.length > 0 ? (
            logs.map((log, i) => (
              <li
                key={i}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm flex items-start gap-3"
              >
                {/* Timestamp */}
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>

                {/* Log Message */}
                <span
                  className={`flex-1 font-medium ${
                    log.type.includes("No Face")
                      ? "text-red-600"
                      : log.type.includes("Multiple")
                      ? "text-yellow-600"
                      : log.type.includes("Suspicious")
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {log.type}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic text-center">
              No logs yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};