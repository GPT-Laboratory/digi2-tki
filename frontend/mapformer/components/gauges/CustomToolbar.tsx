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
      <Button {...buttonProps} startIcon={<SaveIcon/>} onClick={buttonCallback}>Käyttäjä: Tallenna valitut rivit</Button>
      <Button {...buttonProps} color="warning" startIcon={<SaveAlt/>} onClick={fillCallback}>Palveluntarjoaja: Tallenna valitut rivit</Button>
      <Button {...buttonProps} color="warning" startIcon={<RefreshIcon/>} onClick={refresh}>Päivitä taulukko</Button>
    </GridToolbarContainer>
  );
}
