import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import NavNegocio from '../../components/NavNegocio'

// ─── Estilos de tarjeta ───────────────────────────────────────
const ESTILOS = [
  { id: 'blob',       nombre: 'Blob',    desc: 'Burbujas suaves' },
  { id: 'split',      nombre: 'Split',   desc: 'Zona superior + QR' },
  { id: 'glass',      nombre: 'Glass',   desc: 'Cristal oscuro' },
  { id: 'neon',       nombre: 'Neón',    desc: 'Fondo negro + luz' },
  { id: 'forest',     nombre: 'Forest',  desc: 'Verde oscuro' },
  { id: 'minimal',    nombre: 'Minimal', desc: 'Limpio y claro' },
]

// ─── Efectos decorativos ──────────────────────────────────────
const EFECTOS = [
  { id: 'bubbles',  nombre: 'Burbujas' },
  { id: 'none',     nombre: 'Sin efecto' },
  { id: 'lines',    nombre: 'Líneas' },
  { id: 'dots',     nombre: 'Puntos' },
  { id: 'waves',    nombre: 'Ondas' },
  { id: 'hexagons', nombre: 'Hexágonos' },
  { id: 'gradient', nombre: 'Gradiente' },
  { id: 'confetti', nombre: 'Confeti' },
]

// ─── Colores ──────────────────────────────────────────────────
const COLORES = [
  '#E8763A','#1C1C1E','#B71C1C','#1565C0','#2D6A4F',
  '#6B2D6B','#C2185B','#5C4033','#C67C3E','#5C6BC0',
  '#00838F','#558B2F','#E65100','#4527A0','#1A237E',
  '#880E4F','#006064','#33691E','#F57F17','#37474F',
]

