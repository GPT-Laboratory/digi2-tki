import { getExternalData } from "@/utils/helpers";
import { DataPoint, POI } from "@/utils/types";
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";

export default async function Page({ params }: { params: { id: string, poiId: string, datapointId: string } }) {
  const poiData: Array<POI> = await getPoiData(params.id);
  const poi = poiData.find(poi => poi.id === params.poiId);
  const dataPoints: Array<DataPoint<any>> = await getDataPoints(params.id, params.poiId);
  const dataPoint = dataPoints.find(dp => dp.id.endsWith(params.datapointId));

  const isEdit = dataPoint?.value;

  async function createTask(formData: FormData) {
    'use server'
    const rawFormData = Object.fromEntries(formData);

    // populate new entry at least with the following data
    // - task (from query path)
    // - lat&long?
    // - priority = 10
    // - status = 0 (aloittamatta)
  }

  async function toggleStatus(formData: FormData) {
    'use server'
    const rawFormData = Object.fromEntries(formData);
    
    if(dataPoint){
      const ts = new Date();
      const dp = {
          id: dataPoint?.id,
          value: { task: dataPoint?.value.task, notes: rawFormData.notes, status: rawFormData.status, end_date: rawFormData.status == "10" ? ts.toISOString() : "" },
          timestamp: ts.valueOf()*1000000 // in ns
        } as DataPoint<any>;
      const retval = await updateDP(poi!, dp);
      if(retval?.success){
        // here be success
      }
    }
  }

  return (
    <>
      <h2 title={JSON.stringify(dataPoint?.value, null, 2)}>Tehtävän tiedot</h2>
        <Stack spacing={1}>
        { isEdit && 
          <Box
            action={toggleStatus}
            component="form"
            autoComplete="off"
          >
            <Stack spacing={2}>
              <h3>Tällä lomakkeella voit lisätä kommenttikenttään merkintöjä sekä päivittää tehtävän tilan</h3>
              <InputLabel id="name-label">{dataPoint?.value.name}</InputLabel>
              <InputLabel id="description-label">{dataPoint?.value.description}</InputLabel>
              <TextField label="Tehtävän kommentit" name="notes" multiline defaultValue={dataPoint?.value.notes} helperText="Verkko-osoitteet (esim. https://...) muunnetaan linkeiksi automaattisesti" />
              <FormControl>
                <InputLabel required id="status-label">Tehtävän tila</InputLabel>
                <Select required name="status"
                    labelId="status-label"
                    label="Tehtävän tila"
                    defaultValue={dataPoint?.value.status}
                >
                  <MenuItem value={0}>Aloittamatta</MenuItem>
                  <MenuItem value={1}>Aloitettu</MenuItem>
                  <MenuItem value={2}>Katselmoitu</MenuItem>
                  <MenuItem value={3}>Keskeytetty</MenuItem>
                  <MenuItem value={10}>Valmis</MenuItem>
                </Select>
              </FormControl>
              
              <Button type="submit" variant="contained">Päivitä tehtävä</Button>
            </Stack>
          </Box>
        }
        

        { !isEdit && <Box
          action={createTask}
          component="form"
          autoComplete="off"
        >
          <fieldset disabled={isEdit} style={{border: 0}}>
          <Stack spacing={2}>
            { isEdit && <h3>Huom! Tämän lomakkeen tietoja ei käsitellä</h3> }
            <TextField required label="Tehtävän nimi" name="name" multiline defaultValue={dataPoint?.value.name} />
            <TextField label="Tehtävän kuvaus" name="description" multiline defaultValue={dataPoint?.value.description} />
            <TextField label="Tehtävän kommentit" name="notes" multiline defaultValue={dataPoint?.value.notes} helperText="Verkko-osoitteet (esim. https://...) muunnetaan linkeiksi automaattisesti" />

            <FormControl>
              <InputLabel required id="status-label">Tehtävän tila</InputLabel>
              <Select required name="status"
                  labelId="status-label"
                  label="Tehtävän tila"
                  defaultValue={dataPoint?.value.status}
              >
                <MenuItem value={0}>Aloittamatta</MenuItem>
                <MenuItem value={1}>Aloitettu</MenuItem>
                <MenuItem value={2}>Katselmoitu</MenuItem>
                <MenuItem value={3}>Keskeytetty</MenuItem>
                <MenuItem value={10}>Valmis</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel required id="worktype-label">Tehtävän tyyppi</InputLabel>
              <Select name="worktype"
                  labelId="worktype-label"
                  label="Tehtävän tyyppi"
                  defaultValue={dataPoint?.value.worktype}
              >
                <MenuItem value={101}>Verkostotyöt</MenuItem>
                <MenuItem value={102}>Urakkatyöt</MenuItem>
                <MenuItem value={110}>Vikatyöt</MenuItem>
                <MenuItem value={100}>Muu</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Vastuuhenkilöt" name="assigned_staff" multiline defaultValue={dataPoint?.value.assigned_staff} />
            <TextField required type="number" label="Työkuorma" name="workload" defaultValue={dataPoint?.value.workload} />

            <TextField required type="datetime" label="Tehtävän suunniteltu alkamisaika" name="scheduled_begin" defaultValue={dataPoint?.value.scheduled_begin} helperText="Muotoilu: 2026-01-01T12:00:00Z" />
            <TextField required type="datetime" label="Tehtävän määräaika" name="due_date" defaultValue={dataPoint?.value.due_date} helperText="Muotoilu: 2026-01-01T12:00:00Z" />
            <TextField type="datetime" disabled={dataPoint ? true : false} label="Tehtävän varsinainen päättymisaika" name="end_date" defaultValue={dataPoint?.value.end_date} helperText="Muotoilu: 2026-01-01T12:00:00Z" />
            
            <Stack direction="row" spacing={2} style={{display: isEdit ? "none" : "" }}>
              <TextField style={{ width: "50%" }} required type="number" label="Latitude" name="lat" defaultValue={dataPoint?.value.lat} helperText="[-90, 90]" />
              <TextField style={{ width: "50%" }} required type="number" label="Longitude" name="long" defaultValue={dataPoint?.value.long} helperText="[-180, 180]"/>
            </Stack>
            <TextField label="Tehtävän tunniste" name="task" defaultValue={params.datapointId} />

            <Button type="submit" variant="outlined" style={{display: isEdit ? "none" : "" }}>Lähetä tiedot</Button>
          </Stack>
          </fieldset>
        </Box>}
      </Stack>
    </>)
}

