import { coin } from "@cosmjs/proto-signing";

export const renderBalance = (chain, balance) => {
  const precision = Math.pow(10, chain.decimals);
  return parseFloat(balance / precision).toFixed(2) + " " + chain?.coinDenom;
};

export const getDelegation = async (client, delegator, validator) => {
  return await client?.getDelegation(delegator, validator);
};

export const delegate = async (chain, client, delegator, validator, amount) => {
  return await client?.delegateTokens(
    delegator,
    validator,
    coin(amount, chain.coinMinimalDenom),
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] }
  );
};
