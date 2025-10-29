import { PieChart } from '@mui/x-charts/PieChart';
import { PieValueType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';

export default function PieGauge({value, variables, index, unit}: {value: any, variables: Array<string>, index: number, unit: string|Array<string>}){

  function initData(data: any): [ Array<MakeOptional<PieValueType, "id">>, number ] {
    let sum: number = 0;
    let tempSum: number = 0;
    let outerData: Array<MakeOptional<PieValueType, "id">> = new Array<MakeOptional<PieValueType, "id">>();
    variables.map((variable: string, varIndex: number) => {
      if(variable.startsWith("total_")){
        sum = Number.parseFloat(data[variable]);
        return;
      }else{
        tempSum += Number.parseFloat(data[variable]);
      }
      const item: MakeOptional<PieValueType, "id"> = { 
        id: `series-${variable}-${varIndex}`,
        label: `${variable} ${Array.isArray(unit) ? unit[index] : unit}`,
        value: Number.parseFloat(data[variable]),
        color: "green"
      }
      outerData.push(item);
    });
    return [ outerData, sum > 0 ? sum : tempSum ];
  }

  const [outerData, sum] = initData(value);

  const innerData = [
    { label: `Sum ${unit}`, value: sum, color: 'red' }
  ];

  const series = [
    {
      innerRadius: 0,
      outerRadius: 30,
      cx:100, cy:60,
      id: 'series-1',
      data: innerData,
    },
    {
      innerRadius: 40,
      outerRadius: 50,
      cx:100, cy:60,
      id: 'series-2',
      data: outerData,
    },
  ];

  return (
    <PieChart
      series={series}
      width={200}
      height={120}
      disableAxisListener={true}
      slotProps={{
        legend: { hidden: true },
      }}
    />
  )
}
