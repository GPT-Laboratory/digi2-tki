import { Gauge } from '@mui/x-charts/Gauge';

export default function GaugeBasic({value, min=-10, max=40, unit}: {value: number, min?: number, max?: number, unit: string}){
  return (
    <Gauge
      value={value}
      startAngle={-110}
      endAngle={110}
      height={80}
      valueMin={min}
      valueMax={max}
      text={
        ({ value }) => `${value} ${unit}`
      }
    >
    </Gauge>
  )
}
