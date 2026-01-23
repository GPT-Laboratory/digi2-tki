import { POI } from '@/utils/types';

import L from 'leaflet';

const DELAY_MARKER = '<circle cx="15" cy="15" r="13" fill="none" stroke="crimson" stroke-width="4" />';

export function isDelayed(due_date: number, status: string){
  const currentDate = Date.now();
  if (status != "10" && due_date <= currentDate){
    return true;
  }else{
    return false;
  }
}

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

export function getIconMarker({icon}: {icon: string}){
  const iconMarker = new L.DivIcon({
    html: icon,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
    className: "transparent"
  });
  return iconMarker;
}

export function resolveMarkerIconColor(poi: POI) : string{
  let unit = Array.isArray(poi.unit) ? poi.unit[0] : poi.unit;
  switch(unit){
    case "W": return "blue";
    case "°C": return "darkorange";
    case "RH%": return "darkorange";
    case "m3": return "MediumAquaMarine";
    case "pcs": return "teal";
    case "task": return "salmon";
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
    case "task": return <>TASK</>
    default: return <>UNKNOWN</>
  }
}

export function typeIconGetter(type: number, colorName: string = "#000080", size: string = "48", isDelayed: boolean = false): string{
  switch(type){
    case 101: return `<svg width="${size}" height="${size}" viewBox="0 0 30 30" version="1.1" id="svg-icon-marker" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">${ isDelayed ? DELAY_MARKER : ""}<path id="icon" style="fill:${colorName};stroke-width:1;stroke-linecap:round;stroke-linejoin:bevel" d="M 3.2148438 0 L 2.4648438 0.75 L 2.4648438 3 L 3.9648438 3 L 3.9648438 1.5 L 13.841797 1.5 L 12.341797 6 L 1.8398438 6 L 1 6.75 L 1 9 L 2.6796875 9 L 2.6796875 7.5 L 11.841797 7.5 L 10.341797 12 L 0.90039062 12 L 0 12.75 L 0 15 L 1.8007812 15 L 1.8007812 13.5 L 9.8417969 13.5 L 5 28.025391 L 5.6582031 30 L 24.341797 30 L 25 28.025391 L 20.158203 13.5 L 28.199219 13.5 L 28.199219 15 L 30 15 L 30 12.75 L 29.099609 12 L 19.658203 12 L 18.158203 7.5 L 27.320312 7.5 L 27.320312 9 L 29 9 L 29 6.75 L 28.160156 6 L 17.658203 6 L 16.158203 1.5 L 25.964844 1.5 L 25.964844 3 L 27.464844 3 L 27.464844 0.75 L 26.714844 0 L 3.2148438 0 z M 15 8.8847656 L 16.039062 12 L 13.960938 12 L 15 8.8847656 z M 13.460938 13.5 L 16.539062 13.5 L 20.392578 25.064453 L 9.6074219 25.064453 L 13.460938 13.5 z " /></svg>`;
    case 102: return `<svg width="${size}" height="${size}" viewBox="0 0 30 30" version="1.1" id="svg-icon-marker" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">${ isDelayed ? DELAY_MARKER : ""}<path id="icon" style="fill:${colorName};stroke-linecap:round;stroke-linejoin:round" d="M 15 2.5 A 3 1.5 0 0 0 12 4 L 4 4 A 1.50015 1.50015 0 0 0 2.5 5.5 L 2.5 28.5 A 1.50015 1.50015 0 0 0 4 30 L 26 30 A 1.50015 1.50015 0 0 0 27.5 28.5 L 27.5 5.5 A 1.50015 1.50015 0 0 0 26 4 L 18 4 A 3 1.5 0 0 0 15 2.5 z M 5.5 7 L 24.5 7 L 24.5 27 L 5.5 27 L 5.5 7 z M 13.267578 9.8828125 C 13.122997 9.8931881 12.943948 9.9474663 12.705078 10.0625 C 11.431105 10.676013 12.573023 11.083941 11.691406 12.189453 C 10.80979 13.294965 10.156442 12.27184 9.8417969 13.650391 C 9.5271519 15.028942 10.558401 14.39098 10.873047 15.769531 C 11.187696 17.148082 9.9816647 17.02144 10.863281 18.126953 C 11.744898 19.232465 11.89009 18.027113 13.164062 18.640625 C 14.438035 19.254138 13.585997 20.119141 15 20.119141 C 16.414003 20.119141 15.561965 19.254137 16.835938 18.640625 C 18.10991 18.027114 18.255102 19.232465 19.136719 18.126953 C 20.018335 17.02144 18.812308 17.148082 19.126953 15.769531 C 19.441598 14.39098 20.472848 15.028942 20.158203 13.650391 C 19.843558 12.271837 19.19021 13.294965 18.308594 12.189453 C 17.426977 11.083941 18.568895 10.676013 17.294922 10.0625 C 16.020949 9.448987 16.414003 10.595703 15 10.595703 C 13.851122 10.595703 13.894098 9.8378514 13.267578 9.8828125 z M 7.5 23 L 7.5 24 L 22.5 24 L 22.5 23 L 7.5 23 z M 7.5 25 L 7.5 26 L 22.5 26 L 22.5 25 L 7.5 25 z " /></svg>`;
    case 110: return `<svg width="${size}" height="${size}" viewBox="0 0 30 30" version="1.1" id="svg-icon-marker" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">${ isDelayed ? DELAY_MARKER : ""}<path style="display:inline;fill:#ffffff;fill-opacity:1;stroke:${colorName};stroke-width:2;stroke-linecap:round;stroke-linejoin:round" d="M 29.008217,28.99178 H 0.99178289 L 15,4.32824 Z" id="marker" /><path id="icon" style="fill:${colorName};fill-opacity:1;stroke:none;stroke-opacity:1" d="M 13.21875 10.564453 L 13.75 20.742188 L 16.291016 20.742188 L 16.822266 10.564453 L 13.21875 10.564453 z M 15.009766 22.533203 C 14.502822 22.533203 14.070095 22.665799 13.708984 22.929688 C 13.354818 23.193576 13.177734 23.651911 13.177734 24.304688 C 13.177734 24.929686 13.354818 25.380426 13.708984 25.658203 C 14.070095 25.93598 14.502822 26.076172 15.009766 26.076172 C 15.50282 26.076172 15.927083 25.93598 16.28125 25.658203 C 16.64236 25.380426 16.822266 24.929686 16.822266 24.304688 C 16.822266 23.651911 16.64236 23.193576 16.28125 22.929688 C 15.927083 22.665799 15.50282 22.533203 15.009766 22.533203 z " /></svg>`;
    default: return `<svg width="${size}" height="${size}" viewBox="0 0 30 30" version="1.1" id="svg-icon-marker" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"></svg>`;
  }
}
