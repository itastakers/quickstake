import React from "react";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Header from "./header";
import Footer from "./footer";
import Store from "../context/store";

const Layout = ({ children }) => {
  return (
    <Store>
      <GlobalStyles styles={{ body: { paddingTop: 50 } }} />

      <Container>
        <Header />

        {children}
        <Footer />
      </Container>
    </Store>
  );
};

export default Layout;
