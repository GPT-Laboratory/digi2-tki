import { getColoredMarker } from '@/utils/mapHelpers'
import { Site } from '@/utils/types'

import { Marker, Popup } from 'react-leaflet'

export default function SiteMarker(
  {site}: {site: Site}
){
  return(
    <Marker
      position={[site.options!.location.lat, site.options!.location.lon]}
      icon={getColoredMarker({colorName: "darkblue", transparent: true})}
    >
      <Popup closeOnClick={true} closeButton={false}>
        <h4>{site.name}</h4>
        <div>{site.description}</div>
      </Popup>
    </Marker>
  )
}
