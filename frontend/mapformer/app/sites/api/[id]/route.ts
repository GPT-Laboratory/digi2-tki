import { getSite } from "@/utils/dataHelper";

export async function GET(request: any, {params}: any) {
  const data = getSite(params.id);

  return data ? Response.json( data ) : new Response(undefined, { status: 404 })
}
