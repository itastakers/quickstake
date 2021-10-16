import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Typography, TextField, Grid } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import chains from "../data/chains.json";

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

    const [placeholders, setPlaceholders] = useState(chains[0]);
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    const handleNewChain = () => {
        const localChains = localStorage.getItem('localChains') ? JSON.parse(localStorage.getItem('localChains')) : []
        localChains.push(values)
        localStorage.setItem('localChains', JSON.stringify(localChains))

        // Success
        handleClose()
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
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
                            placeholder={placeholders.decimals}
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
