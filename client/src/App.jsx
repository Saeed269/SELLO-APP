import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/negocio/Login'
import Register from './pages/negocio/Register'
import Dashboard from './pages/negocio/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/negocio/login" />} />
        <Route path="/negocio/login" element={<Login />} />
        <Route path="/negocio/register" element={<Register />} />
        <Route path="/negocio/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App