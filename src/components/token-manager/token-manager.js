import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/store";
import { Typography, Box, Alert, Paper, Button } from "@mui/material";

import TokenTracker from "./token-tracker";
import TxsTracker from "./txs-tracker";
import AddTokenModal from "./add-token-modal";
import SendTokenModal from "./send-token-modal";

import {
 getCustomTokenBalance,
 getCustomTokenInfo,
 sendCustomToken,
} from "../../utils/cosmos";

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

/**
 * Simple promise wrapper for local storage
 */
const TxService = {
 getTxs: () =>
  new Promise((resolve, reject) => {
   try {
    const allTxs = localStorage.getItem("myTxs");
    if (allTxs) {
     resolve(JSON.parse(allTxs));
    }
    resolve([]);
   } catch (e) {
    reject(e);
   }
  }),
 addTx: (tx) =>
  new Promise((resolve, reject) => {
   try {
    const allTxs = localStorage.getItem("myTxs");
    if (allTxs) {
     const all = JSON.parse(allTxs);
     localStorage.setItem("myTxs", JSON.stringify([tx, ...all]));
    } else {
     localStorage.setItem("myTxs", JSON.stringify([tx]));
    }
    resolve();
   } catch (e) {
    reject(e);
   }
  }),
 deleteTx: (tx) =>
  new Promise((resolve, reject) => {
   try {
    const allTxs = localStorage.getItem("myTxs");
    if (allTxs) {
     const all = JSON.parse(allTxs);
     const filtered = all.filter((t) => t.id !== tx.id);
     localStorage.setItem("myTxs", JSON.stringify(filtered));
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
 const [myTxs, setMyTxs] = useState([]);

 //MODAL
 const [addTokenModalOpen, setAddTokenModalOpen] = useState(false);
 const [sendTokenModalOpen, setSendTokenModalOpen] = useState(false);
 const [sendTokenModalLoading, setSendTokenModalLoading] = useState(false);
 const [selectedTokenToSend, setSelectedTokenToSend] = useState({});

 useEffect(() => {
  //This use effect refresh custom tokens balance
  //when network change
  console.log("TokenManager useEffect changed address");
  refreshMyTokens();
 }, [state.address]);

 const handleNewToken = async (token) => {
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
  if (!toAddress || !amount) {
   setSendTokenModalOpen(false);
   return;
  }
  if (amount.includes("backdrop")) {
   setSendTokenModalOpen(false);
   return;
  }
  setSendTokenModalLoading(true);
  console.log(toAddress, amount);
  sendCustomToken(
   state.chain.chain_id,
   state.chain.rpc,
   selectedTokenToSend.contractAddress,
   selectedTokenToSend.tokenInfo.decimals,
   amount,
   toAddress,
   state.address,
   250000,
   0.1,
   state.chain.coinMinimalDenom
  )
   .then(
    (res) => {
     if (!res) {
      console.error("no response");
      dispatch({
       type: "SET_MESSAGE",
       payload: {
        message: "Error sending token",
        severity: "error",
       },
      });
      return;
     }
     console.log(res);
     if (!res.status) {
      //error
      dispatch({
       type: "SET_MESSAGE",
       payload: {
        message: "Error sending token",
        severity: "error",
       },
      });
     }
     refreshMyTokens();
     const newTx = {
      id: res.txHash,
      type: "send",
      from: state.address,
      to: toAddress,
      amount: amount,
      token: selectedTokenToSend.tokenInfo.name,
      url: res.url,
     };
     console.log(newTx);
     TxService.addTx(newTx).then(refreshMyTxs, console.error);
    },
    (err) => {
     console.error(err);
    }
   )
   .finally(() => {
    setSendTokenModalLoading(false);
    setSendTokenModalOpen(false);
   });
 };

 const refreshMyTokens = () => {
  TokenService.getTokens().then(async (allTokens) => {
   console.log(allTokens);
   if (allTokens) {
    for (const t of allTokens) {
     t.tokenInfo = await getCustomTokenInfo(state.chain.rpc, t.contractAddress);
     t.balance =
      (await getCustomTokenBalance(
       state.address,
       state.chain.rpc,
       t.contractAddress
      )) / Math.pow(10, t.tokenInfo.decimals);
    }
    setMyTokens(allTokens);
   }
  }, console.error);
 };

 const refreshMyTxs = () => {
  TxService.getTxs().then(async (allTxs) => {
   console.log(allTxs);
   setMyTxs(allTxs);
  }, console.error);
 };

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

   <Paper sx={{ mt: 2 }} elevation={0} variant="outlined">
    <Typography
     sx={{ pl: 3, py: 2, borderBottom: "solid rgba(0,0,0,.2) 1px" }}
     variant="h5"
    >
     Your Transactions
    </Typography>

    <TxsTracker txs={myTxs}></TxsTracker>
   </Paper>
  </>
 );
};

export default TokenManager;
