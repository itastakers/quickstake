
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/store";
import axios from "axios";
import {
  Typography,
  Stack,
  Chip,
  Grid,
  Alert,
  Paper,
  Pagination,
  Button,
  Dialog,
  DialogContent,
  Box,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { ExpandMore, ThumbUp, ThumbDown, ThumbsUpDown, ThumbDownOutlined } from "@mui/icons-material";
import Chart from "./chart";
import { vote } from "../../utils/cosmos";
import Loading from "../loading/loading"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Gov = () => {
  const [state, dispatch] = useContext(GlobalContext);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [voteStatus, setVoteStatus] = useState(2);
  const [selectVote, setSelectVote] = useState(null)
  const [ongoingVoteStatus, setOngoingVoteStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectVote(null)
  }
  const [totalProposal, setTotalProposal] = useState([]);
  const [totalProposalPagination, setTotalProposalPagination] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false)
  const formatDate = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString("en-US");
  }
  const formatStatus = (status) => {
    switch (status) {
      case 1:
        return ['Deposit Period', 'warning']
      case 2:
        return ['Voting Period', 'warning']
      case 3:
        return ['Passed', "success"]
      case 4:
        return ['Rejected', 'error']
      case 5:
        return ['Failed', 'error']
      default:
        return ['Unspecified', 'error']
    }
  }
  const voteFormatStatus = (status) => {
    switch (status) {
      case "VOTE_OPTION_YES":
        return ['YES', "success", 1]
      case "VOTE_OPTION_ABSTAIN":
        return ['ABSTAIN', 'warning', 2]
      case "VOTE_OPTION_NO":
        return ['NO', 'error', 3]
      case "VOTE_OPTION_NO_WITH_VETO":
        return ['NO WITH VETO', 'error', 4]
      default:
        return ['UNDEFINED', 'error']
    }
  }
  const paginateObjects = (objects, page) => {
    return objects.slice((page - 1) * 10, page * 10);
  }
  const handleTotalProposalPagination = (event, value) => {
    setTotalProposalPagination(value)
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
    if (selectVote) {
      setConfirmLoading(true)
      vote(state.chain, state.signingClient, state.address, proposalId, Number(option))
        .then(res => {
          if (res) {
            setSelectVote(null)
            setConfirmLoading(false)
            setOpen(false);
            toast.success('The transaction was succeeded', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            getProposalVoteStatus(state.address, proposalId)
          }
        })
        .catch(e => {
          setConfirmLoading(false)
          toast.error('The vote was failed', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // setOpen(false);
          dispatch({
            type: "SET_MESSAGE",
            payload: {
              message: `${e}`,
              severity: "error",
            },
          });
        })
    } else {
      toast.error('Please select the vote.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  const getProposalVoteStatus = (address, proposalId) => {
    axios
      .get(`${state.chain.lcd}/cosmos/gov/v1beta1/proposals/${proposalId}/votes/${address}`)
      .then((res) => {
        if (res.data) {
          let voteStatus = null;
          if (res.data.vote.option) {
            voteStatus = res.data.vote.option;
            setOngoingVoteStatus(voteStatus)
            setSelectVote(voteFormatStatus(voteStatus)[2])
          }
        }
      })
      .catch(e => console.log)
  }
  useEffect(() => {
    if (state.chain.rpc) {
      setLoadingStatus(true)
      axios
        .get(state.chain.lcd + "/gov/proposals?limit=1000")
        .then((res) => {
          setLoadingStatus(false)
          if (res.data.result) {
            setTotalProposal(res.data.result.reverse());
          }
        })
        .catch(e => console.log)
    }
  }, [state.chain]);
  const openDetail = (data) => (event, isExpanded) => {
    setExpanded(isExpanded ? data.id : false);
    setOngoingVoteStatus(null)
    if (isExpanded) {
      if (data.status === 2) {
        getProposalVoteStatus(state.address, data.id)
      }
      setVoteStatus(data.status)
      setCurrentProposal(data)
    }
  }
  const openModalAction = (data) => {
    setOpen(true)
    setCurrentProposal(data)
  }
  const handleRadioChange = (event) => {
    setSelectVote(event.target.value);
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* {state.message && (
        <Alert sx={{ mb: 3 }} severity={state.message.severity}>
          {state.message.text}
        </Alert>
      )} */}
      <Paper sx={{ mt: 3 }} elevation={0} variant="outlined">
        <Typography sx={{ pl: 3, py: 2, borderBottom: 'solid rgba(0,0,0,.2) 1px' }} variant="h5">
          Total Proposals
        </Typography>
        {loadingStatus ? (
          <Loading width={200} height={200} />
        ) : (
          <React.Fragment>
            {totalProposal.length > 0 ?
              <>
                {paginateObjects(totalProposal, totalProposalPagination).map((proposal, index) => (
                  <React.Fragment key={index}>
                    <Accordion key={proposal.id} elevation={0} expanded={expanded === proposal.id} disableGutters square onChange={openDetail(proposal)}>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ borderBottom: '1px solid rgba(0,0,0,.2)' }}
                      >
                        <Stack direction="row">
                          <Chip size="small" label={formatDate(proposal.submit_time)} color="error" />
                          <Chip size="small" sx={{ ml: 1 }} label={formatStatus(proposal.status)[0]} color={formatStatus(proposal.status)[1]} />
                        </Stack>
                        <Typography sx={{ ml: 2 }}>{proposal?.content?.value?.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ border: 0 }}>
                        <Grid container>
                          <Grid item md={8} xs={12} paddingTop={3}>
                            <Typography variant="body2" sx={{ display: 'inline-block', color: 'text.secondary' }}>
                              <strong>Deposited amount:</strong> {currentProposal?.total_deposit.length > 0 ? currentProposal?.total_deposit[0].amount / 1000000 : 0}
                              <br /><br /><br />
                              <NewLineToBr>{currentProposal?.content?.value?.description}</NewLineToBr>
                            </Typography>
                          </Grid>
                          <Grid item md={1} xs={12} />
                          {voteStatus === 2 ? (
                            <Grid item md={3} xs={12} paddingTop={3}>
                              {state.address && (
                                <>
                                  <Typography paddingBottom={1}>
                                    <strong>Your Vote: </strong>
                                  </Typography>
                                  <div paddingBottom={2}>
                                    {ongoingVoteStatus&&(
                                      <Chip sx={{ ml: 1 }} label={voteFormatStatus(ongoingVoteStatus)[0]} color={voteFormatStatus(ongoingVoteStatus)[1]} />
                                    )}
                                  </div>
                                </>
                              )}
                              <Typography paddingBottom={2} paddingTop={1}>
                                <strong>Vote: </strong>
                              </Typography>
                              {state.address ?
                                <Button
                                  variant="contained"
                                  color="success"
                                  disableElevation
                                  //  startIcon={<ThumbUp />}
                                  onClick={() => openModalAction(proposal)}
                                >
                                  Vote
                                </Button>
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
                      </AccordionDetails>
                    </Accordion>
                  </React.Fragment>
                ))}
                <Grid container justifyContent="flex-end">
                  <Pagination sx={{ py: 1 }} onChange={handleTotalProposalPagination} count={Math.ceil(totalProposal.length / 10)} shape="rounded" />
                </Grid>
              </>
              : <Alert severity="info">There are no proposals!</Alert>}
          </React.Fragment>
        )}
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography variant="h6" component="div" pr={4}>
              Choose your vote
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              mx={3}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid item md={12} xs={12} paddingTop={3}>
            <Box py={2}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                value={selectVote}
                onChange={handleRadioChange}

              >
                <FormControlLabel value={1} control={<Radio />} label="Yes" />
                <FormControlLabel value={2} control={<Radio />} label="Abstain" />
                <FormControlLabel value={3} control={<Radio />} label="No" />
                <FormControlLabel value={4} control={<Radio />} label="No with veto" />
              </RadioGroup>
            </Box>
            <Box py={2}>
              <Button
                variant={"outlined"}
                disableElevation
                sx={{ width: '100%' }}
                onClick={() => handleVote(selectVote, currentProposal.id)}
              >
                {confirmLoading ? <CircularProgress size={30} /> : "Confirm"}
              </Button>
            </Box>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Gov;
