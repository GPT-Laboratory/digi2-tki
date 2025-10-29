import { useMapEvents } from 'react-leaflet'

/**
 * This component is for resolving LatLng-values by clicking on the map
 *  */
export default function MyClickComponent() {
  const map = useMapEvents({
    click: (e) => {
      console.log(e.latlng);
      e.originalEvent.stopPropagation();
    },
  })
  return null;
}
