import { coin } from "@cosmjs/proto-signing";

import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import {
  calculateFee,
  setupStakingExtension,
  setupDistributionExtension,
  setupGovExtension,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
} from "@cosmjs/stargate";
import { setupWasmExtension } from "./wasm";
/**
 * Make query client
 *
 * @param {string} rpcUrl
 * @param {string} extension
 * @returns
 */
async function makeClient(rpcUrl, extension) {
  const tmClient = await Tendermint34Client.connect(rpcUrl);

  switch (extension) {
    case "staking":
      return QueryClient.withExtensions(tmClient, setupStakingExtension);
    case "distribution":
      return QueryClient.withExtensions(tmClient, setupDistributionExtension);
    case "gov":
      return QueryClient.withExtensions(tmClient, setupGovExtension);
    default:
      return QueryClient(tmClient);
  }
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
export const undelegate = async (
  chain,
  client,
  delegator,
  validator,
  amount
) => {
  return await client?.undelegateTokens(
    delegator,
    validator,
    coin(amount, chain.coinMinimalDenom),
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] }
  );
};

/**
 * Get unbonding delegation for a single validator
 *
 * @param {string} validator
 * @param {string} delegator
 * @param {string} rpcUrl
 * @returns
 */
export const getUnbondingDelegation = async (validator, delegator, rpcUrl) => {
  const client = await makeClient(rpcUrl, "staking");
  return await client?.staking.unbondingDelegation(delegator, validator);
};

/**
 * Get all unbonding delegations
 *
 * @param {string} delegator
 * @param {string} rpcUrl
 * @returns
 */
export const getAllUnbondingDelegations = async (delegator, rpcUrl) => {
  const client = await makeClient(rpcUrl, "staking");
  return await client?.staking.delegatorUnbondingDelegations(delegator);
};

/**
 * Get all delegations, which are NOT unbonding
 *
 * @param {string} delegator
 * @param {string} rpcUrl
 * @returns
 */
export const getAllDelegations = async (delegator, rpcUrl) => {
  const client = await makeClient(rpcUrl, "staking");
  return await client?.staking.delegatorDelegations(delegator);
};

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
export const redelegate = async (
  chain,
  client,
  delegator,
  srcValidator,
  dstValidator,
  amount
) => {
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
};

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
  return await client?.withdrawRewards(delegator, validator, {
    gas: "250000",
    amount: [{ denom: chain.coinMinimalDenom, amount: "0" }],
  });
};

/**
 * Withdraw multiple delegation rewards
 *
 * @param {*} chain
 * @param {*} client
 * @param {string} delegator
 * @param {string[]} validators
 * @returns
 */
export const withdrawAllRewards = async (
  chain,
  client,
  delegator,
  validators
) => {
  let msgs = [];

  validators.map((validator) => {
    const withdrawMessage = {
      typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
      value: {
        delegatorAddress: delegator,
        validatorAddress: validator,
      },
    };

    return msgs.push(withdrawMessage);
  });

  return client?.signAndBroadcast(
    delegator,
    msgs,
    { gas: "250000", amount: [{ denom: chain.coinMinimalDenom, amount: "0" }] },
    ""
  );
};

/**
 *
 * @param {string} delegator
 * @param {string} rpcUrl
 * @returns
 */
export const getAllRewards = async (delegator, rpcUrl) => {
  const client = await makeClient(rpcUrl, "distribution");
  return await client?.distribution.delegationTotalRewards(delegator);
};

/**
 *
 * @param {string} delegator
 * @param {string} validator
 * @param {string} rpcUrl
 * @returns
 */
export const getReward = async (delegator, validator, rpcUrl) => {
  const client = await makeClient(rpcUrl, "distribution");
  return await client?.distribution.delegationRewards(delegator, validator);
};

/**
 *
 * @param {*} chain
 * @param {*} client
 * @param {string} voter
 * @param {string} proposalId
 * @param {number} option
 * @returns
 */
export const vote = async (chain, client, voter, proposalId, option) => {
  const voteMessage = {
    typeUrl: "/cosmos.gov.v1beta1.MsgVote",
    value: {
      proposalId,
      voter,
      option,
    },
  };
  return client?.signAndBroadcast(voter, [voteMessage], {
    gas: "250000",
    amount: [{ denom: chain.coinMinimalDenom, amount: "0" }],
  });
};

/**
 * Send coins to a single address
 *
 * @param {*} chain
 * @param {*} client
 * @param {string} destinationAddress
 * @param {number} amount
 * @returns {
 *  status: boolean,
 *  txHash: string,
 *  logs: any,
 *  url: string
 * }
 */
export const sendCustomToken = async (
  chainId,
  chainRpc,
  cw20ContractAddress,
  cw20Decimals,
  amount,
  recipientAddress,
  senderAddress,
  gas,
  gasAmount,
  gasDenom
) => {
  const offlineSigner = window.getOfflineSigner(chainId);

  const accounts = await offlineSigner.getAccounts();

  // Initialize the juno roc with the offline signer that is injected by Keplr extension.
  const cosmJS = await SigningCosmWasmClient.connectWithSigner(
    chainRpc,
    offlineSigner
  );

  amount = parseFloat(amount);
  if (isNaN(amount)) {
    console.log("Invalid amount");
    return {
      status: false,
      logs: [],
    };
  }

  amount *= Math.pow(10, cw20Decimals);
  amount = Math.floor(amount);

  const executMsg = {
    transfer: { recipient: recipientAddress, amount: amount.toString() },
  };
  try {
    const fee = calculateFee(gas, `${gasAmount}${gasDenom}`);
    const result = await cosmJS.execute(
      senderAddress,
      cw20ContractAddress,
      executMsg,
      fee
    );

    if (result.code !== undefined && result.code !== 0) {
      console.log("Failed to send tx: " + result.logs);
      return {
        status: false,
        logs: result.logs,
      };
    } else {
      return {
        status: true,
        logs: result.logs,
        txHash: result.transactionHash,
        url: `https://blueprints.juno.giansalex.dev/#/transactions/${result.transactionHash}`,
      };
      //  const txhash = result.transactionHash;
      //  const txtlink = document.getElementById("txt");
      //  txtlink.textContent = txhash;
      //  txtlink.setAttribute(
      //   "href",
      //   "https://blueprints.juno.giansalex.dev/#/transactions/" + txhash
      //  );

      //  await updateBalance(accounts[0].address, cosmJS);
    }
  } catch (error) {
    console.log(error);
    console.log("Tx Failed");
    return {
      status: false,
      logs: [],
    };
  }
};

// Querying current WYND Balance for address
export const getCustomTokenInfo = async (rpcUrl, tokenContractAddress) => {
  const client = await makeWasmClient(rpcUrl);

  console.log(`Getting custom token info for ${tokenContractAddress}`);

  try {
    const res = await client.wasm.queryContractSmart(tokenContractAddress, {
      token_info: {},
    });

    console.log(`Token info: `, res);

    return res;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

// Querying current WYND Balance for address
export const getCustomTokenBalance = async (
  address,
  rpcUrl,
  tokenContractAddress
) => {
  const client = await makeWasmClient(rpcUrl);

  try {
    const res = await client.wasm.queryContractSmart(tokenContractAddress, {
      balance: { address },
    });

    console.log(`Balance for ${address}`, res);

    return res.balance;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

async function makeWasmClient(endpoint) {
  const tmClient = await Tendermint34Client.connect(endpoint);
  return QueryClient.withExtensions(
    tmClient,
    setupAuthExtension,
    setupBankExtension,
    setupWasmExtension
  );
}


