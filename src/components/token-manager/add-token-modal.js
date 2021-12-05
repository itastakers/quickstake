import {
 Alert,
 TextField,
 Grid,
 Box,
 Modal,
 Button,
 Typography,
} from "@mui/material";
import React, { useState } from "react";

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

const initialState = {
 id: "",
 contractAddress: "",
};

const AddTokenModal = ({ open, handleClose }) => {
 //FORM
 const [values, setValues] = useState(initialState);

 const [error, setError] = useState(false);

 const handleChange = (name) => (event) => {
  setValues({ ...values, [name]: event.target.value });
 };

 const handleNewToken = () => {
  if (values.contractAddress === "") {
   setError({
    title: "Error: missed parameters",
   });
  } else {
   setError(null);
   values.id = values.contractAddress;
   handleClose(values);
   setValues(initialState);
  }
 };

 return (
  <Modal
   open={open}
   onClose={() => handleClose(false)}
   aria-labelledby="modal-modal-title"
   aria-describedby="modal-modal-description"
  >
   <Box sx={style}>
    {error && <Alert severity="error">{error.title}</Alert>}
    <Grid container spacing={2}>
     <Grid item xs={12}>
      <Typography
       id="modal-modal-title"
       variant="h6"
       component="h2"
       sx={{ mb: 2 }}
      >
       Add new token to track
      </Typography>
     </Grid>
     <Grid item xs={12}>
      <TextField
       onChange={handleChange("contractAddress")}
       label="Contract Address"
       value={values.contractAddress}
       fullWidth
       sx={{ mb: 2 }}
      />
     </Grid>
     <Grid item xs={12}>
      <Button
       variant="contained"
       onClick={() => {
        handleNewToken();
       }}
      >
       Add Token
      </Button>
     </Grid>
    </Grid>
   </Box>
  </Modal>
 );
};

export default AddTokenModal;
