import SaveIcon from '@mui/icons-material/Save';
import SaveAlt from "@mui/icons-material/SaveAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, ButtonProps } from "@mui/material";

import { GridToolbarContainer } from "@mui/x-data-grid";

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    onExport: ( overrideHost: boolean ) => void;
    onRefresh: () => void;
  }
}
export const CustomToolbar = ({ onExport, onRefresh } : { onExport: any, onRefresh: any}) => {
  const DEFAULT_DATE = process.env.NODE_ENV === 'development' ? "2025-09-01" : undefined;
  const DEFAULT_TIME_RANGE = 30;

  const buttonCallback = () => {
    onExport(false);
  };
  const fillCallback = () => {  
    onExport(true);
  };
  const refresh = () => {
    onRefresh();
  };

  const buttonProps: ButtonProps = {
    color: 'primary',
    size: 'small',
  };

  return (
    <GridToolbarContainer>
      { onExport && 
        <>
          <Button {...buttonProps} startIcon={<SaveIcon/>} onClick={buttonCallback}>Käyttäjä: Tallenna valitut rivit</Button>
          <Button {...buttonProps} color="warning" startIcon={<SaveAlt/>} onClick={fillCallback}>Palveluntarjoaja: Tallenna valitut rivit</Button>
        </>
      }
      <Button {...buttonProps} color="warning" startIcon={<RefreshIcon/>} onClick={refresh}>Päivitä taulukko</Button>
      <div>Suodattimet:
        &nbsp;
        <span>Päivämäärä</span><input id="filter_date" type="date" placeholder="Valitse päivämäärä" defaultValue={DEFAULT_DATE} />
        &nbsp;
        <span>Jakson pituus<input id="filter_range" type="number" placeholder="Ajanjakso (päivää)" defaultValue={DEFAULT_TIME_RANGE} min={0} max={365} /></span><span>pv</span>
      </div>
    </GridToolbarContainer>
  );
}
