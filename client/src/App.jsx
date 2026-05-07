import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NegocioProvider from './context/NegocioProvider'

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
import Ayuda from './pages/negocio/Ayuda'
import Ajustes from './pages/negocio/Ajustes'
import ResetPassword from './pages/negocio/ResetPassword'
import UpdatePassword from './pages/negocio/UpdatePassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/negocio/login" />} />
        <Route path="/negocio/login" element={<Login />} />
        <Route path="/negocio/register" element={<Register />} />
        <Route path="/cliente/registro" element={<RegistroCliente />} />
        <Route path="/cliente/login" element={<LoginCliente />} />
        <Route path="/cliente/tarjeta" element={<Tarjeta />} />

        {/* Rutas negocio — con contexto global */}
        <Route path="/negocio/*" element={
          <NegocioProvider>
            <Routes>
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="escanear" element={<EscanerQR />} />
              <Route path="canjear" element={<CanjearPremio />} />
              <Route path="mi-tarjeta" element={<MiTarjeta />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="analiticas" element={<Analiticas />} />
              <Route path="ayuda" element={<Ayuda />} />
              <Route path="ajustes" element={<Ajustes />} />
            </Routes>
          </NegocioProvider>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App