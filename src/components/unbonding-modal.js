import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/store";
import axios from "axios";
import chains from "../data/chains.json";
import { getAllUnbondingDelegations } from "../utils/cosmos";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


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

const UnbondingModal = ({ open, handleClose }) => {

    const [state] = useContext(GlobalContext);
    const [totalUnbonding, setTotalUnbonding] = useState([]);
    const chain = chains.find(
        (chain) => chain.chain_id === state.selectedNetwork
    );

    useEffect(() => {
        if (state.address) {
            getAllUnbondingDelegations(state.address, state.chain.rpc)
                .then(result => {
                    axios
                        .get(chain.lcd + "/staking/validators")
                        .then((res) => {
                            const validators = res.data.result
                            const arr = [];
                            result.unbondingResponses.map((entry) => {
                                const name = (validators.find(el => el.operator_address === entry.validatorAddress)).description.moniker
                                const rowEntry = createData(entry, name)
                                return arr.push(rowEntry);
                            })
                            setTotalUnbonding(arr);
                        })
                })
                .catch(() => {
                    setTotalUnbonding([])
                })
        }
    }, [open])

    function createData(entry, name) {
        console.log(entry.entries)
        return {
            address: entry.delegatorAddress,
            name: name,
            history: entry.entries
        };
    }

    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.address}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Entries
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Completion Time</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {row.history &&
                                        <TableBody>
                                            {row.history.map((historyRow) => (
                                                <TableRow key={historyRow.date}>
                                                    <TableCell component="th" scope="row">
                                                        {historyRow.completionTime.toLocaleString("en-US")}
                                                    </TableCell>
                                                    <TableCell align="right">{historyRow.balance / 1000000} {chain.coinDenom} </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    }
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    Row.propTypes = {
        row: PropTypes.shape({
            history: PropTypes.arrayOf(
                PropTypes.shape({
                    amount: PropTypes.number.isRequired,
                    date: PropTypes.string.isRequired,
                }),
            ).isRequired,
        }).isRequired,
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
                    All unbonding assets
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Validator</TableCell>
                                <TableCell>Adress</TableCell>
                            </TableRow>
                        </TableHead>
                        {totalUnbonding.length > 0 &&
                            <TableBody>
                                {totalUnbonding.map((row) => (
                                    <Row key={row.name} row={row} />
                                ))}
                            </TableBody>
                        }
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    );
};

export default UnbondingModal;
