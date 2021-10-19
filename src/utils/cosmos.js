import { coin } from "@cosmjs/proto-signing";
import { setupStakingExtension, StakingExtension, QueryClient } from "@cosmjs/stargate"
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

async function makeClientWithStaking(rpcUrl) {
  const tmClient = await Tendermint34Client.connect(rpcUrl);
  return QueryClient.withExtensions(tmClient, setupStakingExtension);
}

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

export const undelegate = async (chain, client, delegator, validator, amount) => {
  return await client?.undelegateTokens(
    delegator,
    validator,
    coin(amount, chain.coinMinimalDenom),
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] }
  )
}

export const getUnbondingDelegation = async (validator, delegator, rpcUrl) => {
  const client = await makeClientWithStaking(rpcUrl);
  return await client?.staking.unbondingDelegation(delegator, validator);
}

export const getAllUnbondingDelegations = async (delegator, rpcUrl) => {
  const client = await makeClientWithStaking(rpcUrl);
  return await client?.staking.delegatorUnbondingDelegations(delegator);
}

export const getAllDelegations = async (delegator, rpcUrl) => {
  const client = await makeClientWithStaking(rpcUrl);
  return await client?.staking.delegatorDelegations(delegator);
}