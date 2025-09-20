import React from 'react'
import { VideoFeed } from '../components/VideoFeed'
import { LogsPanel } from '../components/LogsPanel'

export const Interview = () => {
  return (
    <div className='sm:flex'> 
      <VideoFeed/>
      <LogsPanel/>
    </div>
  )
}
