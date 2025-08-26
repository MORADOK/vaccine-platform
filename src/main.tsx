import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import LIFFRegister from './pages/LIFFRegister'
import StaffLogin from './pages/StaffLogin'
import StaffDashboard from './pages/StaffDashboard'

const router = createBrowserRouter([
  { path: '/', element: <App/> },
  { path: '/liff-register', element: <LIFFRegister/> },
  { path: '/staff/login', element: <StaffLogin/> },
  { path: '/staff', element: <StaffDashboard/> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
