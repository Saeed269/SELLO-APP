import { COLORS } from '../../constants'


export default function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(145deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 60%, ${COLORS.primaryDeep} 100%)`,
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: '0.12em',
      }}>
        SELLO
      </h1>
    </div>
  )
}