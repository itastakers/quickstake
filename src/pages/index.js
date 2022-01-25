import React, { useContext, useEffect, useState } from "react";
import chains from '../data/chains.json';
import { navigate } from 'gatsby'
const IndexPage = () => {
    useEffect(()=>{
        navigate(`/${chains[0].chain_id}/staking`)            
    },[])
    return <></>;
};

export default IndexPage;
