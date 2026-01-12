import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Abir Modak'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#57534E',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '60px',
        }}
      >
        <div
          style={{
            fontSize: 100,
            color: '#fed7aa', // text-orange-200
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Abir Modak
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
