import React, { useContext, useEffect, useState } from "react";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AdddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import { GlobalContext } from "../context/store";
import NewChainModal from "./modals/new-chain-modal";

import chains from "../data/chains.json";
import groups from "../data/chain_groups.json";
import ListSubheader from '@mui/material/ListSubheader';
import { Link,navigate  } from "gatsby"
import { connectKeplr } from "../utils/keplr";

const NetworkSelect = ({chainId,type}) => {
  const [state, dispatch] = useContext(GlobalContext);
  const [chainModalOpen, setChainModalOpen] = useState(false);
  let mergedChains = chains;
  useEffect(()=>{
    if(chainId){
      const chain = mergedChains.find((c) => c.chain_id === chainId);
      // reconnect keplr    
      if(chain){
        connectKeplr(chain, dispatch);
        dispatch({ type: "SET_SELECTED_NETWORK", payload: chainId, chain: chain });
      }
    }
  },[chainId])
  const openChainModal = () => {
    setChainModalOpen(true);
  }
  const deleteLocalChain = () => {
    let localChains = JSON.parse(localStorage.getItem('localChains'))
    localChains = localChains.filter((localChain) => localChain.chain_id !== selectedChain.chain_id)
    localStorage.setItem('localChains', JSON.stringify(localChains))
    dispatch({ type: "SET_SELECTED_NETWORK", payload: chains[0].chain_id, chain: chains[0] });
  }  

  if (typeof window !== 'undefined' && window) {
    mergedChains = localStorage.getItem('localChains') ? chains.concat(JSON.parse(localStorage.getItem('localChains'))) : chains;
  }

  const selectedChain = mergedChains.find(
    (chain) => chain.chain_id === state.selectedNetwork
  );

  const handleChange = (event) => {
    const chain = mergedChains.find((c) => c.chain_id === event.target.value);
    if(type==="cw20")    {
      if(chain.cw20_support){
        navigate(`/${event.target.value}/${type}`)  
      }else{
        navigate(`/${event.target.value}/staking`)  
      }
    }else{
      navigate(`/${event.target.value}/${type}`)
    }
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
      <Grid container spacing={2}>
        <Grid item md={3} xs={7}>
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
                    return (<div key={group.id}></div>)
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
        <Grid item md={5} xs={5}>
          <Button
            disableElevation
            onClick={() =>
              openChainModal()
            }
            variant="contained" endIcon={<AdddIcon />}>
            Add New
          </Button>
          {selectedChain.group === 'local' &&
            <Button
              onClick={() =>
                deleteLocalChain()
              }
              sx={{ ml: 2 }}
              variant="contained"
              color="error">
              <DeleteIcon />
            </Button>
          }
        </Grid>
      </Grid>
    </>
  );
};

export default NetworkSelect;
