import { LazyMap } from "@/components/LazyMap";
import { getExternalData } from "@/utils/helpers";
import { POI, Site } from "@/utils/types";

export default async function Page({ params }: { params: { id: string } }) {
  const data: Site = await getData(params.id);
  const poiData: Array<POI> = await getPoiData(params.id);
  const debugData: string = JSON.stringify(data, null, 2);

  return (
      <>
        <h2 title={debugData}>{data.name} ({params.id})</h2>
        <div id="map">
          <LazyMap 
            site={data}
            POIs={poiData}
          />
        </div>
      </>)
}

async function getData(id: string) {
  return (await getExternalData(`sites/api/${id}`)).json();
}

async function getPoiData(id: string) {
  return (await getExternalData(`sites/api/${id}/POIs`)).json();
}

// fixed build issue:
// see https://github.com/vercel/next.js/discussions/58936
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic'
