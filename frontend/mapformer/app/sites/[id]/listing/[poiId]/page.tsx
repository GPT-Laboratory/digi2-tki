import { DataPointLink } from "@/components/DataPointLink";
import { getExternalData } from "@/utils/helpers";
import { DataPoint, POI } from "@/utils/types";

export default async function Page({ params }: { params: { id: string, poiId: string } }) {
  const poiData: Array<POI> = await getPoiData(params.id);
  const dataPoints: Array<DataPoint<any>> = await getDataPoints(params.id, params.poiId);
  const poi = poiData.find(poi => poi.id === params.poiId);

  return (
      <>
        <h2>Työtehtävälistaus ({params.id} & {params.poiId})</h2>
        { poi ? <SimplePOI siteId={params.id} poi={poi} dataPoints={dataPoints} key={poi.id} /> : <></> }
      </>)
}

async function getPoiData(id: string) {
  return (await getExternalData(`sites/api/${id}/POIs`)).json();
}

async function getDataPoints(id: string, poiId: string) {
  return (await getExternalData(`sites/api/${id}/POIs/dataPoints/${poiId}`)).json();
}

// fixed build issue:
// see https://github.com/vercel/next.js/discussions/58936
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic'

function SimplePOI({siteId, poi, dataPoints}: {siteId: string, poi: POI, dataPoints: Array<DataPoint<any>>} ) {
  return (
    <>
      <h3>{poi.name}</h3>
      {dataPoints.map((dp: DataPoint<any>) => {
        const key = dp.id.split("/").pop();
        return <DataPointLink siteId={siteId} poiId={poi.id} dpId={key!} key={key}>
          <span>{dp.value.name}</span> <span>({key})</span>
        </DataPointLink>
      })}
    </>
  );
}