// ─── Iconos contextuales por tipo negocio ─────────────────────
const ICONOS_POR_TIPO = {
  'Cafetería': [
    { id: 'coffee-cup', label: 'Taza', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg> },
    { id: 'takeaway', label: 'Para llevar', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11H3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3"/><path d="M21 11h-2"/><path d="M7 8a4 4 0 0 1 8 0v1H7Z"/><rect width="12" height="10" x="6" y="9" rx="1"/><line x1="12" x2="12" y1="9" y2="19"/></svg> },
    { id: 'bean', label: 'Grano', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 14.5c-2-2-3-4.5-2.5-7 .5-3 3-5 5.5-5s5 2 5 5-2 5-5 5c-2.5.5-5-1-7-3"/></svg> },
    { id: 'star', label: 'Estrella', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  ],
  'Restaurante': [
    { id: 'utensils', label: 'Cubiertos', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg> },
    { id: 'star', label: 'Estrella', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'flame', label: 'Llama', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> },
    { id: 'heart', label: 'Corazón', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  ],
  'Panadería & Pastelería': [
    { id: 'croissant', label: 'Croissant', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 21.16 2 19 2 14.78a2.42 2.42 0 0 1 2.6-1.67Z"/><path d="m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4"/><path d="M16.5 9.5c-.28-.96-.62-2.06-1-3C13.17 1 10.5 2 10.5 2"/><path d="M22 13.5c0-4.5-2.5-5-2.5-5h-2c-.5 0-1.5.31-2 1l-1 2"/><path d="M14.5 20.5c4-2 4.5-6.5 4.5-8.5"/></svg> },
    { id: 'cake', label: 'Tarta', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> },
    { id: 'star', label: 'Estrella', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'heart', label: 'Corazón', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  ],
  'Peluquería & Barbería': [
    { id: 'scissors', label: 'Tijeras', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg> },
    { id: 'comb', label: 'Peine', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M6 14v4"/><path d="M9 14v4"/><path d="M12 14v4"/><path d="M15 14v4"/><path d="M18 14v4"/></svg> },
    { id: 'star', label: 'Estrella', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'sparkle', label: 'Brillo', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg> },
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  ],
  'Manicura & Estética': [
    { id: 'sparkle', label: 'Brillo', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg> },
    { id: 'heart', label: 'Corazón', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
    { id: 'flower', label: 'Flor', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 5a4 4 0 0 1 4 4 4 4 0 0 1 4-4 4 4 0 0 1-4 4 4 4 0 0 1 4 4 4 4 0 0 1-4-4 4 4 0 0 1-4 4 4 4 0 0 1 4-4 4 4 0 0 1-4-4 4 4 0 0 1 4 4"/></svg> },
    { id: 'star', label: 'Estrella', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  ],
  'Masajes & Spa': [
    { id: 'leaf', label: 'Hoja', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> },
    { id: 'droplets', label: 'Agua', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg> },
    { id: 'heart', label: 'Corazón', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
    { id: 'sparkle', label: 'Brillo', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg> },
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  ],
  'Yoga & Pilates': [
    { id: 'sun', label: 'Sol', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> },
    { id: 'leaf', label: 'Hoja', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> },
    { id: 'heart', label: 'Corazón', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
    { id: 'star', label: 'Estrella', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  ],
  'Entrenador Personal': [
    { id: 'dumbbell', label: 'Pesa', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829 2 2 0 1 1 2.828 2.829l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg> },
    { id: 'flame', label: 'Llama', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> },
    { id: 'bolt', label: 'Rayo', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { id: 'star', label: 'Estrella', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
  ],
  'default': [
    { id: 'check', label: 'Check', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> },
    { id: 'star', label: 'Estrella', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: 'heart', label: 'Corazón', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
    { id: 'bolt', label: 'Rayo', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { id: 'sparkle', label: 'Brillo', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg> },
  ],
}

const PREMIOS_ICONOS = [
  { id: 'gift', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
  { id: 'trophy', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> },
  { id: 'star', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'heart', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
  { id: 'crown', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg> },
  { id: 'medal', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/></svg> },
]

// ─── Efecto decorativo SVG ────────────────────────────────────
function Efecto({ tipo }) {
  if (tipo === 'bubbles') return (
    <>
      <div style={{ position:'absolute', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.12)', top:-50, right:-50, pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.08)', bottom:-30, left:-30, pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', width:70, height:70, borderRadius:'50%', background:'rgba(255,215,0,0.1)', bottom:60, right:20, pointerEvents:'none', zIndex:0 }} />
    </>
  )
  if (tipo === 'lines') return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.08, zIndex:0 }} viewBox="0 0 300 300">
      {[0,1,2,3,4,5,6].map(i => <line key={i} x1={i*50-10} y1="0" x2={i*50+30} y2="300" stroke="#fff" strokeWidth="1.5"/>)}
    </svg>
  )
  if (tipo === 'dots') return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.12, zIndex:0 }} viewBox="0 0 300 300">
      {Array.from({length:10}).map((_,x) => Array.from({length:10}).map((_,y) => <circle key={`${x}-${y}`} cx={x*32+10} cy={y*32+10} r="2.5" fill="#fff"/>))}
    </svg>
  )
  if (tipo === 'waves') return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.1, zIndex:0 }} viewBox="0 0 300 300" preserveAspectRatio="none">
      <path d="M0,80 Q75,60 150,80 Q225,100 300,80 L300,300 L0,300 Z" fill="#fff"/>
      <path d="M0,130 Q75,110 150,130 Q225,150 300,130 L300,300 L0,300 Z" fill="#fff"/>
    </svg>
  )
  if (tipo === 'hexagons') return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.08, zIndex:0 }} viewBox="0 0 300 300">
      {[[50,50],[150,50],[250,50],[100,120],[200,120],[50,190],[150,190],[250,190]].map(([cx,cy],i) => (
        <polygon key={i} points={`${cx},${cy-25} ${cx+22},${cy-12} ${cx+22},${cy+12} ${cx},${cy+25} ${cx-22},${cy+12} ${cx-22},${cy-12}`} fill="none" stroke="#fff" strokeWidth="1"/>
      ))}
    </svg>
  )
  if (tipo === 'gradient') return <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)', pointerEvents:'none', zIndex:0 }} />
  if (tipo === 'confetti') return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.15, zIndex:0 }} viewBox="0 0 300 300">
      {[[20,20],[80,40],[140,15],[200,35],[260,20],[40,90],[100,70],[160,90],[220,75],[280,85],[30,160],[90,180],[150,155],[210,175],[270,160],[50,240],[120,220],[180,240],[240,220]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="7" height="7" rx="1" fill="#fff" transform={`rotate(${i*19} ${x+3.5} ${y+3.5})`}/>
      ))}
    </svg>
  )
  return null
}

// ─── Tarjeta cliente preview ──────────────────────────────────
function TarjetaPreview({ estilo, efecto, color, nombre, numSellos, premio, selloIconId, premioIconId, iconosDisponibles, qrUrl, modo }) {
  const col = color || '#E8763A'
  const selloIcon = iconosDisponibles?.find(s => s.id === selloIconId) || iconosDisponibles?.[0]
  const premioIcon = PREMIOS_ICONOS.find(p => p.id === premioIconId) || PREMIOS_ICONOS[0]
  const marcados = 3

  const Sellos = ({ cuadrados }) => (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(5,1fr)`, gap:'6px' }}>
      {Array.from({ length: Math.min(numSellos, 10) }).map((_, i) => {
        const marcado = i < marcados
        const esUltimo = i === numSellos - 1
        return (
          <div key={i} style={{
            aspectRatio:'1', borderRadius: cuadrados ? '6px' : '50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            backgroundColor: marcado ? (esUltimo ? '#FFD700' : 'rgba(255,255,255,0.9)') : 'rgba(255,255,255,0.15)',
            border: marcado ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
            color: col,
          }}>
            {marcado && (esUltimo
              ? <span style={{ color: col }}>{premioIcon.svg}</span>
              : <span style={{ color: col }}>{selloIcon?.svg}</span>
            )}
          </div>
        )
      })}
    </div>
  )

  // ── NEGOCIO (con QR) ──
  if (modo === 'negocio') {
    return (
      <div style={{ borderRadius:'20px', background:col, padding:'1.5rem', position:'relative', overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>
        <Efecto tipo={efecto} />
        <h3 style={{ margin:'0 0 0.5rem', color:'#fff', fontStyle:'italic', fontFamily:'Georgia,serif', fontSize:'1.1rem', position:'relative', zIndex:1 }}>{nombre}</h3>
        <div style={{ position:'relative', zIndex:1, background:'#fff', borderRadius:'14px', padding:'12px', display:'inline-block', margin:'0.5rem auto', display:'flex', justifyContent:'center' }}>
          {qrUrl ? <QRCodeSVG value={qrUrl} size={140} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" /> : <div style={{ width:140, height:140, background:'#f0f0f0', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'#bbb', fontSize:'12px' }}>QR del negocio</div>}
        </div>
        <p style={{ margin:'0.5rem 0 0', fontSize:'11px', color:'rgba(255,255,255,0.75)', textAlign:'center', position:'relative', zIndex:1 }}>Los clientes escanean este QR para registrarse</p>
      </div>
    )
  }

  // ── BLOB ──
  if (estilo === 'blob') return (
    <div style={{ borderRadius:'20px', background:col, padding:'1.25rem', position:'relative', overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>
      <Efecto tipo={efecto} />
      <h3 style={{ margin:'0 0 0.75rem', color:'#fff', fontStyle:'italic', fontFamily:'Georgia,serif', fontSize:'1rem', position:'relative', zIndex:1 }}>{nombre}</h3>
      <div style={{ position:'relative', zIndex:1, marginBottom:'0.75rem' }}><Sellos /></div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:1 }}>
        <p style={{ margin:0, fontSize:'11px', color:'rgba(255,255,255,0.7)' }}>{marcados}/{numSellos} sellos</p>
        <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'20px', padding:'3px 10px' }}>
          <p style={{ margin:0, fontSize:'10px', color:'#fff' }}>🎁 {premio || 'Premio'}</p>
        </div>
      </div>
      {qrUrl && <div style={{ position:'relative', zIndex:1, marginTop:'0.75rem', background:'#fff', borderRadius:'10px', padding:'8px', display:'flex', justifyContent:'center' }}><QRCodeSVG value={qrUrl} size={100} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" /></div>}
    </div>
  )

  // ── SPLIT ──
  if (estilo === 'split') return (
    <div style={{ borderRadius:'20px', overflow:'hidden', border:'1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ background:col, padding:'1rem', position:'relative', overflow:'hidden' }}>
        <Efecto tipo={efecto} />
        <h3 style={{ margin:'0 0 0.75rem', color:'#fff', fontStyle:'italic', fontFamily:'Georgia,serif', fontSize:'1rem', position:'relative', zIndex:1 }}>{nombre}</h3>
        <div style={{ position:'relative', zIndex:1, marginBottom:'6px' }}><Sellos /></div>
        <p style={{ margin:0, fontSize:'10px', color:'rgba(255,255,255,0.8)', position:'relative', zIndex:1 }}>{marcados}/{numSellos} · {premio || 'Premio'}</p>
      </div>
      <div style={{ background:'#fff', padding:'0.75rem', textAlign:'center' }}>
        <p style={{ margin:'0 0 4px', fontSize:'9px', color:'#aaa', letterSpacing:'0.08em' }}>TU CÓDIGO PERSONAL</p>
        {qrUrl ? <QRCodeSVG value={qrUrl} size={100} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" /> : <div style={{ width:100, height:100, background:'#f0f0f0', borderRadius:'8px', margin:'0 auto' }} />}
      </div>
    </div>
  )

  // ── GLASS ──
  if (estilo === 'glass') return (
    <div style={{ borderRadius:'20px', background:'#1a1030', padding:'1.25rem', border:'1px solid rgba(127,119,221,0.3)', position:'relative', overflow:'hidden' }}>
      <Efecto tipo={efecto} />
      <h3 style={{ margin:'0 0 0.75rem', color:'#fff', fontStyle:'italic', fontFamily:'Georgia,serif', fontSize:'1rem', position:'relative', zIndex:1 }}>{nombre}</h3>
      <div style={{ position:'relative', zIndex:1, background:'rgba(127,119,221,0.15)', borderRadius:'8px', padding:'8px', marginBottom:'8px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
          <p style={{ margin:0, fontSize:'9px', color:'rgba(255,255,255,0.5)' }}>SELLOS</p>
          <p style={{ margin:0, fontSize:'9px', color:'#fff' }}>{marcados}/{numSellos}</p>
        </div>
        <div style={{ display:'flex', gap:'3px' }}>
          {Array.from({ length: numSellos }).map((_,i) => (
            <div key={i} style={{ flex:1, height:'5px', borderRadius:'3px', background: i < marcados ? '#7F77DD' : 'rgba(127,119,221,0.2)' }} />
          ))}
        </div>
      </div>
      <div style={{ position:'relative', zIndex:1, background:'rgba(0,0,0,0.3)', borderRadius:'8px', padding:'6px', textAlign:'center' }}>
        {qrUrl ? <QRCodeSVG value={qrUrl} size={100} fgColor="#fff" bgColor="transparent" level="M" /> : <div style={{ width:80, height:80, background:'rgba(127,119,221,0.3)', borderRadius:'4px', margin:'0 auto' }} />}
      </div>
    </div>
  )

  // ── NEÓN ──
  if (estilo === 'neon') return (
    <div style={{ borderRadius:'20px', background:'#0a0a0a', padding:'1.25rem', border:`1px solid ${col}55`, position:'relative', overflow:'hidden' }}>
      <Efecto tipo={efecto} />
      <h3 style={{ margin:'0 0 0.75rem', color:col, fontStyle:'italic', fontFamily:'Georgia,serif', fontSize:'1rem', position:'relative', zIndex:1 }}>{nombre}</h3>
      <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'6px', marginBottom:'0.75rem' }}>
        {Array.from({ length: Math.min(numSellos,10) }).map((_,i) => (
          <div key={i} style={{ aspectRatio:'1', borderRadius:'6px', background: i < marcados ? `${col}33` : 'rgba(255,255,255,0.05)', border: i < marcados ? `1px solid ${col}` : '1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:col }}>
            {i < marcados && <span>{selloIcon?.svg}</span>}
          </div>
        ))}
      </div>
      <div style={{ position:'relative', zIndex:1, background:`${col}22`, border:`1px solid ${col}55`, borderRadius:'8px', padding:'6px', textAlign:'center' }}>
        {qrUrl ? <QRCodeSVG value={qrUrl} size={90} fgColor={col} bgColor="transparent" level="M" /> : <div style={{ width:80, height:80, background:`${col}33`, borderRadius:'4px', margin:'0 auto' }} />}
      </div>
    </div>
  )

  // ── FOREST ──
  if (estilo === 'forest') return (
    <div style={{ borderRadius:'20px', background:'#0d2818', padding:'1.25rem', border:'1px solid rgba(45,106,79,0.4)', position:'relative', overflow:'hidden' }}>
      <Efecto tipo={efecto} />
      <h3 style={{ margin:'0 0 0.75rem', color:'#fff', fontStyle:'italic', fontFamily:'Georgia,serif', fontSize:'1rem', position:'relative', zIndex:1 }}>{nombre}</h3>
      <div style={{ position:'relative', zIndex:1, marginBottom:'6px' }}>
        <div style={{ display:'flex', gap:'3px', marginBottom:'6px' }}>
          {Array.from({ length: numSellos }).map((_,i) => (
            <div key={i} style={{ flex:1, height:'5px', borderRadius:'3px', background: i < marcados ? '#2D6A4F' : 'rgba(45,106,79,0.2)' }} />
          ))}
        </div>
        <p style={{ margin:0, fontSize:'10px', color:'rgba(255,255,255,0.5)' }}>{marcados}/{numSellos} · {premio || 'Premio'}</p>
      </div>
      <div style={{ position:'relative', zIndex:1, background:'rgba(45,106,79,0.3)', borderRadius:'8px', padding:'6px', textAlign:'center' }}>
        {qrUrl ? <QRCodeSVG value={qrUrl} size={90} fgColor="#4ade80" bgColor="transparent" level="M" /> : <div style={{ width:80, height:80, background:'rgba(45,106,79,0.5)', borderRadius:'4px', margin:'0 auto' }} />}
      </div>
    </div>
  )

  // ── MINIMAL ──
  return (
    <div style={{ borderRadius:'20px', background:'#fff', padding:'1.25rem', border:`2px solid ${col}`, position:'relative', overflow:'hidden' }}>
      <Efecto tipo={efecto} />
      <h3 style={{ margin:'0 0 0.75rem', color:'#1C1C1E', fontSize:'1rem', fontFamily:'Georgia,serif', fontStyle:'italic', position:'relative', zIndex:1 }}>{nombre}</h3>
      <div style={{ position:'relative', zIndex:1, marginBottom:'0.75rem' }}><Sellos /></div>
      <div style={{ position:'relative', zIndex:1, background:'#f9f9f9', borderRadius:'8px', padding:'6px', textAlign:'center' }}>
        {qrUrl ? <QRCodeSVG value={qrUrl} size={90} fgColor={col} bgColor="#f9f9f9" level="M" /> : <div style={{ width:80, height:80, background:'#e0e0e0', borderRadius:'4px', margin:'0 auto' }} />}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────
export default function MiTarjeta() {
  const [negocio, setNegocio] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('diseno')
  const [mobileTab, setMobileTab] = useState('editar')
  const [previewModo, setPreviewModo] = useState('cliente')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [estilo, setEstilo] = useState('blob')
  const [efecto, setEfecto] = useState('bubbles')
  const [color, setColor] = useState('#E8763A')
  const [selloIconId, setSelloIconId] = useState('check')
  const [premioIconId, setPremioIconId] = useState('gift')
  const [numSellos, setNumSellos] = useState(10)
  const [premio, setPremio] = useState('')
  const [caducidad, setCaducidad] = useState(12)
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/negocio/login'); return }
      setUser(user)
      const { data } = await supabase.from('negocios').select('*').eq('user_id', user.id).single()
      if (!data) { navigate('/negocio/onboarding'); return }
      setNegocio(data)
      setNumSellos(data.num_sellos || 10)
      setPremio(data.premio || '')
      setCaducidad(data.caducidad_meses || 12)
      if (data.diseno && Object.keys(data.diseno).length > 0) {
        setEstilo(data.diseno.estilo || 'blob')
        setEfecto(data.diseno.efecto || 'bubbles')
        setColor(data.diseno.color || '#E8763A')
        setSelloIconId(data.diseno.selloIcon || 'check')
        setPremioIconId(data.diseno.premioIcon || 'gift')
      }
      setLoading(false)
    }
    init()
  }, [navigate])

  const handleGuardar = async () => {
    setError('')
    if (!premio.trim()) { setError('Define el premio para tu cliente'); return }
    setSaving(true)
    const { error: e } = await supabase.from('negocios').update({
      num_sellos: numSellos,
      premio,
      caducidad_meses: caducidad,
      diseno: { estilo, efecto, color, selloIcon: selloIconId, premioIcon: premioIconId },
    }).eq('user_id', user.id)
    setSaving(false)
    if (e) { setError('Error al guardar: ' + e.message) }
    else { setGuardado(true); setTimeout(() => setGuardado(false), 2500) }
  }

  if (loading) return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(145deg, #c03a06 0%, #E8763A 60%, #d4520f 100%)' }}>
      <h1 style={{ margin:0, fontSize:'2.5rem', fontWeight:'bold', color:'#fff', letterSpacing:'0.12em' }}>SELLO</h1>
    </div>
  )

  const iconosDisponibles = ICONOS_POR_TIPO[negocio?.tipo] || ICONOS_POR_TIPO['default']
  const qrNegocio = `${window.location.origin}/cliente/registro?negocio=${negocio?.id}`
  const qrCliente = `${window.location.origin}/negocio/escanear?tarjeta=preview`

  const previewProps = {
    estilo, efecto, color,
    nombre: negocio?.nombre,
    numSellos, premio,
    selloIconId, premioIconId,
    iconosDisponibles,
    qrUrl: previewModo === 'negocio' ? qrNegocio : qrCliente,
    modo: previewModo,
  }

  const TogglePreview = () => (
    <div style={{ display:'flex', background:'#f0f0f0', borderRadius:'10px', padding:'3px', marginBottom:'1rem' }}>
      {['cliente', 'negocio'].map(m => (
        <button key={m} onClick={() => setPreviewModo(m)} style={{
          flex:1, padding:'6px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'0.8rem', fontWeight:'500',
          background: previewModo === m ? '#fff' : 'transparent',
          color: previewModo === m ? '#1C1C1E' : '#888',
          boxShadow: previewModo === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
        }}>
          {m === 'cliente' ? 'Tarjeta cliente' : 'Tarjeta negocio'}
        </button>
      ))}
    </div>
  )

  const Controles = () => (
    <div>
      <div style={styles.tabs}>
        {['diseno', 'config'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            ...styles.tab,
            borderBottom: tab === t ? '2px solid #E8763A' : '2px solid transparent',
            color: tab === t ? '#E8763A' : '#888',
          }}>
            {t === 'diseno' ? 'Diseño' : 'Configuración'}
          </button>
        ))}
      </div>

      {tab === 'diseno' && (
        <div>
          <p style={styles.secLabel}>Estilo</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'1.25rem' }}>
            {ESTILOS.map(e => (
              <button key={e.id} onClick={() => setEstilo(e.id)} style={{
                padding:'0.6rem 0.4rem', borderRadius:'10px', cursor:'pointer', textAlign:'center',
                border: estilo === e.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                backgroundColor: estilo === e.id ? '#FFF4EE' : '#fafafa',
              }}>
                <p style={{ margin:'0 0 2px', fontSize:'0.82rem', fontWeight:'600', color:'#1C1C1E' }}>{e.nombre}</p>
                <p style={{ margin:0, fontSize:'0.7rem', color:'#888' }}>{e.desc}</p>
              </button>
            ))}
          </div>

          <p style={styles.secLabel}>Efecto decorativo</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'6px', marginBottom:'1.25rem' }}>
            {EFECTOS.map(e => (
              <button key={e.id} onClick={() => setEfecto(e.id)} style={{
                padding:'0.45rem 0.2rem', borderRadius:'8px', cursor:'pointer', textAlign:'center', fontSize:'0.73rem',
                border: efecto === e.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                backgroundColor: efecto === e.id ? '#FFF4EE' : '#fafafa',
                color: efecto === e.id ? '#E8763A' : '#555', fontWeight: efecto === e.id ? '600' : '400',
              }}>
                {e.nombre}
              </button>
            ))}
          </div>

          <p style={styles.secLabel}>Color</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'1.25rem' }}>
            {COLORES.map(c => (
              <button key={c} onClick={() => setColor(c)} style={{
                width:30, height:30, borderRadius:'50%', backgroundColor:c, cursor:'pointer',
                border: color === c ? '3px solid #E8763A' : '2px solid transparent',
                outline: color === c ? '2px solid #e8e8e8' : 'none',
              }} />
            ))}
          </div>

          <p style={styles.secLabel}>Icono de sello</p>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'1.25rem' }}>
            {iconosDisponibles.map(s => (
              <button key={s.id} onClick={() => setSelloIconId(s.id)} style={{
                width:44, height:44, borderRadius:'10px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px',
                border: selloIconId === s.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                backgroundColor: selloIconId === s.id ? '#FFF4EE' : '#fafafa',
                color: selloIconId === s.id ? '#E8763A' : '#555',
              }}>
                {s.svg}
                <span style={{ fontSize:'0.6rem', color:'#888' }}>{s.label}</span>
              </button>
            ))}
          </div>

          <p style={styles.secLabel}>Icono de premio</p>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {PREMIOS_ICONOS.map(p => (
              <button key={p.id} onClick={() => setPremioIconId(p.id)} style={{
                width:44, height:44, borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                border: premioIconId === p.id ? '2px solid #E8763A' : '1.5px solid #e8e8e8',
                backgroundColor: premioIconId === p.id ? '#FFF4EE' : '#fafafa',
                color: premioIconId === p.id ? '#E8763A' : '#555',
              }}>
                {p.svg}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'config' && (
        <div>
          <p style={styles.secLabel}>Sellos para el premio</p>
          <div style={{ marginBottom:'1.25rem' }}>
            <input type="range" min="5" max="20" value={numSellos} onChange={e => setNumSellos(Number(e.target.value))} style={{ width:'100%' }} />
            <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginTop:'4px' }}>
              <span style={{ fontSize:'1.4rem', fontWeight:'700', color:'#E8763A' }}>{numSellos}</span>
              <span style={{ fontSize:'0.8rem', color:'#888' }}>sellos</span>
            </div>
          </div>

          <p style={styles.secLabel}>Premio</p>
          <input type="text" placeholder="Ej: 1 corte de pelo gratis" value={premio} onChange={e => setPremio(e.target.value)} style={styles.input} />

          <p style={styles.secLabel}>Caducidad</p>
          <div style={{ marginBottom:'1.5rem' }}>
            <input type="range" min="6" max="24" value={caducidad} onChange={e => setCaducidad(Number(e.target.value))} style={{ width:'100%' }} />
            <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginTop:'4px' }}>
              <span style={{ fontSize:'1.4rem', fontWeight:'700', color:'#E8763A' }}>{caducidad}</span>
              <span style={{ fontSize:'0.8rem', color:'#888' }}>meses</span>
            </div>
          </div>

          {error && <p style={{ color:'#dc2626', fontSize:'0.85rem', margin:'0 0 0.75rem' }}>{error}</p>}
        </div>
      )}

      <button onClick={handleGuardar} disabled={saving} style={{
        padding:'0.9rem', width:'100%',
        backgroundColor: guardado ? '#2D6A4F' : '#E8763A',
        color:'#fff', border:'none', borderRadius:'12px',
        fontSize:'0.95rem', fontWeight:'700', cursor:'pointer',
        marginTop:'1.5rem', transition:'background-color 0.3s',
      }}>
        {saving ? 'Guardando...' : guardado ? '✓ Guardado' : 'Guardar cambios'}
      </button>
    </div>
  )

  return (
    <div style={styles.root}>
      <NavNegocio negocio={negocio} user={user} />
      <main style={styles.main}>
        <div style={styles.inner}>
          <div style={{ marginBottom:'1.25rem' }}>
            <h1 style={styles.titulo}>Mi Tarjeta</h1>
            <p style={styles.subtitulo}>Personaliza el diseño y configuración</p>
          </div>

          {isMobile ? (
            // ── MÓVIL ──
            <div>
              <div style={{ display:'flex', background:'#f0f0f0', borderRadius:'10px', padding:'3px', marginBottom:'1.25rem' }}>
                {['editar', 'preview'].map(t => (
                  <button key={t} onClick={() => setMobileTab(t)} style={{
                    flex:1, padding:'8px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'0.85rem', fontWeight:'500',
                    background: mobileTab === t ? '#fff' : 'transparent',
                    color: mobileTab === t ? '#1C1C1E' : '#888',
                    boxShadow: mobileTab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}>
                    {t === 'editar' ? 'Editar' : 'Vista previa'}
                  </button>
                ))}
              </div>
              {mobileTab === 'preview' && (
                <div>
                  <TogglePreview />
                  <TarjetaPreview {...previewProps} />
                </div>
              )}
              {mobileTab === 'editar' && <Controles />}
            </div>
          ) : (
            // ── DESKTOP ──
            <div style={styles.layout}>
              <div style={{ flex:1, minWidth:0 }}><Controles /></div>
              <div style={{ width:280, flexShrink:0 }}>
                <TogglePreview />
                <TarjetaPreview {...previewProps} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

const styles = {
  root: { display:'flex', minHeight:'100dvh', backgroundColor:'#f5f5f5' },
  main: { flex:1, overflowY:'auto', padding:'2rem 1.25rem' },
  inner: { maxWidth:900, margin:'0 auto' },
  titulo: { margin:'0 0 4px', fontSize:'1.6rem', fontWeight:'700', color:'#1C1C1E' },
  subtitulo: { margin:0, fontSize:'0.9rem', color:'#888' },
  layout: { display:'flex', gap:'2rem', alignItems:'flex-start' },
  tabs: { display:'flex', borderBottom:'1px solid #e8e8e8', marginBottom:'1.25rem' },
  tab: { padding:'0.65rem 1.25rem', background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem', fontWeight:'500' },
  secLabel: { fontSize:'0.75rem', fontWeight:'600', color:'#888', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 0.6rem' },
  input: {
    padding:'0.75rem 1rem', borderRadius:'10px', border:'1.5px solid #e8e8e8',
    fontSize:'0.9rem', outline:'none', backgroundColor:'#fafafa',
    color:'#1C1C1E', width:'100%', boxSizing:'border-box', marginBottom:'1.25rem',
  },
}