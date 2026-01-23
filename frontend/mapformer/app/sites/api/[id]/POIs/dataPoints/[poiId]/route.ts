import { DataPoint, POI, Site, QueryType } from "@/utils/types";
import { getPOI, getSite } from "@/utils/dataHelper";
import { HOST, MEASUREMENT, queryApi, writeApi, Point } from "@/utils/influxdb";

export async function GET(request: any, {params}: any) {
  let retval = await getDataPoints(params.id, params.poiId);
  if(retval){
    return Response.json(retval);
  }else{
    return new Response(undefined, { status: 404 });
  }
}

export async function POST(request: any, {params}: any) {
  const poi = findPOI(params.id, params.poiId);
  if(!!!poi){
    return new Response(undefined, { status: 404 });
  }
  if(!poi.options.mqtt){
    return new Response(undefined, { status: 404 });
  }

  const data = await request.json(); // construct from request POST body
  const dps: Array<DataPoint<any>> = data.dataPoints;
  const host: string = data.params?.overrideHost ? "xlsx" : HOST;

  let points: Array<Point> = [];
  dps.forEach(dp => {
    // Create a new point
    const point = new Point(MEASUREMENT)
      .floatField(dp.id, dp.cartAmount) // from request BODY / datapoint
      .timestamp(dp.cartDate ? new Date(dp.cartDate) : new Date()) // from request BODY or NOW
      .tag('datapoint', [poi.options?.mqtt?.prefix, poi.options?.mqtt?.topics[0]].join("/"))
      .tag('host', host) // this is (sometimes) HARD CODED by application
      .tag('json', poi.options?.mqtt?.topics[0] as string)
      .tag('location', poi.options?.mqtt?.prefix.split("/").pop() as string)
      .tag('name', dp.name) // from request BODY / datapoint // NOTE .tag 'name' is only required for case 'orders'
      //NOTE .tag 'task' is only required for case 'tasks'
    points.push(point);
  });

  try{
    // Write the points to InfluxDB
    const influxWrite = writeApi()
    influxWrite.writePoints(points);
    // Close the write API
    await influxWrite.flush();
    await influxWrite.close();
    return new Response(JSON.stringify({ message: 'Data written successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error writing data', error);
    return new Response(JSON.stringify({ message: 'Error writing data', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  };
}

async function getDataPoints(siteId: string, poiId: string){
  const poi = findPOI(siteId, poiId);
  if(!!!poi){
    return undefined;
  }
  if(!poi.options.mqtt){
    return undefined;
  }

  const prefix = poi.options.mqtt?.prefix;
  const queryType = poi.options.mqtt?.queryType;
  const fluxQuery = getQuery(queryType, prefix);

  let topics = Array<string>();
  poi.options.mqtt?.topics.forEach((topic) => (topics.push(poi.options.mqtt?.prefix + "/" + topic)));

  try {
    const dataset: Map<string, DataPoint<any>> = new Map();

    await queryApi().collectRows(fluxQuery, (row, meta) => {
      let key:string = meta.get(row, "datapoint");
      if(poi.options.mqtt?.queryType == QueryType.TASKS){
        key += "/" + meta.get(row, "task")
      }
      const topicIndex = topics.findIndex(topic => ( key.startsWith(topic) ));
      if(topicIndex === -1){
        return;
      }
      let dp = dataset.get(key); // get previously instantiated data (if any) by key, ie. topic
      const topicVariables = poi.options.mqtt?.variables ? poi.options.mqtt?.variables.at(topicIndex) : null;

      if(!!!dp){ // instantiate if not already done
        dp = {
          id: key,
          value: (topicVariables === null || topicVariables === undefined) ? null : {},
          timestamp: new Date(meta.get(row, "_time")).valueOf(),
          topic: meta.get(row, "datapoint"),
        } as DataPoint<any>;
        dataset.set(key, dp);
      }
      if(topicVariables && topicVariables.find((variable) => variable === "*")){ // variables: ["*"]
        dp.value = ({...dp.value, [meta.get(row, "_field")]: meta.get(row, "_value")});
        if(topics[topicIndex].endsWith("/orders")){ // special cases with "orders" ie. Case Varastopilotti
          dp.name = ({...dp.name, [meta.get(row, "_field")]: meta.get(row, "name")});
          dp.turnover = ({...dp.turnover, [meta.get(row, "_field")]: meta.get(row, "turnover")});
          dp.ts = ({...dp.ts, [meta.get(row, "_field")]: new Date(meta.get(row, "lastOrderDate")).valueOf()});
          dp.lastActivity = ({...dp.lastActivity, [meta.get(row, "_field")]: new Date(meta.get(row, "_time")).valueOf()});
        }
      }else if(topicVariables && topicVariables.find((variable) => meta.get(row, "_field") === variable)){ // this is the old style where each variable is onw own row as _field & _value
        dp.value = ({...dp.value, [meta.get(row, "_field")]: meta.get(row, "_value")});
      }else if(topicVariables){ // this is the improved style where variables are pivoted to columns, and each row is a new datapoint
        topicVariables.forEach((variable) => dp.value = ({...dp.value, [variable]: meta.get(row, variable)}));
      }else{ // variables: [""] or null
        dp.value = meta.get(row, "_value");
      }
    });
    return Array.from(dataset.values());
  } catch (error) {
    return [];
  }
}

function findPOI(siteId: string, poiId: string): POI|undefined{
  const site: Site|undefined = getSite(siteId);
  if(!!!site){  // makes sure that a site actually exists
    return undefined;
  }
  const poi = getPOI(site, poiId);
  return poi;
}

function getQuery(queryType: string, datapointFilter: string){
  let startTime:string, fn: string, additionalQuery: string, filter: string;
  if(queryType === QueryType.ORDERS){
    startTime = "2022-01-01";
    fn = `dataFn = origData
   	  |> map(fn: (r) => ({r with lastOrderDate: if r.host == "xlsx" then r._time else debug.null(type: "time")}))
      |> map(fn: (r) => ({ r with turnover: if r.host == "xlsx" or r._value > 0.0 then 0.0 else r._value}))
      |> drop(columns: ["_start", "_stop", "_measurement", "host", "location"])
      |> sort(columns: ["_time"], desc: false)
      |> cumulativeSum(columns: ["_value", "turnover"])
  	  |> fill(column: "lastOrderDate", usePrevious: true)
      |> last()`;
    additionalQuery = `|> yield(name: "fn")`;
    filter = `and r.json == "${QueryType.ORDERS.toLowerCase()}"`;
  } else if(queryType === QueryType.TASKS){
    startTime = "2025-01-01";
    fn = `dataFn = data
      |> pivot(rowKey:["task","_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])
      |> fill(column: "assigned_staff", usePrevious: true)
      |> fill(column: "description", usePrevious: true)
      |> fill(column: "due_date", usePrevious: true)
      |> fill(column: "end_date", usePrevious: true)
      |> fill(column: "internal_id", usePrevious: true)
      |> fill(column: "lat", usePrevious: true)
      |> fill(column: "long", usePrevious: true)
      |> fill(column: "name", usePrevious: true)
      |> fill(column: "notes", usePrevious: true)
      |> fill(column: "priority", usePrevious: true)
      |> fill(column: "scheduled_begin", usePrevious: true)
      |> fill(column: "status", usePrevious: true)
      |> fill(column: "workload", usePrevious: true)
      |> fill(column: "worktype", usePrevious: true)
      |> last(column: "_time")`;
    additionalQuery = `|> yield(name: "fn")`;
    filter = `and r.json == "${QueryType.TASKS.toLowerCase()}"`;
  }else{
    startTime = "-1d";
    fn = `dataFn = data
      |> last()`;
    additionalQuery = '|> yield(name: "fn")';
    filter = ''
  }
  return `import "strings"
import "internal/debug"
    origData = from(bucket: "telegraf")
      |> range(start: ${startTime})
      |> filter(fn: (r) => r["_measurement"] == "${MEASUREMENT}")
      |> filter(fn: (r) => exists r.datapoint ${ filter })
      |> filter(fn: (r) => strings.hasPrefix(v: r.datapoint, prefix: "${datapointFilter}/"))

    data = origData
      |> drop(columns: ["_start", "_stop", "_measurement", "host", "location"])

    ${fn}
      ` + additionalQuery;
}
