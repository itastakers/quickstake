import { Alert, Typography, TextField, Grid, Box, Modal, Button } from "@mui/material";
import React, { useState, useContext } from "react";
import { GlobalContext } from "../../context/store";
import chains from "../../data/chains.json";
import axios from "axios";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const NewChainModal = ({ open, handleClose }) => {
    const [state, dispatch] = useContext(GlobalContext);
    const [values, setValues] = useState({
        name: '',
        chain_id: '',
        lcd: '',
        rpc: '',
        coinDenom: '',
        coinMinimalDenom: '',
        prefix: '',
        version: '',
        decimals: 0,
        group: 'local'
    });

    const [placeholders] = useState(chains[0]);
    const [error, setError] = useState(false);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    const handleNewChain = () => {
        if (values.lcd && validateChain(values.lcd)) {
            const localChains = localStorage.getItem('localChains') ? JSON.parse(localStorage.getItem('localChains')) : []
            localChains.push(values)
            localStorage.setItem('localChains', JSON.stringify(localChains))

            // Success
            handleClose()

            dispatch({ type: "SET_SELECTED_NETWORK", payload: values.chain_id, chain: values });
        } else {
            setError(true);
        }
    }

    const validateChain = (lcd) => {
        axios
            .get(lcd + "/node_info")
            .then(() => true)
            .catch(() => false)
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {error && <Alert severity="error">The chain you want to add is not valid!</Alert>}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ mb: 2 }}
                        >
                            Add a chain
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleChange("name")}
                            placeholder={placeholders.name}
                            label="Name"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleChange("chain_id")}
                            label="Chain ID"
                            placeholder={placeholders.chain_id}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleChange("lcd")}
                            label="LCD"
                            fullWidth
                            sx={{ mb: 2 }}
                            placeholder={placeholders.lcd}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleChange("rpc")}
                            placeholder={placeholders.rpc}
                            label="RPC"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleChange("coinDenom")}
                            placeholder={placeholders.coinDenom}
                            label="Coin Denom"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleChange("coinMinimalDenom")}
                            label="Coin Minimal Denom"
                            fullWidth
                            placeholder={placeholders.coinMinimalDenom}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleChange("prefix")}
                            label="Prefix"
                            fullWidth
                            placeholder={placeholders.prefix}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleChange("decimals")}
                            placeholder={placeholders.decimals.toString()}
                            label="Decimals"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleNewChain();
                            }}
                        >
                            Add Chain
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default NewChainModal;
