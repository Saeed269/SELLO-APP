import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/negocio/Login'
import Register from './pages/negocio/Register'
import Dashboard from './pages/negocio/Dashboard'
import Onboarding from './pages/negocio/onboarding/Onboarding'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/negocio/login" />} />
        <Route path="/negocio/login" element={<Login />} />
        <Route path="/negocio/register" element={<Register />} />
        <Route path="/negocio/dashboard" element={<Dashboard />} />
        <Route path="/negocio/onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App