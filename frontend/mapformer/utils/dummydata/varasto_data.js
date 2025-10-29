export const varastodata = [
  {
    "id": "00000000-0000-0000-2222-000000000001",
    "name": "Oy Yritys Ab.",
    "description": "Asiakasyrityksen esimerkkidataa vuosilta 2022-2024",
    "unit": "pcs",
    "options": {
        "location": {
            "lat": 61.492994,
            "lon": 21.800112 },
        "mqtt" : {
          "prefix": "shellies/mapformer/varastopilotti/customer/202/Osoitetie",
          "queryType": "ORDERS",
          "topics": ["orders"],
          "variables": [["*"]],
        },
    }
  }
]
