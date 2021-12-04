import React from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { Typography  } from "@mui/material";


const TxsTracker = ({ txs }) => {
 const columns = [
  {
   field: "token",
   headerName: "Token",
   flex: 0.1,
  },
  {
   field: "type",
   headerName: "Type",
   flex: 0.1,
  },
  {
   field: "from",
   headerName: "Sender",
   flex: 0.3,
  },
  {
   field: "to",
   headerName: "Recipient",
   flex: 0.3,
  },
  {
   field: "amount",
   headerName: "Amount",
   flex: 0.1,
  },
  {
   field: "url",
   headerName: "URL",
   flex: 0.1,
   renderCell: (params) => (
    <a href={params.value} target="_blank" rel="noopener noreferrer">
     Explorer
    </a>
   ),
  },
 ];

 return (
  <>
   <DataGrid
    components={{
     NoRowsOverlay: NoRows,
    }}
    rows={txs}
    rowHeight={80}
    columns={columns}
    pageSize={5}
    rowsPerPageOptions={[5]}
    disableSelectionOnClick
    autoHeight
   />
  </>
 );
};

// const NoRows = () => <Typography variant="h6">No Tokens</Typography>;
const NoRows = () => (
 <GridOverlay>
  <Typography variant="h6">No Txs</Typography>
 </GridOverlay>
);

const areEqual = (prevProps, nextProps) => {
 /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
 return prevProps.txs === nextProps.txs;
};

export default React.memo(TxsTracker, areEqual);
