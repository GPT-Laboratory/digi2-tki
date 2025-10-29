import { SiteLink } from "@/components/SiteLink"
import { getExternalData } from "@/utils/helpers";
import { Site } from "@/utils/types";

export default async function Page(){
  const data = await getData();

  return <>
      <h1>Welcome to {process.env.npm_package_name} ({process.env.npm_package_version})</h1>
      <>
        {data.map((site: Site) => (
          <SiteLink site={site} key={site.id} />
        ))}
      </>
    </>
}

async function getData() {
  return (await getExternalData(`sites/api/`)).json();
}

// fixed build issue:
// see https://github.com/vercel/next.js/discussions/58936
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic';
