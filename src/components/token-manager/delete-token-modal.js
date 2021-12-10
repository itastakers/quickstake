import React from "react";

import { Typography, Grid, Box, Modal, Button } from "@mui/material";

const DeleteTokenModal = ({ open, token, handleClose }) => {
 const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
 };
 return (
  <Modal
   open={open}
   onClose={handleClose}
   aria-labelledby="modal-modal-title"
   aria-describedby="modal-modal-description"
  >
   <Box sx={style}>
    <Grid container spacing={2}>
     <Grid item xs={12}>
      <Typography
       id="modal-modal-title"
       variant="h6"
       component="h2"
       sx={{ mb: 2 }}
      >
       Are you sure you want to delete this token {token.name}?
      </Typography>
     </Grid>
     <Grid item xs={12} textAlign="center">
      <Button
       style={{ marginRight: "10px" }}
       variant="contained"
       color="success"
       onClick={() => {
        handleClose(false);
       }}
      >
       Cancel
      </Button>
      <Button
       variant="contained"
       color="error"
       onClick={() => {
        handleClose(true);
       }}
      >
       Delete
      </Button>
     </Grid>
    </Grid>
   </Box>
  </Modal>
 );
};

export default DeleteTokenModal;
