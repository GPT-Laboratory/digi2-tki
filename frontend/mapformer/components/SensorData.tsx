import { Site, POI, DataPoint } from "@/utils/types";
import { lastActivityTimestamper } from "@/utils/helpers";

import GaugeBasic from "@/components/gauges/BasicGauge";
import GaugeOnline from "@/components/gauges/GaugeOnline";
import PieGauge from "@/components/gauges/PieGauge";
import styles from "@/components/gauges/Sensor.module.css";
import { GaugeOrders } from "@/components/gauges/OrderGauge";

import { useEffect, useState } from "react";

export function SensorData({site, poi, sensorsActive}: {site: Site, poi: POI, sensorsActive: boolean} ) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    updateDataHelper();
  }, []);

  const updateDataHelper = () =>{
    if(sensorsActive && !isLoading){
      setLoading(true);
      getDataPoint(site.id, poi.id)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Something went wrong');
        })
        .then((data) => {
          // Do something with the response
          setData(data);
          setLoading(false);
          setError(false);
        })
        .catch((error) => {
          console.log(error);
          setError(true);
          setLoading(false);
        });
    }
  };

  const postDataHelper = (dataPoints: Array<DataPoint<any>>, params: Object) => {
    if(dataPoints && dataPoints.length > 0){
      addDataPoint(site.id, poi.id, dataPoints, params);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error happened</p>;
  if (!data) return <p>No data</p>;

  return (
    <>
      {
      poi.options.mqtt?.topics.map((topic: string, index: number) => (
        resolveSensorComponent(topic, poi, index, data, updateDataHelper, postDataHelper)
      ))}
    </>
  );
}

function getDataPoint(siteId: string, poiId: string) {
  const response = fetch(`./api/${siteId}/POIs/dataPoints/${poiId}`);
  return response;
}

export function addDataPoint(siteId: string, poiId: string, newDataPoints: Array<DataPoint<any>>, params: Object) {
    const response = fetch(`./api/${siteId}/POIs/dataPoints/${poiId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dataPoints: newDataPoints, params: params }),
    });
    return response
}

function resolveSensorComponent(topic: string, poi: POI, index: number, data: Array<DataPoint<any>>, updateData: Function, addData: Function){
  let dataPoint = data.find((dp) => ( dp.topic ? dp.topic.endsWith(topic) : false ));
  let variables = poi.options.mqtt!.variables ? poi.options.mqtt!.variables[index] : [""];
  if(dataPoint === undefined){
    return undefined;
  }
  
  let dataElement;
  switch(topic){
    // actually the following case should be resolved from the POI's MQTT variables field
    case "online":
      dataElement = <GaugeOnline value={dataPoint.value} timestamp={dataPoint.timestamp} />;
      break;
    // actually the two following cases should be resolved from the POI's unit field
    case "sensor/temperature":
    case "status/temperature:0":
      dataElement = <GaugeBasic value={Number.parseFloat(dataPoint.value)} min={10} max={40} unit={poi.unit[index]} />
      break;
    case "sensor/humidity":
    case "status/humidity:0":
      dataElement = <GaugeBasic value={Number.parseFloat(dataPoint.value)} min={0} max={100} unit={poi.unit[index]} />
      break;
    case "water:K":
    case "water:L":
      dataElement = <h3>{dataPoint.value} {poi.unit} @ {new Date(dataPoint.timestamp).toLocaleString()}</h3>
      break;
    case "orders":
      dataElement = <GaugeOrders poi={poi} dataPoint={dataPoint} updateData={updateData} addData={addData} />
      break;
    default:
      dataElement = <PieGauge value={dataPoint.value} variables={variables} index={index} unit={poi.unit} />
      break;
  }
  return <div key={dataPoint!.id} className={styles.gauge}>
    <div title={lastActivityTimestamper('', dataPoint.timestamp)}>{topic !== 'online' && topic !== 'orders' ? topic : "" }</div>
    {dataElement}
  </div>
}
