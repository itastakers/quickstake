import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { GlobalContext } from "../../context/store";
import { delegate, renderBalance } from "../../utils/cosmos";
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

const DelegateModal = ({ open, validator, handleClose }) => {
  const [state, dispatch] = useContext(GlobalContext);

  const [delegation, setDelegation] = useState(0);
  const [currentDelegation] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDelegate = async () => {
    let delegationAmount = parseInt(delegation) * 1000000;
    setLoading(true);

    try {
      const res = await delegate(
        state.chain,
        state.signingClient,
        state.address,
        validator.address,
        delegationAmount
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

  // useEffect(() => {
  //   async function fetchDel() {
  //     const res = await getDelegation(
  //       state.signingClient,
  //       state.address,
  //       validator.address
  //     );
  //     console.log(res, "pippo");

  //     if (res !== undefined) {
  //       setCurrentDelegation(res.amount);
  //     }
  //   }

  //   fetchDel();
  // }, [validator]);

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
          Delegate to {validator.name}
        </Typography>
        <Typography
          id="modal-modal-description"
          variant="subtitle1"
          sx={{ mb: 2 }}
        >
          <b>Your Balance:</b> {renderBalance(state.chain, state.balance)}
          {currentDelegation > 0 && (
            <>
              <br />
              <b>Current Delegation:</b>{" "}
              {renderBalance(state.chain, currentDelegation)}{" "}
            </>
          )}
        </Typography>
        <TextField
          id="outlined-required"
          label="Delegation Amount"
          fullWidth
          value={delegation}
          onChange={(e) => setDelegation(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          disabled={loading}
          onClick={() => {
            handleDelegate();
          }}
        >
          Delegate
        </Button>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Box>
    </Modal>
  );
};

export default DelegateModal;
