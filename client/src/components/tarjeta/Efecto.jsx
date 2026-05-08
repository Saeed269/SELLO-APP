export default function Efecto({ tipo }) {
  const svgStyle = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 0,
  }

  const blob = (w, h, top, right, bottom, left, opacity = 0.12) => (
    <div style={{
      position: 'absolute',
      width: w, height: h,
      borderRadius: '50%',
      background: `rgba(255,255,255,${opacity})`,
      top, right, bottom, left,
      pointerEvents: 'none', zIndex: 0,
    }} />
  )

  if (tipo === 'blobs') return (
    <>
      {blob(220, 220, -70, -70, undefined, undefined)}
      {blob(140, 140, undefined, undefined, -50, -50, 0.08)}
      <div style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,215,0,0.12)', top: '40%', right: 10, pointerEvents: 'none', zIndex: 0 }} />
    </>
  )

  if (tipo === 'bubbles') return (
    <>
      {blob(180, 180, -50, -50, undefined, undefined)}
      {blob(110, 110, undefined, undefined, -30, -30, 0.08)}
    </>
  )

  if (tipo === 'lines') return (
    <svg style={svgStyle} viewBox="0 0 300 300" opacity="0.08">
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1={i*50-10} y1="0" x2={i*50+30} y2="300" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  )

  if (tipo === 'waves') return (
    <svg style={svgStyle} viewBox="0 0 300 300" preserveAspectRatio="none" opacity="0.1">
      <path d="M0,80 Q75,60 150,80 Q225,100 300,80 L300,300 L0,300 Z" fill="white" />
      <path d="M0,140 Q75,120 150,140 Q225,160 300,140 L300,300 L0,300 Z" fill="white" />
    </svg>
  )

  return null
}