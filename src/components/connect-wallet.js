import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
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

import { connectKeplr } from "../utils/keplr";
import { GlobalContext } from "../context/store";
import chains from "../data/chains.json";
import { renderBalance } from "../utils/cosmos";

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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Connect Wallet
          </Typography>
          <List
            sx={{
              bgcolor: "background.paper",
            }}
          >
            <ListItemButton
              onClick={(e) =>
                actionConnect("keplr", state.selectedNetwork, dispatch)
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <ExtensionIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Keplr" secondary="Chrome extension" />
            </ListItemButton>
            <ListItemButton
              disabled
              onClick={(e) =>
                actionConnect("ble", state.selectedNetwork, dispatch)
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <BluetoothIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Ledger Nano X" secondary="Bluethoot" />
            </ListItemButton>
            <Divider variant="inset" component="li" />
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
            <Divider variant="inset" component="li" />
          </List>
        </Box>
      </Modal>
    </>
  );
};

export default ConnectWallet;
