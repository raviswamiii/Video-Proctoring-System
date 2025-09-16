
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Interview } from './pages/Interview'
import { Report } from './components/Report'

export const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/interview' element={<Interview/>} />
        <Route path='/report' element={<Report/>} />
      </Routes>
    </div>
  )
}