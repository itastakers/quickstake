import { Modal, LinearProgress, Alert, Typography, Box, FormControl, InputLabel, NativeSelect, Grid, Button, Input } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/store";
import chains from "../data/chains.json";
import axios from "axios";
import { getAllDelegations, redelegate } from "../utils/cosmos";

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

const RedelegateModal = ({ open, handleClose }) => {

    const [state, dispatch] = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [currentDelegations, setCurrentDelegations] = useState([]);
    const [validators, setValidators] = useState([]);
    const [chosenValidator, setChosenValidator] = useState(null)
    const [chosenValidatorTo, setChosenValidatorTo] = useState(null)
    const [value, setValue] = useState(0);
    const chain = chains.find(
        (chain) => chain.chain_id === state.selectedNetwork
    );

    const handleChange = (event) => {
        if (event.target.value && event.target.value !== "") {
            const validator = currentDelegations.find(el => el.address === event.target.value)
            setChosenValidator(validator)
        } else {
            setChosenValidator(null)
        }
    };

    const handleChangeTo = (event) => {
        if (event.target.value && event.target.value !== "") {
            const validator = validators.find(el => el.operator_address === event.target.value)
            setChosenValidatorTo(validator)
        } else {
            setChosenValidatorTo(null)
        }
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleRedelegate = async () => {
        let redelegationAmount = parseFloat(value) * 1000000;
    
        setLoading(true);
    
        try {
          const res = await redelegate(
            state.chain,
            state.signingClient,
            state.address,
            chosenValidator.address,
            chosenValidatorTo.operator_address,
            redelegationAmount
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

    useEffect(() => {
        setChosenValidator(null)
        setChosenValidatorTo(null)
        if (state.address) {
            getAllDelegations(state.address, chain.rpc).then((result => {
                axios
                    .get(chain.lcd + "/staking/validators")
                    .then((res) => {
                        const validators = res.data.result
                        setValidators(validators)
                        const arr = [];
                        result.delegationResponses.map((entry) => {
                            const name = (validators.find(el => el.operator_address === entry.delegation.validatorAddress)).description.moniker
                            const newEntry = {
                                name,
                                amount: entry.balance.amount,
                                address: entry.delegation.validatorAddress
                            }
                            return arr.push(newEntry)
                        })
                        setCurrentDelegations(arr);
                    })
            })).catch((e) => console.log(e))
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
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ mb: 2 }}
                >
                    Redelegate Assets
                </Typography>
                {state.address ?
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    From
                                </InputLabel>
                                <NativeSelect
                                    defaultValue={"30"}
                                    inputProps={{
                                        name: 'from',
                                        id: 'uncontrolled-native-o',
                                    }}
                                    onChange={handleChange}
                                >
                                    <option value=""></option>
                                    {currentDelegations.map((delegation) => (
                                        <option key={delegation.address} value={delegation.address}>{delegation.name}</option>
                                    ))}
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    To
                                </InputLabel>
                                <NativeSelect
                                    defaultValue={"30"}
                                    inputProps={{
                                        name: 'to',
                                        id: 'uncontrolled-native-s',
                                    }}
                                    onChange={handleChangeTo}
                                >
                                    <option value=""></option>
                                    {validators.map((validator) => (
                                        <option key={validator.operator_address} value={validator.operator_address}>{validator.description.moniker}</option>
                                    ))}
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        {(chosenValidator && chosenValidatorTo) ?
                            <>
                                <Grid item xs={12}>
                                    <Typography>
                                        <strong>Available Balance:</strong> {chosenValidator.amount / 1000000} {chain.coinDenom}
                                    </Typography>
                                    <Grid container>
                                        <Grid item xs={3}>
                                            <Typography>
                                                <strong>Redelegate Balance:</strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Input
                                                fullWidth
                                                value={value}
                                                size="small"
                                                onChange={handleInputChange}
                                                inputProps={{
                                                    step: 0.1,
                                                    min: 0,
                                                    max: chosenValidator.amount / 1000000,
                                                    type: 'number',
                                                    'aria-labelledby': 'input-slider',
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button
                                        variant="contained"
                                        onClick={handleRedelegate}
                                        disabled={value === 0 || loading}
                                    >
                                        Redelegate
                                    </Button>
                                    {loading && <LinearProgress sx={{ mt: 2 }} />}
                                </Grid>
                            </>
                            : <></>
                        }
                    </Grid>
                    :
                    <Alert severity="error">Please connect your wallet!</Alert>
                }
            </Box>
        </Modal>

    );
};

export default RedelegateModal;
