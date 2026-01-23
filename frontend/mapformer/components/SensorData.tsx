import { Site, POI, DataPoint, QueryType } from "@/utils/types";
import { lastActivityTimestamper } from "@/utils/helpers";

import GaugeBasic from "@/components/gauges/BasicGauge";
import GaugeOnline from "@/components/gauges/GaugeOnline";
import PieGauge from "@/components/gauges/PieGauge";
import styles from "@/components/gauges/Sensor.module.css";
import { GaugeOrders } from "@/components/gauges/OrderGauge";
import { GaugeTasks } from "@/components/gauges/TaskGauge";

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
          setData(null);
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
        resolveSensorComponent(site, topic, poi, index, data, updateDataHelper, postDataHelper)
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

function resolveSensorComponent(site: Site, topic: string, poi: POI, index: number, data: Array<DataPoint<any>>, updateData: Function, addData: Function){
  let dataPoints = data.filter((dp) => ( dp.topic ? dp.topic.endsWith(topic) : false ));
  let variables = poi.options.mqtt!.variables ? poi.options.mqtt!.variables[index] : [""];
  if(dataPoints.length < 1){
    return undefined;
  }
  let firstDataPoint = dataPoints.at(0)!; // kind'a hack, but most of the time there is only one datapoint result. The modules which can handle more shall request the whole array
  
  let dataElement;
  switch(topic){
    // actually the following case should be resolved from the POI's MQTT variables field
    case "online":
      dataElement = <GaugeOnline value={firstDataPoint.value} timestamp={firstDataPoint.timestamp} />;
      break;
    // actually the two following cases should be resolved from the POI's unit field
    case "sensor/temperature":
    case "status/temperature:0":
      dataElement = <GaugeBasic value={Number.parseFloat(firstDataPoint.value)} min={10} max={40} unit={poi.unit[index]} />
      break;
    case "sensor/humidity":
    case "status/humidity:0":
      dataElement = <GaugeBasic value={Number.parseFloat(firstDataPoint.value)} min={0} max={100} unit={poi.unit[index]} />
      break;
    case "water:K":
    case "water:L":
      dataElement = <h3>{firstDataPoint.value} {poi.unit} @ {new Date(firstDataPoint.timestamp).toLocaleString()}</h3>
      break;
    case "orders":
      dataElement = <GaugeOrders poi={poi} dataPoint={firstDataPoint} updateData={updateData} addData={addData} />
      break;
    case "tasks":
      dataElement = <GaugeTasks site={site} poi={poi} dataPoints={dataPoints} updateData={updateData} addData={addData} />
      break;
    default:
      dataElement = <PieGauge value={firstDataPoint.value} variables={variables} index={index} unit={poi.unit} />
      break;
  }
  return <div key={firstDataPoint!.id} className={styles.gauge}>
    <div title={lastActivityTimestamper('', firstDataPoint.timestamp)}>{topic !== 'online' && topic !== QueryType.ORDERS.toLowerCase() && topic !== QueryType.TASKS.toLowerCase() ? topic : "" }</div>
    {dataElement}
  </div>
}
