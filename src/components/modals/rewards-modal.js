import { Alert, TableContainer, TableHead, TableRow, TableCell, Paper, Table, TableBody, Typography, Box, Modal, Button } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../context/store";
import { withdrawReward, getAllRewards, withdrawAllRewards } from "../../utils/cosmos";
import chains from "../../data/chains.json";
import axios from "axios";

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
    const [state] = useContext(GlobalContext);
    const [rewards, setRewards] = useState([]);
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
                            entry.reward.map(re => sum+=re.amount)
                            const newEntry = {
                                name: (validators.find(el => el.operator_address === entry.validatorAddress)).description.moniker,
                                address: entry.validatorAddress,
                                amount: (sum / 1000000000000000000 / 1000000).toFixed(6) + " " + chain.coinDenom
                            }
                            return arr.push(newEntry);
                        })
                        setRewards(arr);
                    })
            })
        }
    }, [open]);

    const handleWithdraw = (validator) => {
        withdrawReward(state.chain, state.signingClient, state.address, validator).then((res) => console.log(res)).catch((e) => console.log(e))
    }

    const handleWithdrawAllRewards = () => {
        const validators = [];
        rewards.map(el => validators.push(el.address));
        withdrawAllRewards(state.chain, state.signingClient, state.address, validators).then((res) => console.log(res)).catch((e) => console.log(e))
    }

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
                    Withdraw Rewards
                    <Box display="flex" justifyContent="flex-end">
                        {state.address &&
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
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
                    : <Alert severity="error">Please connect your wallet!</Alert>

                }
            </Box>
        </Modal>
    );
};

export default RewardsModal;
