import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/store";
import { Typography, Box, Alert, Paper, Button } from "@mui/material";

import TokenTracker from "./token-tracker";
import AddTokenModal from "./add-token-modal";
import SendTokenModal from "./send-token-modal";


/**
 * Simple promise wrapper for local storage
 */
const TokenService = {
 getTokens: () =>
  new Promise((resolve, reject) => {
   try {
    const allTokens = localStorage.getItem("myTokens");
    if (allTokens) {
     resolve(JSON.parse(allTokens));
    }
    resolve([]);
   } catch (e) {
    reject(e);
   }
  }),
 addToken: (token) =>
  new Promise((resolve, reject) => {
   try {
    const allTokens = localStorage.getItem("myTokens");
    if (allTokens) {
     const all = JSON.parse(allTokens);
     localStorage.setItem("myTokens", JSON.stringify([token, ...all]));
    } else {
     localStorage.setItem("myTokens", JSON.stringify([token]));
    }
    resolve();
   } catch (e) {
    reject(e);
   }
  }),
 deleteToken: (token) =>
  new Promise((resolve, reject) => {
   try {
    const allTokens = localStorage.getItem("myTokens");
    if (allTokens) {
     const all = JSON.parse(allTokens);
     const filtered = all.filter((t) => t.id !== token.id);
     localStorage.setItem("myTokens", JSON.stringify(filtered));
    }
    resolve();
   } catch (e) {
    reject(e);
   }
  }),
};

const TokenManager = () => {
 const [state] = useContext(GlobalContext);
 const [myTokens, setMyTokens] = useState([]);

 //MODAL
 const [addTokenModalOpen, setAddTokenModalOpen] = useState(false);
 const [sendTokenModalOpen, setSendTokenModalOpen] = useState(false);
 const [selectedTokenToSend, setSelectedTokenToSend] = useState({});

 const handleNewToken = (token) => {
  setAddTokenModalOpen(false);
  if (!token) return;
  console.log(token);
  TokenService.addToken(token).then(refreshMyTokens, console.error);
 };

 const deleteToken = (token) => {
  console.log("deleteToken", token);
  TokenService.deleteToken(token).then(refreshMyTokens, console.error);
 };

 const sendToken = (token) => {
  console.log("sendToken", token);
  setSelectedTokenToSend(token);
  setSendTokenModalOpen(true);
 };

 const refreshMyTokens = () => {
  TokenService.getTokens().then((allTokens) => {
   console.log(allTokens);
   if (allTokens) {
    setMyTokens(allTokens);
   }
  }, console.error);
 };

 useEffect(() => {
  refreshMyTokens();
 }, []);

 return (
  <>
   <AddTokenModal
    open={addTokenModalOpen}
    handleClose={(newToken) => handleNewToken(newToken)}
   ></AddTokenModal>
   <SendTokenModal
    open={sendTokenModalOpen}
    handleClose={() => setSendTokenModalOpen(false)}
    token={selectedTokenToSend}
   ></SendTokenModal>

   {state.message && (
    <Alert sx={{ mb: 3 }} severity={state.message.severity}>
     {state.message.text}
    </Alert>
   )}
   <Box display="flex" justifyContent="flex-end">
    <Button
     variant="contained"
     color="success"
     onClick={() => setAddTokenModalOpen(true)}
     sx={{ m: 2 }}
    >
     Add Token
    </Button>
   </Box>
   <Paper elevation={0} variant="outlined">
    <Typography
     sx={{ pl: 3, py: 2, borderBottom: "solid rgba(0,0,0,.2) 1px" }}
     variant="h5"
    >
     Your Tokens
    </Typography>

    <TokenTracker
     tokens={myTokens}
     onDeleteToken={(token) => deleteToken(token)}
     onSendToken={(token) => sendToken(token)}
    ></TokenTracker>
   </Paper>
  </>
 );
};

export default TokenManager;
