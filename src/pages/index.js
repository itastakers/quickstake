import React from "react";
import Layout from "../components/layout";
import { Grid, Box, Tabs, Tab } from "@mui/material";
import NetworkSelect from "../components/network-select";
import ValidatorList from "../components/validator-list";
import Gov from "../components/governance/gov";
import MoreMenu from "../components/more-menu";
import PropTypes from 'prop-types';
import Message from "../components/message"

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const IndexPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  return (
    <Layout>
      <Grid sx={{ py: 4 }} container>
        <Grid alignSelf="center" item xs={6}>
          <NetworkSelect />
        </Grid>
        <Grid alignSelf="center" item xs={6}>
          <MoreMenu />
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Message />
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Staking & Validators" {...a11yProps(0)} />
          <Tab label="Governance" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ValidatorList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Gov />
      </TabPanel>
    </Layout>
  );
};

export default IndexPage;
