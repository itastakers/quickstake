import { fromUtf8, toAscii } from "@cosmjs/encoding";
import {
 createPagination,
 createProtobufRpcClient,
} from "@cosmjs/stargate";
import {
 QueryClientImpl,
} from "cosmjs-types/cosmwasm/wasm/v1/query";
import Long from "long";

export function setupWasmExtension(base) {
 const rpc = createProtobufRpcClient(base);
 // Use this service to get easy typed access to query methods
 // This cannot be used for proof verification
 const queryService = new QueryClientImpl(rpc);

 return {
  wasm: {
   listCodeInfo: async (paginationKey) => {
    const request = {
     pagination: createPagination(paginationKey),
    };
    return queryService.Codes(request);
   },
   getCode: async (id) => {
    const request = { codeId: Long.fromNumber(id) };
    return queryService.Code(request);
   },
   listContractsByCodeId: async (id, paginationKey) => {
    const request = {
     codeId: Long.fromNumber(id),
     pagination: createPagination(paginationKey),
    };
    return queryService.ContractsByCode(request);
   },
   getContractInfo: async (address) => {
    const request = { address: address };
    return queryService.ContractInfo(request);
   },

   getContractCodeHistory: async (address, paginationKey) => {
    const request = {
     address: address,
     pagination: createPagination(paginationKey),
    };
    return queryService.ContractHistory(request);
   },

   getAllContractState: async (address, paginationKey) => {
    const request = {
     address: address,
     pagination: createPagination(paginationKey),
    };
    return queryService.AllContractState(request);
   },

   queryContractRaw: async (address, key) => {
    const request = { address: address, queryData: key };
    return queryService.RawContractState(request);
   },

   queryContractSmart: async (address, query) => {
    const request = {
     address: address,
     queryData: toAscii(JSON.stringify(query)),
    };
    const { data } = await queryService.SmartContractState(request);
    // By convention, smart queries must return a valid JSON document (see https://github.com/CosmWasm/cosmwasm/issues/144)
    let responseText;
    try {
     responseText = fromUtf8(data);
    } catch (error) {
     throw new Error(
      `Could not UTF-8 decode smart query response from contract: ${error}`
     );
    }
    try {
     return JSON.parse(responseText);
    } catch (error) {
     throw new Error(
      `Could not JSON parse smart query response from contract: ${error}`
     );
    }
   },
  },
 };
}
