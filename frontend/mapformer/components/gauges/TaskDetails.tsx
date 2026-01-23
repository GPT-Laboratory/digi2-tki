import { DataPoint, POI, Site } from "@/utils/types";
import { statusResolver, worktypeResolver } from "./TaskGauge";
import { CustomToolbar } from "./CustomToolbar";
import { DataPointLink } from "@/components/DataPointLink";
import { isDelayed, typeIconGetter } from "@/utils/mapHelpers";

import styles from "@/components/gauges/Sensor.module.css";

import { DataGrid, GridRowsProp, GridColDef, GridColumnGroupingModel, GridRenderCellParams, GridCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import Modal from "react-modal";

export default function TaskDetails({site, poi, dataPoints, onClose, showModal, addData, refresh}: {site: Site, poi: POI, dataPoints: Array<DataPoint<any>>, onClose: any, showModal: boolean, addData: Function, refresh: Function}){
  Modal.setAppElement("#map");

  const initialRows: GridRowsProp = dataPoints.map((dp) => (
    { ...dp.value, id: dp.id, updated: new Date(dp.timestamp), link: "https://example.org", poiId: poi.id, siteId: site.id }
  ));
  const [rows, setRows] = useState(initialRows);

  const initialColumns: GridColDef[] = [
    { field: "task", headerName: "Tunniste", align: "right", width: 100 },
    { field: "name", headerName: "Otsikko", width: 250 },
    { field: "status", headerName: "Tilatieto", align: "center", renderCell: StatusIcon },
    { field: "worktype", headerName: "Tyyppi", align: "center", width: 95, renderCell: TypeIcon },
    { field: "workload", headerName: "Työkuorma", type: "number" },
    { field: "scheduled_begin", headerName: "Suunniteltu aloitus", type: "string", width: 175 },
    { field: "link", headerName: "Linkki", align: "center", renderCell: LinkIcon },
    { field: "due_date", headerName: "Määräaika", type: "string", width: 175 },
    { field: "end_date", headerName: "Päättynyt", type: "string", width: 175 },
    { field: "description", headerName: "Kuvaus", width: 150 },
    { field: "notes", headerName: "Kommentit", width: 150 },
    { field: "assigned_staff", headerName: "Henkilöt" },
    { field: "priority", headerName: "Prioriteetti", type: "number" },
    { field: "updated", headerName: "Viimeisin päivitys", type: "dateTime", width: 100 },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Perustiedot", headerAlign: "center",
      children: [
        { field: "link" },
        { field: "task" },
        { field: "name" },
        { field: "status" },
        { field: "worktype" },
        { field: "workload" },
        { field: "scheduled_begin" },
      ],
    },
    {
      groupId: "Lisätietoja", headerAlign: "center",
      children: [
        { field: "due_date" },
        { field: "end_date" },
        { field: "description" },
        { field: "notes" },
        { field: "assigned_staff" },
        { field: "priority" },
        { field: "updated" },
      ],
    },
  ];

  const handleRefresh = () => {
    refresh();
  }

  const customStyles = {
    overlay: {
      zIndex: "1200",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <Modal isOpen={showModal} onRequestClose={onClose} style={customStyles} contentLabel="Tehtävälistaus">
      <div className={styles.detailedInfo}>
        <DataGrid
          rows={rows}
          columns={initialColumns}
          columnGroupingModel={columnGroupingModel}
          columnVisibilityModel={{ task: false }}
          disableRowSelectionOnClick={true}
          getCellClassName={(params: GridCellParams<any, any, number>) => {
            // paint the cell red if task was NOT finished (status==10) AND due date is in the past
            const due = Date.parse(params.row.due_date)
            if (params.field === 'due_date' && isDelayed(due, params.row.status) ){
              return styles.alert
            }else{
              return "";
            }
          }}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: { onRefresh: handleRefresh },
          }}
        />
      </div>
    </Modal>
  )
};

function LinkIcon({ row }: GridRenderCellParams) {
 const resolved = statusResolver(row.status);
 const svgContent = typeIconGetter(row.worktype, resolved.color, "24");
 return <DataPointLink siteId={row.siteId} poiId={row.poiId} dpId={row.task}><SvgWrapper svgString={svgContent} /></DataPointLink>;
}

function StatusIcon({ row }: GridRenderCellParams) {
  const resolved = statusResolver(row.status);
  return resolved.status;
}

function TypeIcon({ row }: GridRenderCellParams) {
  return worktypeResolver(row.worktype);
}

type SvgWrapperProps = {
  svgString: string;
};

const SvgWrapper: React.FC<SvgWrapperProps> = ({ svgString }) => {
  return (
    <div
      // This will render the raw SVG markup
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};
