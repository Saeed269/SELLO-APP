import TarjetaBlob from './TarjetaBlob'
import TarjetaDark from './TarjetaDark'

export default function TarjetaPreview(props) {
  if (props.estilo === 'dark') return <TarjetaDark {...props} />
  return <TarjetaBlob {...props} />
}