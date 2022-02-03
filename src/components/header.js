import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// import ConnectWallet from "./connect-wallet";
import ConnectWallet from "./connect-walletconnection";

const Header = () => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={6}>
        <Typography variant="h4" component="h1">
          Quick Stake
        </Typography>

        <Typography variant="h6" component="h2">
          by ITA Stakers 🇮🇹
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} textAlign="right">
        <ConnectWallet />
      </Grid>
    </Grid>
  );
};

export default Header;
