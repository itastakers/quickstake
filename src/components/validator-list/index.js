import React, { useEffect, useContext, useState } from "react";
import { GlobalContext } from "../../context/store";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import chains from "../../data/chains.json";
import { Button, Typography, Box, IconButton, Alert } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import DelegateModal from "./delegate-modal";
import UndelegateModal from "./undelegate-modal";
import { getAllDelegations } from "../../utils/cosmos";

const ValidatorList = () => {
  const [state] = useContext(GlobalContext);
  const [rows, setRows] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalUndelegateOpen, setModalUndelegateOpen] = useState(false);
  const [validator, setValidator] = useState({});
  const [allDelegations, setAllDelegations] = useState([]);

  const openModal = (validator) => {
    setValidator(validator);
    setModalOpen(true);
  };

  const openUndelgateModal = (validator) => {
    setValidator(validator);
    setModalUndelegateOpen(true);
  };

  const getDelegations = async () => {

  }

  useEffect(() => {
    const chain = chains.find(
      (chain) => chain.chain_id === state.selectedNetwork
    );

    setRows([]);
    axios
      .get(chain.lcd + "/staking/validators")
      .then((res) => {
        const validators = res.data.result;
        const createNewRows = (delegationResponses) => {
          const newRows = validators.map((validator) => {
            return {
              id: validator.operator_address,
              name: {
                moniker: validator.description.moniker,
                address: validator.operator_address,
              },
              link: validator.description.website,
              address: validator.operator_address,
              commission: validator.commission.commission_rates.rate,
              status: validator.status,
              tokens: parseFloat(validator.delegator_shares),
              action: {
                address: validator.operator_address,
                name: validator.description.moniker,
                delegated: delegationResponses.length > 0 ? !!delegationResponses.find((el) => el.delegation.validatorAddress == validator.operator_address) : false,
              },
            };
          });
          setRows(newRows);
        }
        if (state.address) {
          getAllDelegations(state.address, chain.rpc).then((result => {
            setAllDelegations(result.delegationResponses);
            createNewRows(result.delegationResponses);
          })).catch((() => {
            createNewRows([]);
          }
          ))
        } else {
          createNewRows([]);
        }
      })
      .catch((err) => console.log(err));
  }, [state.selectedNetwork, state.address]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 500,
      renderCell: (params) => (
        <Box>
          <Typography variant="h6">{params.value.moniker}</Typography>
          <Typography sx={{ fontFamily: "monospace" }} variant="subtitle2">
            {params.value.address}
          </Typography>
        </Box>
      ),
    },
    {
      field: "tokens",
      headerName: "Voting Power",
      width: 150,
      renderCell: (params) => <>{(params.value / 1000000).toFixed(0)}</>,
    },
    {
      field: "commission",
      headerName: "Commission",
      width: 120,
      renderCell: (params) => (
        <>{(parseFloat(params.value) * 100).toFixed(2)} % </>
      ),
    },
    {
      field: "link",
      headerName: "Links",
      width: 90,
      renderCell: (params) => {
        if (params.value === undefined || params.value === "") {
          return <></>;
        }

        return (
          <IconButton
            component="a"
            href={params.value}
            target="_blank"
            aria-label="delete"
            color="primary"
          >
            <PublicIcon />
          </IconButton>
        );
      },
    },
    {
      field: "action",
      type: "actions",
      headerName: "Action",
      width: 280,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => openModal(params.value)}
          >
            Delegate
          </Button>
          {params.value.delegated &&
            <Button
              variant="contained"
              color="error"
              size="small"
              style={{ marginLeft: 16 }}
              onClick={() => openUndelgateModal(params.value)}
            >
              Undelegate
            </Button>
          }
        </>
      ),
    },
  ];

  return (
    <>
      {state.message && (
        <Alert sx={{ mb: 3 }} severity={state.message.severity}>
          {state.message.text}
        </Alert>
      )}

      <DelegateModal
        open={modalOpen}
        validator={validator}
        handleClose={() => {
          setModalOpen(false);
        }}
      />
      <UndelegateModal
        open={modalUndelegateOpen}
        validator={validator}
        handleClose={() => {
          setModalUndelegateOpen(false);
        }}
      />
      <DataGrid
        rows={rows}
        rowHeight={80}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[100]}
        disableSelectionOnClick
        autoHeight
      />
    </>
  );
};

export default ValidatorList;
