import { POI, DataPoint, Site } from "@/utils/types";
import { getIconMarker, isDelayed, typeIconGetter } from '@/utils/mapHelpers';
import { POILink } from "@/components/POILink";
import { DataPointLink } from "@/components/DataPointLink";
import TaskDetails from "./TaskDetails";

import { Button } from "@mui/material";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Marker, Popup } from 'react-leaflet' 
import Link from "next/link";

export function GaugeTasks({site, dataPoints, poi, updateData, addData}: {site: Site, dataPoints: Array<DataPoint<Object>>, poi: POI, updateData: Function, addData: Function} ) {
  const [expand, setExpand] = useState(false);

  const handleClick = () => {
    setExpand(!expand);
  };
  
  return (
    <>
      <span>{poi.description}</span>
      <SummaryInfo dataPoints={dataPoints} />
      <div>Avaa listausnäkymä: <POILink siteId={site.id} poi={poi}/></div>
      <Button onClick={handleClick} type="button">
          { expand ? <span>Piilota lisätiedot</span> : <span>Näytä tiedot taulukossa</span> }
      </Button>
      <TaskDetails site={site} poi={poi} dataPoints={dataPoints} onClose={handleClick} showModal={expand} addData={addData} refresh={updateData} />
      {/* Task Markers information will be added by DataPointMarkers with a React-dom Portal */}
      <DataPointMarkers site={site} poi={poi} dataPoints={dataPoints} />
    </>
  );
}

function SummaryInfo({dataPoints}: {dataPoints: Array<DataPoint<any>>}){
  return <ul>
    <li>Tehtävien kokonaismäärä: {dataPoints.length}</li>
    <li>Valmiit tehtävät: {dataPoints.reduce((accumulated, dataPoint) => {
        return dataPoint.value.status === 10 ? accumulated + 1 : accumulated;
      }, 0)}</li>
    <li>Aloittamattomia tehtäviä: {dataPoints.reduce((accumulated, dataPoint) => {
        return dataPoint.value.status === 0 ? accumulated + 1 : accumulated;
      }, 0)}</li>
  </ul>
};

/**
status:
- 0 not started/aloittamatta
- 1 started/aloitettu
- 2 evaluated/katselmoitu
- 3 stalled/keskeytetty
- 10 finished
*/
export function statusResolver(status: number){
  switch(status){
    case 0: return {color: "black", status: "aloittamatta"};
    case 1: return {color: "darkorange", status: "aloitettu"};
    case 2: return {color: "darkorange", status: "katselmoitu"};
    case 3: return {color: "red", status: "keskeytetty"};
    case 10: return {color: "green", status: "valmis"};
    default: return {color: "black", status: "määrittelemätön"};
  }
}

/**
worktype:
- 100 muut
- 101 verkostotyöt (yrityksen oma työ)
- 102 urakkatyöt (muille myydyt palvelut)
- 110 vikatyöt "kiilatyö"
 */
export function worktypeResolver(type: number): string{
  switch(type){
    case 100: return "Muu";
    case 101: return "Verkostotyö";
    case 102: return "Urakkatyö";
    case 110: return "Vikatyö";
    default: return "Määrittelemätön";
  }
}

function DataPointMarkers({site, poi, dataPoints}: {site: Site, poi: POI, dataPoints: Array<DataPoint<any>>}){
  const [el] = useState(() => document.getElementById(poi.id+"_dp-container"));
  return el ? createPortal(<>
    { dataPoints && dataPoints.map((dp) => {
      const resolved = statusResolver(dp.value.status);
      let index = 0;
      const notes = dp.value.notes.replace(/(https?:\/\/[^\s]+)/g, () => { return `[#${++index}]` });
      const urls = dp.value.notes.match(/https?:\/\/[^\s)]+/g) ?? [];

      return <Marker
          position={[dp.value.lat, dp.value.long]}
          icon={getIconMarker({icon: typeIconGetter(dp.value.worktype, resolved.color, "48", isDelayed(Date.parse(dp.value.due_date), dp.value.status))})}
          key={dp.id}
          title={dp.value.task + ": " + dp.value.name + " (" + resolved.status + ")"}
        >
          <Popup autoPan={false} closeButton={false}>
            <h3>{dp.value.name} ({resolved.status})</h3>
            <div>Tehtävän kuvaus: {dp.value.description}</div>
            <pre>{notes}</pre>
            <ul>
              { urls.map((url: string, index: number) => <li key={"link_"+index}><Link href={url} target="_blank">Linkki #{index+1}</Link></li>)}
            </ul>
            <div>Tehtävä ID: {dp.value.task}</div>
            <div>Työkuorma: {dp.value.workload}</div>
            <div>Tehtävän aloitusaika: {dp.value.scheduled_begin}</div>
            <div>Tehtävän määräaika: {dp.value.due_date}</div>
            <div>Viimeisin päivitys: {new Date(dp.timestamp).toISOString()}</div>
            <div>Henkilöt: {dp.value.assigned_staff.split(",")}</div>
            <div><DataPointLink siteId={site.id} poiId={poi.id} dpId={dp.value.task}>Muokkausnäkymään</DataPointLink></div>
          </Popup>
        </Marker>
    })}
  </>, el) : null;
}
