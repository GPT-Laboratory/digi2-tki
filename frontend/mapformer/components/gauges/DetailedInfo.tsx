import { DataPoint } from "@/utils/types";
import { CustomToolbar } from "./CustomToolbar";

import styles from "@/components/gauges/Sensor.module.css";

import AddIcon from '@mui/icons-material/DownloadRounded';
import RemoveIcon from '@mui/icons-material/UploadRounded';
import { DataGrid, GridRowsProp, GridColDef, GridActionsCellItem, GridColumnGroupingModel, GridRowModel, GridRowParams, GRID_CHECKBOX_SELECTION_FIELD, GRID_CHECKBOX_SELECTION_COL_DEF, GridCellParams, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import Modal from "react-modal";

export default function DetailedInfo({dataPoint, onClose, showModal, addData, refresh}: {dataPoint: DataPoint<any>, onClose: any, showModal: boolean, addData: Function, refresh: Function}){
  Modal.setAppElement("#map");
  const initialRows: GridRowsProp = Object.keys(dataPoint.value).map((key) => (
    { id: key, name: dataPoint.name[key], orders: dataPoint.value[key], turnover: dataPoint.turnover[key], ts: new Date(dataPoint.ts[key]), lastActivity: new Date(dataPoint.lastActivity[key]) }
  ));
  const [rows, setRows] = useState(initialRows);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  const initialColumns: GridColDef[] = [
    { field: "id", headerName: "Tuotekoodi", align: "right", width: 100 },
    { field: "name", headerName: "Nimike", width: 250 },
    { field: "orders", headerName: "Kok. määrä", type: "number" },
    { field: "turnover", headerName: "Menekki", type: "number" },
    { field: "ts", headerName: "Viimeisin täydennys", type: "dateTime", width: 175 },
    { ...GRID_CHECKBOX_SELECTION_COL_DEF, width: 50 },
    { field: 'actions', headerName: "Työkalut", type: 'actions', width: 180,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<><AddIcon />Tuo</>}
          label="Tuo tuotteita"
          name="Tuo"
          onClick={() => {handleCartModify(params.row.id, 1)}}
        />,
        <GridActionsCellItem
          icon={<><RemoveIcon />Ota</>}
          label="Ota tuotteita"
          onClick={() => {handleCartModify(params.row.id, -1)}}
        />,
      ],
    },
    { field: "cartAmount", headerName: "Määrä", type: "number", editable: true, sortable: false, disableColumnMenu: true, align: "center", disableExport: true, width: 95 },
    { field: "cartDate", headerName: "Päiväys", type: "date", editable: true, sortable: false, disableColumnMenu: true, align: "center", disableExport: true },
    { field: "lastActivity", headerName: "Viimeisin tapahtuma", type: "dateTime", sortable: true, disableColumnMenu: true, align: "center", width: 190 },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Artikkelien perustiedot", headerAlign: "center",
      children: [
        { field: "id"},
        { field: "name" },
        { field: "orders" },
        { field: "turnover" },
        { field: "ts" },
      ],
    },
    {
      groupId: "Hallintalomake", headerAlign: "center",
      children: [
        { field: GRID_CHECKBOX_SELECTION_FIELD },
        { field: "actions"},
        { field: "cartAmount" },
        { field: "cartDate"},
      ],
    },
    {
      groupId: "Lisätietoja", headerAlign: "center",
      children: [
        { field: "lastActivity"},
      ],
    },
  ];

  const handleRefresh = () => {
    refresh();
  }
  const handleCartModify = (id: string, amount: number) => {
    const updatedRows = rows.map((row) =>{
      if(row.id === id){
        const totalAmount =  (row.cartAmount ? row.cartAmount : 0) + amount
        if(totalAmount !== 0){
          if(!selectionModel.includes(id)){ // pre-select a modified row
            setSelectionModel([...selectionModel, id]);
          }
        }else{ // unselect a row with 0 amount
          setSelectionModel(selectionModel.filter(item => item !== id));
        }
        return { ...row, cartAmount: totalAmount }
      }else{
        return row;
      }
    });
    setRows(updatedRows);
  };

  const handleCartOrder = (overrideHost: boolean) => {
    if(selectionModel.length === 0){
      return;
    }
    let orderedRows: Array<any> = [];
    const defaultDate = new Date();
    // handle selected rows, committing order and resetting modifiable row values
    const updatedRows = rows.map((row) => {
      if(selectionModel.includes(row.id)){
        const clearedRow = { ...row,
          orders: row.orders + row.cartAmount,
          turnover: row.cartAmount >= 0 || overrideHost ? row.turnover : (row.turnover + row.cartAmount),
          cartAmount: null, 
          cartDate: null,
          ts: overrideHost ? (row.cartDate ? row.cartDate : defaultDate) : row.ts,
          lastActivity: row.cartDate ? row.cartDate : defaultDate,
        }
        orderedRows.push({ id: row.id, name: row.name, cartAmount: row.cartAmount, cartDate: row.cartDate ? row.cartDate : defaultDate });
        return clearedRow;
      }else{
        return row;
      }
    });

    // make a network update to store values
    addData(orderedRows, { overrideHost: overrideHost });
    // finally update UI State
    setRows(updatedRows);
    setSelectionModel([]); // reset all selections
  };
  const updateRow = (newRow: GridRowModel) => {
      const updatedRows = rows.map((row) =>
        row.id === newRow.id ? newRow : row
      );
      setRows(updatedRows);
      return newRow;
    };

  const customStyles = {
    overlay: {
      zIndex: "1200",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <Modal isOpen={showModal} onRequestClose={onClose} style={customStyles} contentLabel="Varastotilanne">
      <div className={styles.detailedInfo}>
        <DataGrid
          rows={rows}
          columns={initialColumns}
          columnGroupingModel={columnGroupingModel}
          disableRowSelectionOnClick={true}
          processRowUpdate={updateRow}
          onProcessRowUpdateError={() => { console.log("Error happened") }}
          getCellClassName={(params: GridCellParams<any, any, number>) => {
            if (params.field === 'orders' && params.row.orders <= 0){
              return styles.alert
            }else{
              return "";
            }
          }}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: { onExport: handleCartOrder, onRefresh: handleRefresh },
          }}
          checkboxSelection={true}
          isRowSelectable={(params: GridRowParams) => params.row.cartAmount && params.row.cartAmount !== 0}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          rowSelectionModel={selectionModel}
        />
      </div>
    </Modal>
  )
};
