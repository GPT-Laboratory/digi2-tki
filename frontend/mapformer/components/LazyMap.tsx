import dynamic from 'next/dynamic'

export const LazyMap = dynamic(() => import('./BaseMap'), { ssr: false })

export const LazyMarker = dynamic(
  async () => (await import('react-leaflet')).Marker,
  {
    ssr: false,
  }
)
