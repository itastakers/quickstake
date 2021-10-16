import React, { useContext, useState } from "react";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AdddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import { GlobalContext } from "../context/store";
import NewChainModal from "./new-chain-modal";

import chains from "../data/chains.json";
import groups from "../data/chain_groups.json";
import ListSubheader from '@mui/material/ListSubheader';

import { connectKeplr } from "../utils/keplr";

const NetworkSelect = () => {
  const [state, dispatch] = useContext(GlobalContext);
  const [chainModalOpen, setChainModalOpen] = useState(false);

  const openChainModal = () => {
    setChainModalOpen(true);
  }

  const mergedChains = localStorage.getItem('localChains') ? chains.concat(JSON.parse(localStorage.getItem('localChains'))) : chains;

  const handleChange = (event) => {
    const chain = mergedChains.find((c) => c.chain_id === event.target.value);

    // reconnect keplr    
    connectKeplr(chain, dispatch);

    dispatch({ type: "SET_SELECTED_NETWORK", payload: event.target.value, chain: chain });
  };

  return (
    <>
      <NewChainModal
        open={chainModalOpen}
        handleClose={() => {
          setChainModalOpen(false);
        }}
      />
      <Grid container spacing={2} sx={{ pt: 4, pb: 2 }}>
        <Grid item lg={2}>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Select Network
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.selectedNetwork}
                label="Select Network"
                onChange={handleChange}
              >
                {groups.map((group) => {
                  let options = mergedChains
                    .filter((chain) => chain.group === group.id)
                    .map((chain) => (
                      <MenuItem key={chain.chain_id} value={chain.chain_id}>
                        {chain.name}
                      </MenuItem>
                    ));

                  if (options.length === 0) {
                    return (<></>)
                  }

                  let childrens = [];
                  childrens.push(<ListSubheader key={group.id}>{group.name}</ListSubheader>);
                  childrens.push(options);

                  return (childrens);
                })}

              </Select>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item lg={2}>
          <Button
            onClick={() =>
              openChainModal()
            }
            variant="contained" endIcon={<AdddIcon />}>
            Add New
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default NetworkSelect;
