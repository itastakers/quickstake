import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { GlobalContext } from "../context/store";
import { getAllUnbondingDelegations } from "../utils/cosmos";
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

const UnbondingModal = ({ open, handleClose }) => {
    const [state, dispatch] = useContext(GlobalContext);

    const [undelegation, setUndelegation] = useState(0);
    const [currentDelegation, setCurrentDelegation] = useState(null);
    const [unbondingDelegations, setUnbondingDelegations] = useState([]);
    const [totalUnbonding, setTotalUnbonding] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (state.address) {
            getAllUnbondingDelegations(state.address, state.chain.rpc)
                .then(result => {
                    console.log(result)
                })
                .catch(() => {
                    setTotalUnbonding(0)
                })
        }
    }, [open])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>

            </Box>
        </Modal>
    );
};

export default UnbondingModal;
