import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import UsbIcon from "@mui/icons-material/Usb";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import ExtensionIcon from "@mui/icons-material/Extension";
import CloseIcon from '@mui/icons-material/Close';
import { StaticImage } from "gatsby-plugin-image";
import { connectKeplr } from "../utils/keplr";
import { GlobalContext } from "../context/store";
import chains from "../data/chains.json";
import { renderBalance } from "../utils/cosmos";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Box,
  IconButton
} from '@mui/material';
const actionConnect = async (type, selectedNetwork, dispatch) => {
  const mergedChains = localStorage.getItem('localChains') ? chains.concat(JSON.parse(localStorage.getItem('localChains'))) : chains;
  const chain = mergedChains.find((c) => c.chain_id === selectedNetwork);

  switch (type) {
    case "keplr":
      await connectKeplr(chain, dispatch);
      break;
    default:
  }
};

const ConnectWallet = () => {
  const [state, dispatch] = useContext(GlobalContext);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (state.address !== "" && state.signer !== null) {
    return (
      <Grid container spacing={1} wrap="wrap">
        <Grid item sm={12} md={9}>
          <Chip label={state.address} variant="outlined" />
        </Grid>
        <Grid item sm={12} md={3}>
          <Chip label={renderBalance(state.chain, state.balance)} />
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Connect Wallet
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="wallet-connection-dialog"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid
            container
            direction="row"
            justifyContent="space-between"
          >
            <div>
              <p className="connect-wallet-title">Connect Wallet</p>
            </div>
            <div>
              <IconButton aria-label="close-icon" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <List
            sx={{
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                pb: 2,
              }}
            >
              <Paper elevation={3}>
                <ListItemButton
                  onClick={(e) =>
                    actionConnect("keplr", state.selectedNetwork, dispatch)
                  }
                >
                  <ListItemAvatar>
                    <StaticImage className="wallet_avatar" src="../images/keplr.png" alt="keplr" />
                  </ListItemAvatar>
                  <ListItemText primary="Keplr" secondary="Keplr Browser Extension" />
                </ListItemButton>
              </Paper>
            </Box>
            <Box
              sx={{
                pb: 2,
              }}
            >
              <Paper elevation={3}>
                <ListItemButton
                  // onClick={(e) =>
                  //   actionConnect("keplr", state.selectedNetwork, dispatch)
                  // }
                >
                  <ListItemAvatar>
                    <StaticImage className="wallet_avatar" src="../images/wallet_connect.png" alt="wallet" />
                  </ListItemAvatar>
                  <ListItemText primary="WalletConnection" secondary="Keplr Mobile" />
                </ListItemButton>
              </Paper>
            </Box>
            {/* <Box
              sx={{
                pb: 2,
              }}
            >
              <Paper elevation={3}>
                <ListItemButton
                  disabled
                  onClick={(e) =>
                    actionConnect("ble", state.selectedNetwork, dispatch)
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 40, height: 40, borderRadius: 10 }}>
                      <BluetoothIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Ledger Nano X" secondary="Bluethoot" />
                </ListItemButton>
              </Paper>
            </Box>
            <Box
              sx={{
                pb: 2,
              }}
            >
              <Paper elevation={3}>
                <ListItemButton
                  disabled
                  onClick={(e) =>
                    actionConnect("webusb", state.selectedNetwork, dispatch)
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <UsbIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Ledger Nano X or S" secondary="USB" />
                </ListItemButton>
              </Paper>
            </Box> */}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectWallet;
