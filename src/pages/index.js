import React, { useContext, useState } from "react";
import Layout from "../components/layout";
import { Grid } from "@mui/material";
import NetworkSelect from "../components/network-select";
import TabsPanel from "../components/index/tabs-panel";

import MoreMenu from "../components/more-menu";

const IndexPage = () => {
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
   <TabsPanel></TabsPanel>
  </Layout>
 );
};

export default IndexPage;
