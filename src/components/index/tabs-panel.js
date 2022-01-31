import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/store";
import { Box, Tabs, Tab } from "@mui/material";
import PropTypes from "prop-types";
import Message from "../message";
import ValidatorList from "../validator-list";
import Gov from "../governance/gov";
import TokenManager from "../token-manager/token-manager";
import {navigate} from "gatsby";
import chains from "../../data/chains.json";
const TabPanel = (props) => {
  const { children, value, index ,type, ...other } = props;
  
  return (
    <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
    >
   {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
  </div>
 );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const TabsPanel = ({type,chainId}) => {
  const [state, dispatch] = useContext(GlobalContext);
  const [value, setValue] = useState(0);
 let mergedChains = chains;
 useEffect(()=>{
  const chain = mergedChains.find((c) => c.chain_id === chainId);
  let network = "";
  let cw20_support = false;  
  if(chain){
    network = chain.chain_id;
    cw20_support = chain.cw20_support;
    dispatch({ type: "SET_SELECTED_NETWORK", payload: chainId, chain: chain });
  }else{
    network = state.selectedNetwork;
    cw20_support = state.chain.cw20_support;    
  }
  switch (type) {
      case "staking":
          setValue(0)
          navigate(`/${network}/staking`)
          break;
      case "governance":
          setValue(1)
          navigate(`/${network}/governance`)
        break;
      case "cw20":
        if(cw20_support){
          setValue(2)
          navigate(`/${network}/cw20`)
        }else{
          setValue(0)
          navigate(`/${network}/staking`)
        }
        break;
      default:
          setValue(0)
          navigate(`/${network}/staking`)
    }
 },[type])

 const handleChange = (event, newValue) => {
  setValue(newValue);
  switch (newValue) {
    case 0:
        navigate(`/${state.selectedNetwork}/staking`)
        break;
    case 1:
        navigate(`/${state.selectedNetwork}/governance`)
      break;
    case 2:
        navigate(`/${state.selectedNetwork}/cw20`)
      break;
  }
 };


 return (
  <>
   <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    <Message />
    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
     <Tab label="Staking & Validators" {...a11yProps(0)} />
     <Tab label="Governance" {...a11yProps(1)} />
     {state.chain.cw20_support && (
      <Tab label="CW20 Token Manager" {...a11yProps(2)} />
     )}
    </Tabs>
   </Box>
   <TabPanel value={value} index={0}>
    <ValidatorList />
   </TabPanel>
   <TabPanel value={value} index={1}>
    <Gov />
   </TabPanel>
   {state.chain.cw20_support && (
    <TabPanel value={value} index={2}>
     <TokenManager />
    </TabPanel>
   )}
  </>
 );
};

export default TabsPanel;
