import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/negocio/Login'
import Register from './pages/negocio/Register'
import Dashboard from './pages/negocio/Dashboard'
import Onboarding from './pages/negocio/onboarding/Onboarding'
import EscanerQR from './pages/negocio/EscanerQR'
import CanjearPremio from './pages/negocio/CanjearPremio'
import RegistroCliente from './pages/cliente/RegistroCliente'
import LoginCliente from './pages/cliente/LoginCliente'
import Tarjeta from './pages/cliente/Tarjeta'
import MiTarjeta from './pages/negocio/MiTarjeta'
import Clientes from './pages/negocio/Clientes'
import Analiticas from './pages/negocio/Analiticas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/negocio/login" />} />
        <Route path="/negocio/login" element={<Login />} />
        <Route path="/negocio/register" element={<Register />} />
        <Route path="/negocio/dashboard" element={<Dashboard />} />
        <Route path="/negocio/onboarding" element={<Onboarding />} />
        <Route path="/negocio/escanear" element={<EscanerQR />} />
        <Route path="/negocio/canjear" element={<CanjearPremio />} />
        <Route path="/cliente/registro" element={<RegistroCliente />} />
        <Route path="/cliente/login" element={<LoginCliente />} />
        <Route path="/cliente/tarjeta" element={<Tarjeta />} />
        <Route path="/negocio/mi-tarjeta" element={<MiTarjeta />} />
        <Route path="/negocio/clientes" element={<Clientes />} />
        <Route path="/negocio/analiticas" element={<Analiticas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App