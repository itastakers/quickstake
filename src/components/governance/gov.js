import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/store";
import axios from "axios";
import { Typography, Accordion, AccordionDetails, AccordionSummary, Stack, Chip, Grid, Alert, Paper, Pagination } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Chart from "./chart";

const Gov = () => {
    const [state] = useContext(GlobalContext);
    const [proposalsOngoing, setProposalsOngoing] = useState([]);
    const [proposalsPassed, setProposalsPassed] = useState([]);
    const [proposalsFailed, setProposalsFailed] = useState([]);

    const [proposalsOngoingPagination, setProposalsOngoingPagination] = useState(1);
    const [proposalsPassedPagination, setProposalsPassedPagination] = useState(1);
    const [proposalsFailedPagination, setProposalsFailedPagination] = useState(1);



    const formatDate = (data) => {
        const date = new Date(data);
        return date.toLocaleDateString("en-US");
    }

    const formatStatus = (status) => {
        switch (status) {
            case 1:
                return 'Deposit Period'
            case 2:
                return 'Voting Period'
            case 3:
                return 'Passed'
            case 4:
                return 'Rejected'
            case 5:
                return 'Failed'
            default:
                return 'Unspecified'
        }
    }

    const paginateObjects = (objects, page) => {
        return objects.slice((page - 1) * 3, page * 3);
    }

    const handleOngoingPagination = (event, value) => {
        setProposalsOngoingPagination(value);
    };

    const handlePassedPagination = (event, value) => {
        setProposalsPassedPagination(value);
    };

    const handleFailedPagination = (event, value) => {
        setProposalsFailedPagination(value);
    };

    const NewLineToBr = ({ children = "" }) => {
        return children.replace(/\\n/g, '\n').split('\n').reduce(function (arr, line) {
            return arr.concat(
                line,
                <br />
            );
        }, []);
    }



    useEffect(() => {
        if (state.chain.rpc) {
            axios
                .get(state.chain.lcd + "/gov/proposals")
                .then((res) => {
                    const ongoingProposals = [];
                    const passedProposals = [];
                    const failedProposals = [];

                    res.data.result.reverse().map(entry => {
                        switch (entry.status) {
                            case 1:
                            case 2:
                                ongoingProposals.push(entry);
                                break;
                            case 3:
                                passedProposals.push(entry);
                                break;
                            default:
                                failedProposals.push(entry);
                        }

                    })
                    setProposalsFailed(failedProposals);
                    setProposalsOngoing(ongoingProposals);
                    setProposalsPassed(passedProposals);
                })
                .catch(e => console.log)
        }
    }, [state.chain]);

    return (
        <>
            <Paper sx={{ mt: 3 }} elevation={0} variant="outlined">
                <Typography sx={{ pl: 3, py: 2, borderBottom: 'solid rgba(0,0,0,.2) 1px' }} variant="h5">
                    Ongoing Proposals
                </Typography>

                {proposalsOngoing.length > 0 ?
                    <>
                        {paginateObjects(proposalsOngoing, proposalsOngoingPagination).map(proposal => (
                            <>
                                <Accordion elevation={0} disableGutters square>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        sx={{ borderBottom: '1px solid rgba(0,0,0,.2)' }}
                                    >
                                        <Stack direction="row">
                                            <Chip size="small" label={formatDate(proposal.deposit_end_time)} color="success" />
                                            <Chip size="small" sx={{ ml: 1 }} label={formatStatus(proposal.status)} color="warning" />
                                        </Stack>
                                        <Typography sx={{ ml: 2 }}>{proposal.content.value.title}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container>
                                            <Grid item xs={8}>
                                                <Typography variant="body2" sx={{ display: 'inline-block', color: 'text.secondary' }}>
                                                    <NewLineToBr>{proposal.content.value.description}</NewLineToBr>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1} />
                                            <Grid item xs={3}>
                                                <Typography>
                                                    <strong>Vote: </strong>
                                                </Typography>

                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        ))}
                        <Grid container justifyContent="flex-end">
                            <Pagination sx={{ py: 1 }} onChange={handleOngoingPagination} count={Math.ceil(proposalsOngoing.length / 3)} shape="rounded" />
                        </Grid>
                    </>
                    : <Alert severity="info">There are no ongoing proposals!</Alert>}
            </Paper>
            <Paper sx={{ mt: 3 }} elevation={0} variant="outlined">
                <Typography sx={{ pl: 3, py: 2, borderBottom: 'solid rgba(0,0,0,.2) 1px' }} variant="h5">
                    Passed Proposals
                </Typography>
                {proposalsPassed.length > 0 ?
                    <>
                        {paginateObjects(proposalsPassed, proposalsPassedPagination).map(proposal => (
                            <>
                                <Accordion elevation={0} disableGutters square>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        sx={{ borderBottom: '1px solid rgba(0,0,0,.2)' }}
                                    >
                                        <Stack direction="row">
                                            <Chip size="small" label={formatDate(proposal.deposit_end_time)} color="error" />
                                            <Chip size="small" sx={{ ml: 1 }} label={formatStatus(proposal.status)} color="success" />
                                        </Stack>
                                        <Typography sx={{ ml: 2 }}>{proposal.content.value.title}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ border: 0 }}>
                                        <Grid container>
                                            <Grid item xs={8}>
                                                <Typography variant="body2" sx={{ display: 'inline-block', color: 'text.secondary' }}>
                                                    <NewLineToBr>{proposal.content.value.description}</NewLineToBr>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1} />
                                            <Grid item xs={3}>
                                                <Typography>
                                                    <strong>Votes: </strong>
                                                </Typography>
                                                <Chart
                                                    style={{ height: '200px' }}
                                                    data={[
                                                        { title: 'Yes', value: parseInt(proposal.final_tally_result.yes), color: 'green' },
                                                        { title: 'No', value: parseInt(proposal.final_tally_result.no), color: 'red' },
                                                        { title: 'Abstain', value: parseInt(proposal.final_tally_result.abstain), color: 'purple' },
                                                        { title: 'No with Veto', value: parseInt(proposal.final_tally_result.no_with_veto), color: 'darkred' },
                                                    ]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        ))}
                        <Grid container justifyContent="flex-end">
                            <Pagination sx={{ py: 1 }} onChange={handlePassedPagination} count={Math.ceil(proposalsPassed.length / 3)} shape="rounded" />
                        </Grid>
                    </>
                    : <Alert severity="info">There are no passed proposals!</Alert>}
            </Paper>

            <Paper sx={{ mt: 3 }} elevation={0} variant="outlined">
                <Typography sx={{ pl: 3, py: 2, borderBottom: 'solid rgba(0,0,0,.2) 1px' }} variant="h5">
                    Failed Proposals
                </Typography>

                {proposalsFailed.length > 0 ?
                    <>
                        {paginateObjects(proposalsFailed, proposalsFailedPagination).map(proposal => (
                            <>
                                <Accordion elevation={0} disableGutters square>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        sx={{ borderBottom: '1px solid rgba(0,0,0,.2)' }}
                                    >
                                        <Stack direction="row">
                                            <Chip size="small" label={formatDate(proposal.deposit_end_time)} color="error" />
                                            <Chip size="small" sx={{ ml: 1 }} label={formatStatus(proposal.status)} color="error" />
                                        </Stack>
                                        <Typography sx={{ ml: 2 }}>{proposal.content.value.title}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ border: 0 }}>
                                        <Grid container>
                                            <Grid item xs={8}>
                                                <Typography variant="body2" sx={{ display: 'inline-block', color: 'text.secondary' }}>
                                                    <NewLineToBr>{proposal.content.value.description}</NewLineToBr>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1} />
                                            <Grid item xs={3}>
                                                <Typography>
                                                    <strong>Votes: </strong>
                                                </Typography>
                                                <Chart
                                                    style={{ height: '200px' }}
                                                    data={[
                                                        { title: 'Yes', value: parseInt(proposal.final_tally_result.yes), color: 'green' },
                                                        { title: 'No', value: parseInt(proposal.final_tally_result.no), color: 'red' },
                                                        { title: 'Abstain', value: parseInt(proposal.final_tally_result.abstain), color: 'purple' },
                                                        { title: 'No with Veto', value: parseInt(proposal.final_tally_result.no_with_veto), color: 'darkred' },
                                                    ]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </>
                        ))}
                        <Grid container justifyContent="flex-end">
                            <Pagination sx={{ py: 1 }} onChange={handleFailedPagination} count={Math.ceil(proposalsFailed.length / 3)} shape="rounded" />
                        </Grid>
                    </>
                    : <Alert severity="info">There are no passed proposals!</Alert>}
            </Paper>
        </>
    );
};

export default Gov;
