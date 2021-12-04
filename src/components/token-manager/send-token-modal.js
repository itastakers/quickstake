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
import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../context/store";
import { getCustomTokenBalance } from "../../utils/cosmos";

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

const SendTokenModal = ({ open, isLoading, token, handleClose }) => {
 const [state] = useContext(GlobalContext);
 const [error, setError] = useState(false);
 const [loading, setLoading] = useState(false);
 //  const [balance, setBalance] = useState(0);
 const [sendInfo, setSendInfo] = useState(initialState);

 useEffect(() => {
  setLoading(isLoading);
 }, [isLoading]);

 const handleChange = (name) => (event) => {
  setSendInfo({ ...sendInfo, [name]: event.target.value });
 };

 const handleSend = async () => {
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
  //setLoading(true);
  handleClose(sendInfo.address, sendInfo.amount);
 };

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
       Send token: {token.tokenInfo?.name}
      </Typography>
     </Grid>

     <Grid item xs={12} display="flex" justifyContent="space-between">
      <Typography
       id="modal-modal-description"
       variant="subtitle1"
       lineHeight="2.35"
      >
       <b>Your Balance:</b> {token.balance} {token.tokenInfo?.symbol}
      </Typography>
      <Button
       variant="outlined"
       disabled={loading}
       onClick={() => {
        setSendInfo({ ...sendInfo, amount: token.balance });
       }}
      >
       MAX
      </Button>
     </Grid>

     <Grid item xs={12}>
      <TextField
       label="Recipient address"
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
