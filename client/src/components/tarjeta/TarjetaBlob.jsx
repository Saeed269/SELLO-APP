import { QRCodeSVG } from 'qrcode.react'
import Efecto from './Efecto'
import IconSVG from './IconSVG'
import { darkenColor } from '../../constants'

/**
 * Modern gradient card style with blob decoration.
 */
export default function TarjetaBlob({ efecto, color, nombre, numSellos, premios, selloIcon, premioIcon, qrUrl }) {
  const col     = color || '#E65100'
  const colDark = darkenColor(col)
  const cols    = numSellos <= 8 ? 4 : 5
  const marcados = 0

  return (
    <div style={{
      borderRadius: '28px',
      background: `linear-gradient(145deg, ${colDark} 0%, ${col} 60%, ${colDark} 100%)`,
      padding: '2rem 1.75rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 24px 64px ${col}55`,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    }}>
      <Efecto tipo={efecto} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', fontStyle: 'italic', color: '#fff', fontFamily: 'Georgia,serif', textAlign: 'center' }}>
          {nombre}
        </h3>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
        {Array.from({ length: numSellos }).map((_, i) => {
          const marcado  = i < marcados
          const esUltimo = i === numSellos - 1
          return (
            <div key={i} style={{
              aspectRatio: '1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: marcado ? (esUltimo ? '#FFD700' : '#fff') : 'rgba(255,255,255,0.2)',
              border: marcado ? 'none' : '1.5px solid rgba(255,255,255,0.35)',
            }}>
              {marcado && (esUltimo
                ? <IconSVG path={premioIcon.path} size={14} color={col} />
                : <IconSVG path={selloIcon.path} circle={selloIcon.circle} size={14} color={col} />
              )}
            </div>
          )
        })}
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '5px 14px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#fff', fontWeight: '500' }}>
            🎁 Premio: {premios[premios.length - 1]?.texto || '...'}
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
          Muestra este QR para recibir tu sello
        </p>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {qrUrl
            ? <QRCodeSVG value={qrUrl} size={140} fgColor="#1C1C1E" bgColor="#FFFFFF" level="M" />
            : <div style={{ width: 140, height: 140, background: '#f0f0f0', borderRadius: '8px' }} />
          }
        </div>
      </div>
    </div>
  )
}