async function getPoiData(id: string) {
  return (await getExternalData(`sites/api/${id}/POIs`)).json();
}

async function getDataPoints(id: string, poiId: string) {
  return (await getExternalData(`sites/api/${id}/POIs/dataPoints/${poiId}`, true)).json();
}

// fixed build issue:
// see https://github.com/vercel/next.js/discussions/58936
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic'

import { HOST, MEASUREMENT, writeApi, Point } from "@/utils/influxdb";
async function updateDP(poi: POI, dp: DataPoint<any>){
  if(!!!dp){
    return undefined;
  }
  const data = dp.value;
  const host: string = HOST;

  let points: Array<Point> = [];
  
  // Create a new point
  const point = new Point(MEASUREMENT)
    .intField("status", data.status) // from request
    .stringField("notes", data.notes) // from request
    .stringField("end_date", data.end_date) // from request
    .timestamp(dp.timestamp) // from request
    .tag('datapoint', [poi.options?.mqtt?.prefix, poi.options?.mqtt?.topics[0]].join("/"))
    .tag('host', host) // this is HARD CODED by application
    .tag('json', poi.options?.mqtt?.topics[0] as string)
    .tag('location', poi.options?.mqtt?.prefix.split("/").pop() as string)
    // .tag 'name' is only required for case 'orders'
    .tag('task', data.task) // from request datapoint // .tag 'task' is only required for case 'tasks'
  points.push(point);

  try{
    // Write the points to InfluxDB
    const influxWrite = writeApi()
    influxWrite.writePoints(points);
    // Close the write API
    await influxWrite.flush();
    await influxWrite.close();
    return { success: true, message: 'Data written successfully' };
  } catch (error: any) {
    console.error('Error writing data', error);
    return { success: false, message: 'Error writing data', error: error.message };
  };
}
