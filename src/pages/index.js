import React from "react";
import Layout from "../components/layout";
import NetworkSelect from "../components/network-select";
import ValidatorList from "../components/validator-list";

const IndexPage = () => {
  return (
    <Layout>
      <NetworkSelect />
      <ValidatorList />
    </Layout>
  );
};

export default IndexPage;
