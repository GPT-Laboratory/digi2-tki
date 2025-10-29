import { ImageOverlay, LatLngExpression, LayerGroup } from 'leaflet';
import L from 'leaflet';
import 'leaflet-imageoverlay-rotated';
import { MutableRefObject, useEffect } from 'react';

export function RotatedBlueprint ({
  url, topLeft, topRight, bottomLeft, layerGroup
}: {
  url: string, topLeft: LatLngExpression, topRight: LatLngExpression, bottomLeft: LatLngExpression, layerGroup: MutableRefObject<LayerGroup>
}): null {
  let overlay: ImageOverlay.Rotated|null = null;

  useEffect(() => {
    if(layerGroup && layerGroup.current){
      // Create the rotated image overlay
      overlay = L.imageOverlay.rotated(url, topLeft, topRight, bottomLeft, {
        opacity: 0.35,
      });
      overlay.addTo(layerGroup.current);
    }
  }, []);

  return null;
}
