import { coin } from "@cosmjs/proto-signing";
import { setupStakingExtension, QueryClient, setupDistributionExtension } from "@cosmjs/stargate"
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

/**
 * Create client for staking queries
 * 
 * @param {string} rpcUrl 
 * @returns 
 */
async function makeClientWithStaking(rpcUrl) {
  const tmClient = await Tendermint34Client.connect(rpcUrl);
  return QueryClient.withExtensions(tmClient, setupStakingExtension);
}

/**
 * Create client for distribution queries
 * 
 * @param {string} rpcUrl 
 * @returns 
 */
async function makeClientWithDistribution(rpcUrl) {
  const tmClient = await Tendermint34Client.connect(rpcUrl);
  return QueryClient.withExtensions(tmClient, setupDistributionExtension);
}

/**
 * 
 * @param {string} chain 
 * @param {number} balance 
 * @returns 
 */
export const renderBalance = (chain, balance) => {
  const precision = Math.pow(10, chain.decimals);
  return parseFloat(balance / precision).toFixed(2) + " " + chain?.coinDenom;
};

/**
 * Get current delegation for a single validator
 * 
 * @param {*} client 
 * @param {string} delegator 
 * @param {string} validator 
 * @returns 
 */
export const getDelegation = async (client, delegator, validator) => {
  return await client?.getDelegation(delegator, validator);
};

/**
 * Delegate
 * 
 * @param {*} chain 
 * @param {*} client 
 * @param {string} delegator 
 * @param {string} validator 
 * @param {number} amount  
 * @returns 
 */
export const delegate = async (chain, client, delegator, validator, amount) => {
  return await client?.delegateTokens(
    delegator,
    validator,
    coin(amount, chain.coinMinimalDenom),
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] }
  );
};

/**
 * Undelegate
 * 
 * @param {*} chain 
 * @param {*} client 
 * @param {string} delegator 
 * @param {string} validator 
 * @param {number} amount  
 * @returns 
 */
export const undelegate = async (chain, client, delegator, validator, amount) => {
  return await client?.undelegateTokens(
    delegator,
    validator,
    coin(amount, chain.coinMinimalDenom),
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] }
  )
}

/**
 * Get unbonding delegation for a single validator
 * 
 * @param {string} validator 
 * @param {string} delegator 
 * @param {string} rpcUrl 
 * @returns 
 */
export const getUnbondingDelegation = async (validator, delegator, rpcUrl) => {
  const client = await makeClientWithStaking(rpcUrl);
  return await client?.staking.unbondingDelegation(delegator, validator);
}

/**
 * Get all unbonding delegations
 * 
 * @param {string} delegator 
 * @param {string} rpcUrl 
 * @returns 
 */
export const getAllUnbondingDelegations = async (delegator, rpcUrl) => {
  const client = await makeClientWithStaking(rpcUrl);
  return await client?.staking.delegatorUnbondingDelegations(delegator);
}

/**
 * Get all delegations, which are NOT unbonding
 * 
 * @param {string} delegator 
 * @param {string} rpcUrl 
 * @returns 
 */
export const getAllDelegations = async (delegator, rpcUrl) => {
  const client = await makeClientWithStaking(rpcUrl);
  return await client?.staking.delegatorDelegations(delegator);
}

/**
 * Redelegate from one to another validator
 * 
 * @param {*} chain 
 * @param {*} client 
 * @param {string} delegator 
 * @param {string} srcValidator 
 * @param {string} dstValidator 
 * @param {number} amount  
 * @returns 
 */
export const redelegate = async (chain, client, delegator, srcValidator, dstValidator, amount) => {
  const redelegateMsg = {
    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    value: {
      delegatorAddress: delegator,
      validatorSrcAddress: srcValidator,
      validatorDstAddress: dstValidator,
      amount: coin(amount, chain.coinMinimalDenom),
    },
  };

  return client?.signAndBroadcast(
    delegator,
    [redelegateMsg],
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] },
    ""
  );
}

/**
 * Withdraw delegation rewards for one validator
 * 
 * @param {*} chain 
 * @param {*} client 
 * @param {string} delegator 
 * @param {string} validator 
 * @returns 
 */
export const withdrawReward = async (chain, client, delegator, validator) => {
  return await client?.withdrawRewards(
    delegator,
    validator,
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] }
  )
}

/**
 * Withdraw multiple delegation rewards
 * 
 * @param {*} chain 
 * @param {*} client 
 * @param {string} delegator 
 * @param {string[]} validators 
 * @returns 
 */
export const withdrawAllRewards = async (chain, client, delegator, validators) => {
  let msgs = [];

  validators.map(validator => {
    const withdrawMessage = {
      typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
      value: {
        delegatorAddress: delegator,
        validatorAddress: validator
      }
    }

    msgs.push(withdrawMessage);
  });

  return client?.signAndBroadcast(
    delegator,
    msgs,
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] },
    ""
  )
}

export const getAllRewards = async (delegator, rpcUrl) => {
  const client = await makeClientWithDistribution(rpcUrl);
  return await client?.distribution.delegationTotalRewards(delegator);
}

export const getReward = async (delegator, validator, rpcUrl) => {
  const client = await makeClientWithDistribution(rpcUrl);
  return await client?.distribution.delegationRewards(delegator, validator);
}