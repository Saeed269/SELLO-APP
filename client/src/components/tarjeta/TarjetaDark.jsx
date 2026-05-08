import { QRCodeSVG } from 'qrcode.react'
import Efecto from './Efecto'
import IconSVG from './IconSVG'

/**
 * Classic two-tone card style: color on top, dark gray on bottom.
 */
export default function TarjetaDark({ efecto, color, nombre, numSellos, premios, selloIcon, premioIcon, qrUrl }) {
  const col  = color || '#E65100'
  const cols = numSellos <= 8 ? 4 : 5
  const marcados = 0

  return (
    <div style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
      <div style={{ background: col, padding: '2rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
        <Efecto tipo={efecto} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ margin: '0 0 1rem', color: '#fff', fontStyle: 'italic', fontFamily: 'Georgia,serif', fontSize: '1.75rem', fontWeight: '700', textAlign: 'center' }}>
            {nombre}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '6px' }}>
            {Array.from({ length: numSellos }).map((_, i) => {
              const marcado = i < marcados
              return (
                <div key={i} style={{
                  aspectRatio: '1',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: marcado ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.12)',
                  border: marcado ? 'none' : '1.5px solid rgba(255,255,255,0.25)',
                }}>
                  {marcado && <IconSVG path={selloIcon.path} circle={selloIcon.circle} size={11} color="#1C1C1E" />}
                </div>
              )
            })}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>
            🎁 Premio: {premios[premios.length - 1]?.texto || '...'}
          </p>
        </div>
      </div>

      <div style={{ background: '#2a2a2a', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Muestra este QR para recibir tu sello
        </p>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          {qrUrl
            ? <QRCodeSVG value={qrUrl} size={140} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" />
            : <div style={{ width: 140, height: 140, background: '#f0f0f0', borderRadius: '8px' }} />
          }
        </div>
      </div>
    </div>
  )
}