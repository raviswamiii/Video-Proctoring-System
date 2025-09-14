import React, { useState } from 'react'
import { VideoFeed } from '../components/VideoFeed';
import { LogsPanel } from '../components/LogsPanel';

export const Interview = () => {
    const [logs, setLogs] = useState([]);

    const addLog = (type) => {
        setLogs((prev) => [...prev, {type, timestamp: newDate().toISOString()}])
    }

  return (
    <div className='flex'>
        <VideoFeed addLog={addLog}/>
        <LogsPanel log={logs}/>
    </div>
  )
}
