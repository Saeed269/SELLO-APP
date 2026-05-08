export default function IconSVG({ path, circle, size = 14, color = 'currentColor' }) {
  const circleEl = circle
    ? `<circle cx="${circle.split(' ')[0]}" cy="${circle.split(' ')[1]}" r="${circle.split(' ')[2]}"/>`
    : ''

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: circleEl + `<path d="${path}"/>` }}
    />
  )
}