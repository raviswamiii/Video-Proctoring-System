import React from "react";

export const LogsPanel = () => {
  return (
    <div className=" sm:w-[55%] lg:w-[35%] border-l border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <p className="font-semibold text-lg">📜 Activity Logs</p>
        <p className="text-sm text-gray-500 pl-7.5">Real time monitoring</p>
      </div>
      <div className="flex flex-col items-center p-2">
        <p className="italic text-sm text-gray-500">No logs yet</p>
      </div>
    </div>
  );
};
