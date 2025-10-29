import { getSites } from "@/utils/dataHelper";

export async function GET() {
  const data = getSites();

  return Response.json( data )
}
