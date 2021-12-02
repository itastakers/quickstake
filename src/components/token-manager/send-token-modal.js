import {
 Modal,
 Typography,
 Box,
 Button,
 Grid,
 Alert,
 LinearProgress,
 TextField,
} from "@mui/material";
import React, { useState } from "react";

const style = {
 position: "absolute",
 top: "50%",
 left: "50%",
 transform: "translate(-50%, -50%)",
 width: 400,
 bgcolor: "background.paper",
 boxShadow: 24,
 p: 4,
};

const initialState = {
 address: "",
 amount: "",
};

const SendTokenModal = ({ open, token, handleClose }) => {
 const [error, setError] = useState(false);

 const [sendInfo, setSendInfo] = useState(initialState);

 const handleChange = (name) => (event) => {
  setSendInfo({ ...sendInfo, [name]: event.target.value });
 };

 const handleSend = async () => {
  console.log(sendInfo);
  if (
   sendInfo.address === "" ||
   sendInfo.amount === "" ||
   sendInfo.amount === 0
  ) {
   setError({
    title: "Error: missed parameters",
   });
   return;
  }
  setError(null);
  setLoading(true);
 };

 const [loading, setLoading] = useState(false);

 return (
  <Modal
   open={open}
   onClose={handleClose}
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
       Send token: {token.name}
      </Typography>
     </Grid>

     <Grid item xs={12}>
      <Typography
       id="modal-modal-description"
       variant="subtitle1"
       sx={{ mb: 2 }}
      >
       <b>Your Balance:</b> !!!
      </Typography>
     </Grid>

     <Grid item xs={12}>
      <TextField
       label="Sender address"
       fullWidth
       disabled={loading}
       value={sendInfo.address}
       onChange={handleChange("address")}
       sx={{ mb: 2 }}
      />
     </Grid>
     <Grid item xs={12}>
      <TextField
       label="Amount"
       fullWidth
       type="number"
       disabled={loading}
       value={sendInfo.amount}
       onChange={handleChange("amount")}
       sx={{ mb: 2 }}
      />
     </Grid>
     <Grid item xs={12} textAlign="center">
      <Button
       variant="contained"
       disabled={loading}
       onClick={() => {
        handleSend();
       }}
      >
       Send
      </Button>
     </Grid>
    </Grid>
    {loading && <LinearProgress sx={{ mt: 2 }} />}
   </Box>
  </Modal>
 );
};

export default SendTokenModal;
