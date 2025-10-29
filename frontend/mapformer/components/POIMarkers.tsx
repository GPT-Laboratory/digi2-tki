import { poiDataResolver } from '@/utils/helpers';
import { getColoredMarker, resolveMarkerIcon, resolveMarkerIconColor } from '@/utils/mapHelpers';
import { POI, Site } from '@/utils/types'
import { SensorData } from '@/components/SensorData';
import styles from "@/components/gauges/Sensor.module.css";

import { Marker,Popup, useMap } from 'react-leaflet'
import { useState } from 'react';
import { Link } from '@mui/material';

export default function POIMarkers(
  {site, POIs, sensorsActive}: {site: Site, POIs: Array<POI> | undefined | null, sensorsActive: boolean}
){
  const [debugCounter, setDebugCounter] = useState(0);

  return(
    <>
      {POIs && POIs.map(poi => (
        <Marker
          position={[poi.options.location.lat, poi.options.location.lon]}
          icon={getColoredMarker({colorName: resolveMarkerIconColor(poi), transparent: false})}
          opacity={0.85}
          key={poi.id}
          eventHandlers={{
            dblclick: (event) => setDebugCounter(debugCounter+1),
          }}
        >
          <Popup autoPan={false} closeButton={false}>
            <div className={styles.gaugePopup}>
              <h4 title={poi.description}>{poi.name}</h4>
              { poi.options.mqtt && <SensorData site={site} poi={poi} sensorsActive={sensorsActive} /> }
              <ImageResolver poi={poi} />
              <InfluxData poi={poi} />
              { debugCounter >= 4 && <DebugData poi={poi} /> }
            </div>
          </Popup>
        </Marker>
      ))};
    </>
  )
}


/**
 * Helper modules below
 */

function DebugData(
  {poi}: { poi: POI }
){
  const map = useMap();

  return(
    <ul>
      <li key="unit">{resolveMarkerIcon(poi, null)}</li>
      <li key="poi_desc">description: {poi.description}</li>
      <li key="poi_unit">{ poiDataResolver("unit", poi.unit) }</li>

      { Object.keys(poi.options).length > 1 &&
        Object.keys(poi.options).filter(key => key !== "location").map(key => (
          <li key={"poi_"+key}>{ poiDataResolver(key, poi.options[key]) }</li>
        ))
      }
      <li>{map.project([poi.options.location.lat, poi.options.location.lon]).toString()}</li>
    </ul>
  )
}

function ImageResolver(
  {poi}: { poi: POI }
){
  if(Object.keys(poi.options).includes("imageURL")){
    return (<ul><li key={"poi_imageURL"}>{ poiDataResolver('imageURL', poi.options['imageURL']) }</li></ul>)
  }else{
    return null
  };
}

function InfluxData(
  {poi}: {poi: POI}
){
  if(Object.keys(poi.options).includes("influxUrl")){
    return (<div>Lisätietoja aikasarjatietokantaan koostetusta <Link href={poi.options.influxUrl} target='_blank'>tietonäkymästä</Link></div>);
  }else{
    return null;
  };
};
