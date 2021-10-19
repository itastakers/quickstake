import React from "react";
import Layout from "../components/layout";
import { Grid, Button, Menu, MenuItem, Box } from "@mui/material";
import NetworkSelect from "../components/network-select";
import ValidatorList from "../components/validator-list";
import MoreMenu from "../components/more-menu";

const IndexPage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Layout>
      <Grid container>
        <Grid item xs={6}>
          <NetworkSelect />
        </Grid>
        <Grid alignSelf="center" item xs={6}>
          <MoreMenu />
        </Grid>
      </Grid>
      <ValidatorList />
    </Layout>
  );
};

export default IndexPage;
