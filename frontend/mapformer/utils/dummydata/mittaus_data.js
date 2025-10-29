export const mittausadata = [
  {
    "id": "00000000-0000-0000-1111-000000000001",
    "name": "Energiamittari/Yliopistokeskus",
    "description": "Shelly Pro 3EM (PRO3#001)",
    "unit": "W",
    "options": {
        "location": {
            "lat": 61.493328, 
            "lon": 21.798706 },
        "influxUrl": "https://otula.pori.tut.fi/digi2/influx/grafana/public-dashboards/e3afb62a4bec49e295b733de89dee5ad",
        "mqtt" : {
          "prefix": "shellies/mapformer/majoituskyla/A-rakennus",
          "queryType": "LAST",
          "topics": ["status/em:0", "online"],
          "variables": [["total_act_power", "a_act_power", "b_act_power", "c_act_power"], [""]],
        }
    }
  }
]
