"use client"

import { POI, Site } from '@/utils/types'
import SiteMarker from '@/components/SiteMarker';
import POIMarkers from '@/components/POIMarkers';
import { RotatedBlueprint } from '@/components/RotatedBlueprint';
import MyClickComponent from '@/components/MyClickComponent';

import { ImageOverlay, LayerGroup, LayersControl, MapContainer, TileLayer } from 'react-leaflet'
import { LatLngBoundsLiteral, LatLngExpression, LeafletEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { MutableRefObject, useRef, useState } from 'react';

import styles from "./Map.module.css";

export default function BaseMap(
    {site, POIs}: {site: Site, POIs: Array<POI> | undefined | null},
  ) {
  const layerRef = useRef(null);
  const [sensorsActive, setSensorsActive] = useState(true);

  const handleSensorsEnabled = (e: LeafletEvent) => {
    setSensorsActive(true);
    // activates the data-listener stuff
  };
  const handleSensorsDisabled = (e: LeafletEvent) => {
    setSensorsActive(false);
    // deactivates the data-listener stuff
  };

  return (
    <MapContainer
      center={[site.options!.location.lat, site.options!.location.lon]}
      zoom={site.options!.zoom}
      maxZoom={22}
      minZoom={5}
      scrollWheelZoom={true}
      className={styles.map}
      doubleClickZoom={false}
    >
      <MyClickComponent />
      <LayersControl collapsed={false} position='topright'>
        {/* Base controls */}
        <LayersControl.BaseLayer name="Karttataso" checked>
          <LayerGroup>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={20}
              maxNativeZoom={18}
            />
          </LayerGroup>
        </LayersControl.BaseLayer>
        {site.options!.overlay &&
        <LayersControl.BaseLayer name="Pohjakuva (suurennettu)" checked={false}>
          <LayerGroup>
            <ImageOverlay
              url={site.options!.overlay.url}
              bounds={site.options!.overlay.bounds as LatLngBoundsLiteral}
              opacity={0.75}
              alt={site.description}
            />
          </LayerGroup>
        </LayersControl.BaseLayer>}

        {/* Additional controls */}
        {site.options!.overlay &&
        <LayersControl.Overlay name="Pohjakuva (asemoitu)" checked>
          <LayerGroup ref={layerRef}>
            <RotatedBlueprint
              topLeft={site.options!.overlay?.bounds[0] as LatLngExpression}
              topRight={site.options!.overlay?.bounds[1] as LatLngExpression}
              bottomLeft={site.options!.overlay?.bounds[2] as LatLngExpression}
              url={site.options!.overlay!.url}
              layerGroup={layerRef as MutableRefObject<any>} />
          </LayerGroup>
        </LayersControl.Overlay>}
        <LayersControl.Overlay name="Kohde" checked>
          <LayerGroup>
            <SiteMarker site={site} />
          </LayerGroup>
        </LayersControl.Overlay>
        {POIs && POIs.length > 0 && <LayersControl.Overlay name="Sensorit" checked={sensorsActive}>
          <LayerGroup eventHandlers={{remove: handleSensorsDisabled, add: handleSensorsEnabled}}>
            <POIMarkers site={site} POIs={POIs} sensorsActive={sensorsActive} />
          </LayerGroup>
        </LayersControl.Overlay>
        }
      </LayersControl>
    </MapContainer>
  )
}
