import { POI } from "@/utils/types";
import Link from "next/link";

export function POILink({siteId, poi}: {siteId: string, poi: POI} ) {
  return (
   <Link href={`/sites/${siteId}/listing/${poi.id}`} target="_blank">
      <span className={undefined}>
        <span>{poi.name}</span> <span>(#{poi.id})</span>
      </span>
    </Link>
  );
}
