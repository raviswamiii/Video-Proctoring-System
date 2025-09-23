import React from "react";

export const LogsPanel = ({ logs }) => {
  return (
    <div className="h-full m:w-[55%] lg:w-[35%] border-l border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <p className="font-semibold text-lg">📜 Activity Logs</p>
        <p className="text-sm text-gray-500 pl-7.5">Real time monitoring</p>
      </div>

      <div className="h-full overflow-auto flex flex-col items-center p-2 space-y-2">
        {logs.length === 0 ? (
          <p className="italic text-sm text-gray-500">No logs yet</p>
        ) : (
          logs.reverse().map((log, index) => (
            <p
              key={index}
              className="text-sm text-white bg-green-800 border-b border-gray-100 py-2 px-4 rounded-lg mb-2"
            >
              <span className="font-semibold">{log.timestamp}:</span> {log.type}
            </p>
          ))
        )}
      </div>
    </div>
  );
};
