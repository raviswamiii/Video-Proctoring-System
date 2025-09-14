import React from "react";

export const LogsPanel = ({ logs }) => {
  return (
    <div>
      <h2>Logs</h2>
      <ul>
        {logs && logs.length > 0 ? (
          logs.map((log, i) => (
            <li key={i}>
              [{log.timestamp}] {log.type}
            </li>
          ))
        ) : (
          <li>No logs yet</li>
        )}
      </ul>
    </div>
  );
};
