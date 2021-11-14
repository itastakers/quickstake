import { Alert, LinearProgress, TableContainer, TableHead, TableRow, TableCell, Paper, Table, TableBody, Typography, Box, Modal, Button } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../context/store";
import { withdrawReward, getAllRewards, withdrawAllRewards } from "../../utils/cosmos";
import chains from "../../data/chains.json";
import axios from "axios";
import { Decimal } from "@cosmjs/math";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};



const RewardsModal = ({ open, handleClose }) => {
    const [state, dispatch] = useContext(GlobalContext);
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(false);

    const chain = chains.find(
        (chain) => chain.chain_id === state.selectedNetwork
    );

    useEffect(() => {
        if (state.address) {
            getAllRewards(state.address, chain.rpc).then(result => {
                axios
                    .get(chain.lcd + "/staking/validators")
                    .then((res) => {
                        const validators = res.data.result
                        const arr = [];
                        result.rewards.map((entry) => {
                            let sum = 0;
                            entry.reward.map(re => sum += re.amount)
                            const newEntry = {
                                name: (validators.find(el => el.operator_address === entry.validatorAddress)).description.moniker,
                                address: entry.validatorAddress,
                                amount: Decimal.fromAtomics(sum, 24).toFloatApproximation().toFixed(6) + " " + chain.coinDenom
                            }
                            return arr.push(newEntry);
                        })
                        setRewards(arr);
                    })
            })
        }
    }, [open]);

    const handleWithdraw = async (validator) => {
        setLoading(true);
        try {
            const res = await withdrawReward(state.chain, state.signingClient, state.address, validator);
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
        }
        setLoading(false);
        handleClose();
    }

    const handleWithdrawAllRewards = async () => {
        setLoading(true);
        const validators = [];
        rewards.map(el => validators.push(el.address));

        try {
            const res = await withdrawAllRewards(state.chain, state.signingClient, state.address, validators);
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
        }
        setLoading(false);
        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {loading &&
                    <LinearProgress />
                }

                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ mb: 2 }}
                >
                    Withdraw Rewards
                    <Box display="flex" justifyContent="flex-end">
                        {state.address &&
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                disabled={loading}
                                style={{ marginLeft: 16 }}
                                onClick={() => handleWithdrawAllRewards()}
                            >
                                Withdraw all
                            </Button>
                        }
                    </Box>
                </Typography>
                {rewards.length > 0 ?
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rewards.map((reward) => (
                                    <TableRow
                                        key={reward.adress}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {reward.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {reward.address}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {reward.amount}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                disabled={loading}
                                                style={{ marginLeft: 16 }}
                                                onClick={() => handleWithdraw(reward.address)}
                                            >
                                                Withdraw
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : <Alert severity="error">No rewards found!</Alert>

                }
            </Box>
        </Modal>
    );
};

export default RewardsModal;
