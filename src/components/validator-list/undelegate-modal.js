import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { GlobalContext } from "../../context/store";
import { delegate, getDelegation, renderBalance, undelegate } from "../../utils/cosmos";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

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

const UndelegateModal = ({ open, validator, handleClose }) => {
  const [state, dispatch] = useContext(GlobalContext);

  const [undelegation, setUndelegation] = useState(0);
  const [currentDelegation, setCurrentDelegation] = useState(null);
  const [loading, setLoading] = useState(false);

  if (validator.address) {
    getDelegation(state.signingClient, state.address, validator.address)
      .then(result => setCurrentDelegation(result.amount / 1000000)).catch(() => setCurrentDelegation(0))
  }
  const handleUndelegate = async () => {
    let undelegationAmount = parseFloat(undelegation) * 1000000;

    setLoading(true);

    try {
      const res = await undelegate(
        state.chain,
        state.signingClient,
        state.address,
        validator.address,
        undelegationAmount
      );

      if (!res || res.code !== 0) {
        dispatch({
          type: "SET_MESSAGE",
          payload: {
            message: `There was an error processing your tx. ${res.rawLog}`,
            severity: "error",
          },
        });
      } else {
        dispatch({
          type: "SET_MESSAGE",
          payload: {
            message: `Transaction successfully broadcasted! Hash: ${res.transactionHash}`,
            severity: "success",
          },
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_MESSAGE",
        payload: {
          message: `${error}`,
          severity: "error",
        },
      });

      console.log(error);
    }

    setLoading(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Undelegate from {validator.name}
        </Typography>
        <Typography
          id="modal-modal-description"
          variant="subtitle1"
          sx={{ mb: 2 }}
        >
          <b>Currently delegated:</b> {currentDelegation ?? 0} {state.chain.coinDenom}
        </Typography>
        <TextField
          id="outlined-required"
          label="Undelegation Amount"
          fullWidth
          value={undelegation}
          onChange={(e) => setUndelegation(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          disabled={loading}
          color="error"
          onClick={() => {
            handleUndelegate();
          }}
        >
          Undelegate
        </Button>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Box>
    </Modal>
  );
};

export default UndelegateModal;
