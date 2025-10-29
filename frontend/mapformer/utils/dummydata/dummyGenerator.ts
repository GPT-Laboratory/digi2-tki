import { POI, Site } from "@/utils/types";

import { sites as DummyData } from "./data"
import { ulkovalot as DummyUlkovaloData } from "./uv_data"
import { varastodata as DummyVarastoData } from "./varasto_data"
import { mittausadata as DummyMittausData } from "./mittaus_data"

import { randomUUID } from "crypto";

// dummyGenerator.ts is a file combining a few hard coded test sites
// this hack also completely bypasses the need for a proper data storage

export function getSites(): Array<Site> {
  return DummyData.map(site => ({ id: site.id , name: site.name }));
}

export function getSite(siteId: string): Site|undefined {
  return DummyData.find(site => ( site.id === siteId ));
}

export function getPOIs(site: Site): Array<POI> {
  if(site.id === "1"){
    return DummyUlkovaloData;
  }else if(site.id === "2"){
    return DummyMittausData;
  }else if(site.id === "3"){
    return DummyVarastoData;
  }else if(site.id === "0"){
    return randomPOIData(site);
  }else{
    return [];
  }
}

export function getPOI(site: Site, poiId: string): POI|undefined {
  let POIs = getPOIs(site);

  if(POIs){
    return POIs.find(poi => ( poi.id === poiId))
  }else{
    return undefined;
  }
}

/** Creates non-sensical random POIs for debugging purposes */
function randomPOIData(site: Site): Array<POI> {
  const data : Array<POI> = [];
  while(data.length < Number(site.id)+3){
    const poi: POI = {
      id: randomUUID(),
      name: site.name + "::Satunnaissensori::" + Number(data.length + 1),
      description: '',
      unit: '',
      options: {
        location: {
          lat: site.options!.location.lat + (Math.random()-0.5) * 0.002,
          lon: site.options!.location.lon + (Math.random()-0.5) * 0.004,
        }
      }
    }
    data.push(poi)
  }
  return data;
}
