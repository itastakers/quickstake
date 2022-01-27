import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/store";
import axios from "axios";
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Chip,
  Grid,
  Alert,
  Paper,
  Pagination,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Slide,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { ExpandMore, ThumbUp, ThumbDown, ThumbsUpDown, ThumbDownOutlined } from "@mui/icons-material";
import Chart from "./chart";
import { vote } from "../../utils/cosmos";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Gov = () => {
  const [state, dispatch] = useContext(GlobalContext);
  const [proposalsOngoing, setProposalsOngoing] = useState([]);
  const [proposalsPassed, setProposalsPassed] = useState([]);
  const [proposalsFailed, setProposalsFailed] = useState([]);
  const [proposalsOngoingPagination, setProposalsOngoingPagination] = useState(1);
  const [proposalsPassedPagination, setProposalsPassedPagination] = useState(1);
  const [proposalsFailedPagination, setProposalsFailedPagination] = useState(1);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [voteStatus, setVoteStatus] = useState("ongoing");
  const [ongoingVoteStatus, setOngoingVoteStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
  const voteFormatStatus = (status) => {
    switch (status) {
      case "VOTE_OPTION_YES":
        return ['YES',"success"]
      case "VOTE_OPTION_ABSTAIN":
        return ['ABSTAIN','warning']
      case "VOTE_OPTION_NO":
        return ['NO','error']
      case "VOTE_OPTION_NO_WITH_VETO":
        return ['NO WITH VETO','error']
      default:
        return ['UNDEFINED','error']
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

  const handleVote = (option, proposalId) => {
    vote(state.chain, state.signingClient, state.address, proposalId, option)
      .then(res => {
        if (res) {
          getProposalVoteStatus(state.address)
        }
      })
      .catch(e => {
        dispatch({
          type: "SET_MESSAGE",
          payload: {
            message: `${e}`,
            severity: "error",
          },
        });
      })
  }
  const getProposalVoteStatus = (address) => {
    axios
      .get(state.chain.lcd + "/cosmos/gov/v1beta1/proposals/131/votes/" + address)
      .then((res) => {
        if (res.data) {
          let voteStatus = null;
          if (res.data.vote.option) {
            voteStatus = res.data.vote.option;
            setOngoingVoteStatus(voteStatus)
          }
        }
      })
      .catch(e => console.log)
  }

  useEffect(() => {
    if (state.chain.rpc) {
      axios
        .get(state.chain.lcd + "/gov/proposals?limit=1000")
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
            return true;
          })
          setProposalsFailed(failedProposals);
          setProposalsOngoing(ongoingProposals);
          setProposalsPassed(passedProposals);
        })
        .catch(e => console.log)
    }
  }, [state.chain]);
  const openDetail = (data, status) => () => {
    if (status === "ongoing") {
      getProposalVoteStatus(state.address)
    }
    setOpen(true)
    setCurrentProposal(data)
    setVoteStatus(status)
  }
  return (
    <>
      {state.message && (
        <Alert sx={{ mb: 3 }} severity={state.message.severity}>
          {state.message.text}
        </Alert>
      )}
      <Paper sx={{ mt: 3 }} elevation={0} variant="outlined">
        <Typography sx={{ pl: 3, py: 2, borderBottom: 'solid rgba(0,0,0,.2) 1px' }} variant="h5">
          Ongoing Proposals
        </Typography>

        {proposalsOngoing.length > 0 ?
          <>
            <React.Fragment>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    {paginateObjects(proposalsOngoing, proposalsOngoingPagination).map((proposal, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">
                          <Stack direction="row">
                            <Chip size="small" label={formatDate(proposal.submit_time)} color="success" />
                            <Chip size="small" sx={{ ml: 1 }} label={formatStatus(proposal.status)} color="warning" />
                          </Stack>
                        </TableCell>
                        <TableCell align="justify"><Typography sx={{ ml: 2 }}>{proposal?.content?.value?.title}</Typography></TableCell>
                        <TableCell align="left">
                          <Button variant="outlined" onClick={openDetail(proposal, "ongoing")}>Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </React.Fragment>
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
            <React.Fragment>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    {paginateObjects(proposalsPassed, proposalsPassedPagination).map((proposal, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">
                          <Stack direction="row">
                            <Chip size="small" label={formatDate(proposal.submit_time)} color="error" />
                            <Chip size="small" sx={{ ml: 1 }} label={formatStatus(proposal.status)} color="success" />
                          </Stack>
                        </TableCell>
                        <TableCell align="justify"><Typography sx={{ ml: 2 }}>{proposal?.content?.value?.title}</Typography></TableCell>
                        <TableCell align="left">
                          <Button variant="outlined" onClick={openDetail(proposal, "passed")}>Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </React.Fragment>
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
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  {paginateObjects(proposalsFailed, proposalsFailedPagination).map((proposal, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left">
                        <Stack direction="row">
                          <Chip size="small" label={formatDate(proposal.submit_time)} color="error" />
                          <Chip size="small" sx={{ ml: 1 }} label={formatStatus(proposal.status)} color="error" />
                        </Stack>
                      </TableCell>
                      <TableCell align="justify"><Typography sx={{ ml: 2 }}>{proposal?.content?.value?.title}</Typography></TableCell>
                      <TableCell align="left">
                        <Button variant="outlined" onClick={openDetail(proposal, "failed")}>Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container justifyContent="flex-end">
              <Pagination sx={{ py: 1 }} onChange={handleFailedPagination} count={Math.ceil(proposalsFailed.length / 3)} shape="rounded" />
            </Grid>
          </>
          : <Alert severity="info">There are no failed proposals!</Alert>}
      </Paper>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {currentProposal?.content?.value?.title}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {currentProposal && (
            <Box>
              <Grid container>
                <Grid item md={8} xs={12} paddingTop={3}>
                  <Typography variant="body2" sx={{ display: 'inline-block', color: 'text.secondary' }}>
                    <strong>Deposited amount:</strong> {currentProposal?.total_deposit.length > 0 ? currentProposal?.total_deposit[0].amount / 1000000 : 0}
                    <br /><br /><br />
                    <NewLineToBr>{currentProposal?.content?.value?.description}</NewLineToBr>
                  </Typography>
                </Grid>
                <Grid item md={1} xs={12} />
                {voteStatus === "ongoing" ? (
                  <Grid item md={3} xs={12} paddingTop={3}>
                    {state.address && (
                      <>
                        <Typography paddingBottom={1}>
                          <strong>Current Vote Status: </strong>
                        </Typography>
                        <div paddingBottom={2}>
                          <Chip sx={{ ml: 1 }} label={voteFormatStatus(ongoingVoteStatus)[0]} color={voteFormatStatus(ongoingVoteStatus)[1]} />
                        </div>
                      </>
                    )}
                    <Typography paddingBottom={3} paddingTop={1}>
                      <strong>Vote: </strong>
                    </Typography>
                    {state.address ?
                      <ButtonGroup
                        orientation="vertical"
                        aria-label="vertical contained button group"
                        variant="contained"
                      >
                        <Button
                          variant="contained"
                          color="success"
                          disableElevation
                          startIcon={<ThumbUp />}
                          onClick={() => handleVote(1, currentProposal.id)}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          disableElevation
                          startIcon={<ThumbsUpDown />}
                          onClick={() => handleVote(2, currentProposal.id)}
                        >
                          Abstain
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          disableElevation
                          startIcon={<ThumbDownOutlined />}
                          onClick={() => handleVote(3, currentProposal.id)}
                        >
                          No
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          disableElevation
                          startIcon={<ThumbDown />}
                          onClick={() => handleVote(4, currentProposal.id)}
                        >
                          No with veto
                        </Button>
                      </ButtonGroup>
                      : <Alert severity="warning">Please connect your wallet to vote!</Alert>
                    }
                  </Grid>
                ) : (
                  <Grid item md={3} xs={12} paddingTop={3}>
                    <Typography>
                      <strong>Votes: </strong>
                    </Typography>
                    <Chart
                      style={{ height: '200px' }}
                      data={[
                        { title: 'Yes', value: parseInt(currentProposal?.final_tally_result?.yes), color: 'green' },
                        { title: 'No', value: parseInt(currentProposal?.final_tally_result?.no), color: 'red' },
                        { title: 'Abstain', value: parseInt(currentProposal?.final_tally_result?.abstain), color: 'purple' },
                        { title: 'No with Veto', value: parseInt(currentProposal?.final_tally_result?.no_with_veto), color: 'darkred' },
                      ]}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gov;
