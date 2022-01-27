import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { Grid } from "@mui/material";
import NetworkSelect from "../../components/network-select";
import TabsPanel from "../../components/index/tabs-panel";
import MoreMenu from "../../components/more-menu";
const IndexPage = (props) => {
  const [chainId, setChainId] = useState("");
  const [type, setType] = useState("staking")
  useEffect(() => {
    if (props) {
      setChainId(props?.params?.chain_id ? props?.params?.chain_id : "");
      let type = props?.params?.type ? props?.params?.type : "staking";      
      if (type === "staking") {
        setType("staking")
      } else if (type === "governance") {
        setType("governance")
      } else if (type === "cw20") {
        setType("cw20")
      }
    }
  }, [props])
  return (
    <Layout>
      <Grid sx={{ py: 4 }} container>
        <Grid alignSelf="center" item md={6} xs={12}>
          <NetworkSelect chainId={chainId} type={type} />
        </Grid>
        <Grid alignSelf="center" item md={6} xs={12}>
          <MoreMenu chainId={chainId} type={type} />
        </Grid>
      </Grid>
      <TabsPanel chainId={chainId} type={type} />
    </Layout>
  );
};

export default IndexPage;
