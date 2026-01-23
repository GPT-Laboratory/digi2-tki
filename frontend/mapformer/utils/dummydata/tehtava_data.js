export const tehtavadata = [
  {
    "id": "00000000-0000-0000-5555-000000000001",
    "name": "Oy Yritys Ab.",
    "description": "Esimerkkidataa pilottikohteen demoa varten",
    "unit": "task",
    "options": {
        "location": {
            "lat": 61.492994,
            "lon": 21.800112 },
        "mqtt" : {
          "prefix": "shellies/mapformer/tehtavapilotti/customer/tunniste/Puuvilla",
          "queryType": "TASKS",
          "topics": ["tasks"],
          "variables": [["task", "description", "internal_id", "lat", "long", "name", "notes", "status", "priority", "scheduled_begin", "due_date", "end_date", "workload", "worktype", "assigned_staff"]],
        },
    }
  }
]
