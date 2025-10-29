import { POI } from '@/utils/types';

import L from 'leaflet';

export function getColoredMarker({colorName = "#000080", transparent}: {colorName?: string, transparent: boolean}){
  const coloredMarker = new L.DivIcon({
    html: '<svg width="30" height="60" viewBox="0 0 105.83333 211.66667" version="1.1" id="svg-marker" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><path id="marker" style="display:inline;fill:'+colorName+';stroke-width:0.279707;stroke-linejoin:round" d="M 52.916666,0 C 23.691664,2.273808e-5 1.800098e-5,23.691669 0,52.916667 L 52.916666,211.66666 105.83333,52.916667 C 105.83331,23.691669 82.141665,2.36855e-5 52.916666,0 Z m 0,12.636438 A 40.280152,40.280152 0 0 1 93.196891,52.916667 40.280152,40.280152 0 0 1 52.916666,93.196897 40.280152,40.280152 0 0 1 12.636438,52.916667 40.280152,40.280152 0 0 1 52.916666,12.636438 Z" /><path id="center" style="display:inline;fill:#ffffff;stroke-width:0.279707;stroke-linejoin:round" d="M 52.916666,12.636438 A 40.280152,40.280152 0 0 0 12.636438,52.916667 40.280152,40.280152 0 0 0 52.916666,93.196897 40.280152,40.280152 0 0 0 93.196891,52.916667 40.280152,40.280152 0 0 0 52.916666,12.636438 Z" /></svg>',
    iconSize: [30, 60],
    iconAnchor: [15, 60],
    popupAnchor: [0, -60],
    className: transparent === true ? "transparent" : undefined
  });
  return coloredMarker;
}

export function resolveMarkerIconColor(poi: POI) : string{
  let unit = Array.isArray(poi.unit) ? poi.unit[0] : poi.unit;
  switch(unit){
    case "W": return "blue";
    case "°C": return "darkorange";
    case "RH%": return "darkorange";
    case "m3": return "MediumAquaMarine";
    case "pcs": return "teal";
    default: return "darkgreen";
  }
}

export function resolveMarkerIcon(poi: POI, marker: L.DivIcon|null){
  switch(poi.unit){
    case "W": return <>WATT</>
    case "C": return <>CELCIUS</>
    case "RH%": return <>RH%</>
    case "m3": return <>CUBIC METER</>
    case "pcs": return <>PIECES</>
    default: return <>UNKNOWN</>
  }
}
