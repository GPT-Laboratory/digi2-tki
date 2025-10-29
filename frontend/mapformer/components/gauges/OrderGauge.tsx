import { POI, DataPoint } from "@/utils/types";
import DetailedInfo from "./DetailedInfo";

import { Button } from "@mui/material";
import { useState } from "react";

export function GaugeOrders({dataPoint, poi, updateData, addData}: {dataPoint: DataPoint<Object>, poi: POI, updateData: Function, addData: Function} ) {
  const [expand, setExpand] = useState(false);

  const handleClick = () => {
    setExpand(!expand);
  };
  
  return (
    <>
      <span>{poi.description}</span>
      <SummaryInfo dataPoint={dataPoint} />
      <Button onClick={handleClick} type="button">
          { expand ? <span>Piilota lisätiedot</span> : <span>Näytä lisää tietoja</span> }
      </Button>
      <DetailedInfo dataPoint={dataPoint} onClose={handleClick} showModal={expand} addData={addData} refresh={updateData} />
    </>
  );
}

function SummaryInfo({dataPoint}: {dataPoint: DataPoint<Object>}){
  return <ul>
    <li>Artikkeleiden lukumäärä: {Object.keys(dataPoint.value).length}</li>
    <li>Artikkeleita, joissa ei ole yhtään toimitusta: {Object.values(dataPoint.value).reduce((accumulated, current) => {
        return current === 0 ? accumulated + 1 : accumulated;
      }, 0)}</li>
    <li>Toimitetut kappalemäärät yhteensä: {Object.values(dataPoint.value).reduce((accumulated, current) => {
        return accumulated + current;
      }, 0)}</li>
  </ul>
};
