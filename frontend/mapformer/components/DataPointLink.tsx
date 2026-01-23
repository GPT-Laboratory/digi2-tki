import Link from "next/link";
import LinkIcon from '@mui/icons-material/Link';
import { Stack } from "@mui/material";

export function DataPointLink({siteId, poiId, dpId, children}: {siteId: string, poiId: string, dpId: string, children?: React.ReactNode} ) {
  const resolved = dpLinkResolver(siteId, poiId, dpId);
  return (
    <Link href={resolved} target="_blank" key={dpId}>
      <Stack direction="row" alignItems="center" gap={1}>
        <span>{ children }</span>
        <LinkIcon titleAccess={resolved} />
      </Stack>
    </Link>
  );
}

export function dpLinkResolver(siteId: string, poiId: string, dpId: string) {
  return `/sites/${siteId}/listing/${poiId}/${dpId}`;
}
