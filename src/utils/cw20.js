
//import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
//import { Coin } from "@cosmjs/stargate";

// export type Expiration =
//   | { readonly at_height: number }
//   | { readonly at_time: number }
//   | { readonly never: unknown };

// export interface AllowanceResponse {
//   readonly allowance: string; // integer as string
//   readonly expires: Expiration;
// }

// export interface AllowanceInfo {
//   readonly allowance: string; // integer as string
//   readonly spender: string; // bech32 address
//   readonly expires: Expiration;
// }

// export interface AllAllowancesResponse {
//   readonly allowances: readonly AllowanceInfo[];
// }

// export interface TokenInfo {
//   readonly name: string;
//   readonly symbol: string;
//   readonly decimals: number;
//   readonly total_supply: string;
// }

// export interface Investment {
//   readonly exit_tax: string;
//   readonly min_withdrawal: string;
//   readonly nominal_value: string;
//   readonly owner: string;
//   readonly staked_tokens: Coin;
//   readonly token_supply: string;
//   readonly validator: string;
// }

// export interface Claim {
//   readonly amount: string;
//   readonly release_at: { readonly at_time: number };
// }

// export interface Claims {
//   readonly claims: readonly Claim[];
// }

// export interface AllAccountsResponse {
//   // list of bech32 address that have a balance
//   readonly accounts: readonly string[];
// }

// export interface CW20Instance {
//   readonly contractAddress: string;

//   // queries
//   balance: (address: string) => Promise<string>;
//   allowance: (owner: string, spender: string) => Promise<AllowanceResponse>;
//   allAllowances: (owner: string, startAfter?: string, limit?: number) => Promise<AllAllowancesResponse>;
//   allAccounts: (startAfter?: string, limit?: number) => Promise<readonly string[]>;
//   tokenInfo: () => Promise<TokenInfo>;
//   investment: () => Promise<Investment>;
//   claims: (address: string) => Promise<Claims>;
//   minter: (sender: string) => Promise<any>;

//   // actions
//   mint: (sender: string, recipient: string, amount: string) => Promise<string>;
//   transfer: (sender: string, recipient: string, amount: string) => Promise<string>;
//   burn: (sender: string, amount: string) => Promise<string>;
//   increaseAllowance: (sender: string, recipient: string, amount: string) => Promise<string>;
//   decreaseAllowance: (sender: string, recipient: string, amount: string) => Promise<string>;
//   transferFrom: (sender: string, owner: string, recipient: string, amount: string) => Promise<string>;
//   bond: (sender: string, coin: Coin) => Promise<string>;
//   unbond: (sender: string, amount: string) => Promise<string>;
//   claim: (sender: string) => Promise<string>;
// }

// export interface CW20Contract {
//   use: (contractAddress: string) => CW20Instance;
// }

export const CW20 = (client) => {
  const use = (contractAddress) => {
    const balance = async (address) => {
      const result = await client.queryContractSmart(contractAddress, { balance: { address } });
      return result.balance;
    };

    const allowance = async (owner, spender) => {
      return client.queryContractSmart(contractAddress, { allowance: { owner, spender } });
    };

    const allAllowances = async (
      owner,
      startAfter,
      limit,
    ) => {
      return client.queryContractSmart(contractAddress, {
        all_allowances: { owner, start_after: startAfter, limit },
      });
    };

    const allAccounts = async (startAfter, limit) => {
      const accounts = await client.queryContractSmart(contractAddress, {
        all_accounts: { start_after: startAfter, limit },
      });
      return accounts.accounts;
    };

    const tokenInfo = async () => {
      return client.queryContractSmart(contractAddress, { token_info: {} });
    };

    const investment = async () => {
      return client.queryContractSmart(contractAddress, { investment: {} });
    };

    const claims = async (address) => {
      return client.queryContractSmart(contractAddress, { claims: { address } });
    };

    const minter = async () => {
      return client.queryContractSmart(contractAddress, { minter: {} });
    };

    // mints tokens, returns transactionHash
    const mint = async (sender, recipient, amount) => {
      const result = await client.execute(sender, contractAddress, { mint: { recipient, amount } });
      return result.transactionHash;
    };

    // transfers tokens, returns transactionHash
    const transfer = async (sender, recipient, amount) => {
      const result = await client.execute(sender, contractAddress, { transfer: { recipient, amount } });
      return result.transactionHash;
    };

    // burns tokens, returns transactionHash
    const burn = async (sender, amount) => {
      const result = await client.execute(sender, contractAddress, { burn: { amount } });
      return result.transactionHash;
    };

    const increaseAllowance = async (sender, spender, amount) => {
      const result = await client.execute(sender, contractAddress, {
        increase_allowance: { spender, amount },
      });
      return result.transactionHash;
    };

    const decreaseAllowance = async (sender, spender, amount) => {
      const result = await client.execute(sender, contractAddress, {
        decrease_allowance: { spender, amount },
      });
      return result.transactionHash;
    };

    const transferFrom = async (
      sender,
      owner,
      recipient,
      amount,
    ) => {
      const result = await client.execute(sender, contractAddress, {
        transfer_from: { owner, recipient, amount },
      });
      return result.transactionHash;
    };

    const bond = async (sender, coin) => {
      const result = await client.execute(sender, contractAddress, { bond: {} }, undefined, [coin]);
      return result.transactionHash;
    };

    const unbond = async (sender, amount) => {
      const result = await client.execute(sender, contractAddress, { unbond: { amount } });
      return result.transactionHash;
    };

    const claim = async (sender) => {
      const result = await client.execute(sender, contractAddress, { claim: {} });
      return result.transactionHash;
    };

    return {
      contractAddress,
      balance,
      allowance,
      allAllowances,
      allAccounts,
      tokenInfo,
      investment,
      claims,
      minter,
      mint,
      transfer,
      burn,
      increaseAllowance,
      decreaseAllowance,
      transferFrom,
      bond,
      unbond,
      claim,
    };
  };
  return { use };
};