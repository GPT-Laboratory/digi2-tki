import { lastActivityTimestamper } from "@/utils/helpers";
import styles from "./Sensor.module.css";

export default function GaugeOnline({value, timestamp}: {value: boolean, timestamp: number}){
  const titleText = value ? "online" : "offline";
  return (
    <div 
      className={`${styles.tooltipOnlineTicker} ${value ? styles.online : styles.offline}`}
      title={lastActivityTimestamper(titleText, timestamp)}>
        {value ? "◈" : "◇"}
    </div>
  )
}
