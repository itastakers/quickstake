import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/store";
import { Typography, Box, Alert, Paper, Button } from "@mui/material";

import TokenTracker from "./token-tracker";
import AddTokenModal from "./add-token-modal";
import SendTokenModal from "./send-token-modal";

import { getCustomTokenBalance, sendCustomToken } from "../../utils/cosmos";

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
 const [state, dispatch] = useContext(GlobalContext);
 const [myTokens, setMyTokens] = useState([]);

 //MODAL
 const [addTokenModalOpen, setAddTokenModalOpen] = useState(false);
 const [sendTokenModalOpen, setSendTokenModalOpen] = useState(false);
 const [sendTokenModalLoading, setSendTokenModalLoading] = useState(false);
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

 const handleSendToken = (toAddress, amount) => {
  setSendTokenModalLoading(true);
  //setSendTokenModalOpen(false);
  if (!toAddress || !amount) return;
  console.log(toAddress, amount);
  sendCustomToken(
   state.chain,
   selectedTokenToSend,
   amount,
   toAddress,
   250000,
   10
  ).then(
   (res) => {
    console.log(res);
    if (res.code === 5) {
     //error
     dispatch({
      type: "SET_MESSAGE",
      payload: {
       message: res.rawLog,
       severity: "error",
      },
     });
     //  dispatch({
     //   type: "SET_ERROR",
     //   payload: res.rawLog,
     //  });
    }
    setSendTokenModalLoading(false);
    setSendTokenModalOpen(false);
   },
   (err) => {
    console.error(err);
    setSendTokenModalLoading(false);
    setSendTokenModalOpen(false);
   }
  );
 };

 const refreshMyTokens = () => {
  TokenService.getTokens().then(async (allTokens) => {
   console.log(allTokens);
   if (allTokens) {
    for (const t of allTokens) {
     t.balance = await getCustomTokenBalance(
      state.address,
      state.chain.rpc,
      t.contractAddress
     );
    }
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
    isLoading={sendTokenModalLoading}
    handleClose={(toAddress, amount) => handleSendToken(toAddress, amount)}
    token={selectedTokenToSend}
   ></SendTokenModal>
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
