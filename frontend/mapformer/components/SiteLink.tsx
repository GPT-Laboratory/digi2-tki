import { Site } from "@/utils/types";
import Link from "next/link";

export function SiteLink({site}: {site: Site} ) {
  return (
   <Link href={`/sites/${site.id}`}>
      <div className={undefined}>
        <span>{site.name}</span> <span>(#{site.id})</span>
      </div>
    </Link>
  );
}
