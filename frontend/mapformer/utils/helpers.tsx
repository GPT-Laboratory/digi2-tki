import styles from "./Common.module.css";
import './Global.css'

import Link from "next/link";
import { notFound } from "next/navigation";

export function poiDataResolver(key: string, item: any){
  switch(key){
    case "imageURL":
      return item.map((url: string) => (<Link key={"poi_link_"+url} href={url} target="_blank"><img src={url} alt="thumbnail" className={styles.thumbnail}/></Link>));
    case "oldID":
      return <code>{key}: {item}</code>
    case "mqtt":
      return <>
          MQTT settings:
          <ul>
            <li title="Prefix">{item.prefix}</li>
            <li title={"Topics (" + item.topics?.length + ")"}>{item.topics.join(", ")}</li>
            <li title="Variables">{item.variables?.join(", ")}</li>
          </ul>
        </>
    default:
        break;
  }

  // alternatives for Object types
  if(Array.isArray(item)){
    return (<><span>{key}: </span><span>{"["+item.join(", ")+"]"}</span></>);
  }else{
    return (<><span>{key}: </span><span>{item}</span></>);
  }
}

export function lastActivityTimestamper(activityText: string, timestamp: number){
  activityText += timestamp ? ` (${new Date(timestamp).toLocaleString()})` : "";
  return activityText;
}

// Fetch data from an external API
export async function getExternalData(path: string): Promise<Response> {
  const response = fetch(`${process.env.URL}/${path}`);

  if (!(await response).ok) {
    // This will activate the closest `error.js` Error Boundary
    notFound();
  }
  return response;
}
