import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { LogIn } from './pages/LogIn'
import { Register } from './pages/Register'

export const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/logIn' element={<LogIn/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>
    </div>
  )
}
