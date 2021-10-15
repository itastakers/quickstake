import React, { useReducer, createContext, useEffect } from "react";

import chains from "../data/chains.json";
import { connectKeplr } from "../utils/keplr";

const initialState = {
  selectedNetwork: chains[0].chain_id,
  chain: chains[0],
  signer: null,
  address: null,
  signingClient: null,
  balance: 0,
  error: null,
  message: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SELECTED_NETWORK":

      return {
        ...state,
        selectedNetwork: action.payload,
        chain: action.chain,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_WALLET":
      return {
        ...state,
        signer: action.payload.signer,
        address: action.payload.address,
      };
    case "SET_COSMJS":
      return {
        ...state,
        signingClient: action.payload.cosmJS,
      };
    case "SET_BALANCE":
      return {
        ...state,
        balance: action.payload.balance,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        message: {
          severity: action.payload.severity,
          text: action.payload.message,
        },
      };
    default:
      return state;
  }
}

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // watch keplr wallet change

  useEffect(() => {
    // hack, keplr is not appended to window fast enough sometimes..
    setTimeout(() => connectKeplr(state.chain, dispatch), 500);

    // Reload wallet every time user change account
    window.addEventListener("keplr_keystorechange", () => {
      console.log(
        "Key store in Keplr is changed. You may need to refetch the account info."
      );

      connectKeplr(state.chain, dispatch);
    });

    return () => {
      window.removeEventListener("keplr_keystorechange", () => {});
    };
  }, []);

  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalContext = createContext();
export default Store;
