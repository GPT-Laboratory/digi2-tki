import { Site } from "@/utils/types";
import { getSite, getPOIs } from "@/utils/dataHelper";

export async function GET(request: any, {params}: any) {
  const site: Site|undefined = getSite(params.id);

  if(!!!site){
    return new Response(undefined, { status: 404 });
  }

  return Response.json(getPOIs(site));
}
