import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export const ProtectRoutes = ({children}) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(()=>{
        if (!token) {
        navigate("/logIn");
    } 
    }, [token, navigate])
  return (
    <div>{children}</div>
  )
}
