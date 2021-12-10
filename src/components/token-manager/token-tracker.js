import React, { useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { Typography, Box, Button } from "@mui/material";

import DeleteTokenModal from "./delete-token-modal";

const TokenTracker = ({ tokens, onDeleteToken, onSendToken }) => {
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);

 const [tokenSelected, setToken] = useState({});

 const openDeleteTokenModal = (token) => {
  setToken(token);
  setDeleteModalOpen(true);
  console.log("openDeleteTokenModal", token);
 };

 const handleDeleteModalClose = (deleteToken) => {
  console.log("handleDeleteModalClose", deleteToken);
  setDeleteModalOpen(false);
  if (deleteToken) {
   onDeleteToken(tokenSelected);
  }
  setToken({});
 };

 const columns = [
  {
   field: "name",
   headerName: "Name",
   flex: 0.4,
   valueGetter: (params) => {
    return params.row.tokenInfo.name;
   },
   renderCell: (params) => (
    <Box>
     <Typography variant="h6">{params.value}</Typography>
    </Box>
   ),
  },
  {
   field: "contractAddress",
   headerName: "Contract Address",
   flex: 1,
  },
  {
   field: "symbol",
   headerName: "Denom",
   flex: 0.2,
   valueGetter: (params) => {
    return params.row.tokenInfo.symbol;
   },
  },
  {
   field: "balance",
   headerName: "Balance",
   flex: 0.2,
  },
  {
   field: "action",
   type: "actions",
   headerName: "Action",
   flex: 0.4,
   renderCell: (params) => {
    return (
     <>
      <Button
       variant="contained"
       color="primary"
       size="small"
       style={{ marginLeft: 16 }}
       onClick={() => onSendToken(params.row)}
      >
       Send
      </Button>

      <Button
       variant="contained"
       color="error"
       size="small"
       style={{ marginLeft: 16 }}
       onClick={() => openDeleteTokenModal(params.row)}
      >
       Delete
      </Button>
     </>
    );
   },
  },
 ];

 return (
  <>
   <DeleteTokenModal
    open={deleteModalOpen}
    token={tokenSelected}
    handleClose={(res) => {
     handleDeleteModalClose(res);
    }}
   />
   <DataGrid
    components={{
     NoRowsOverlay: NoRows,
    }}
    rows={tokens}
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

const NoRows = () => (
 <GridOverlay>
  <Typography variant="h6">No Tokens</Typography>
 </GridOverlay>
);

const areEqual = (prevProps, nextProps) => {
 /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
 return prevProps.tokens === nextProps.tokens;
};

export default React.memo(TokenTracker, areEqual);
